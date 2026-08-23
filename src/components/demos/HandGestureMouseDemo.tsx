import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Hand, RefreshCw, Shield, CheckCircle2 } from 'lucide-react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

export const HandGestureMouseDemo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [pinchDetected, setPinchDetected] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 160, y: 120 });
  const [clickedTargets, setClickedTargets] = useState<number[]>([]);
  const [statusText, setStatusText] = useState("Click 'Start Camera Demo' to launch MediaPipe Hand Tracking");
  const [rippleEffect, setRippleEffect] = useState<{ x: number; y: number; id: number } | null>(null);

  const isCameraActiveRef = useRef(false);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastClickTimeRef = useRef(0);

  // Demo Target Buttons inside Canvas
  const targets = [
    { id: 1, label: 'Target Alpha', x: 40, y: 40, color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
    { id: 2, label: 'Target Beta', x: 180, y: 40, color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    { id: 3, label: 'Trigger Core', x: 110, y: 140, color: 'bg-pink-500/20 text-pink-300 border-pink-500/40' },
  ];

  // Initialize MediaPipe HandLandmarker
  const initHandLandmarker = async () => {
    try {
      setIsLoadingModel(true);
      setStatusText("Downloading MediaPipe Wasm & Hand Vision Models...");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1
      });
      landmarkerRef.current = landmarker;
      setIsLoadingModel(false);
      return landmarker;
    } catch (err) {
      console.warn("MediaPipe model loading error:", err);
      setIsLoadingModel(false);
      setStatusText("Note: Running interactive touch/mouse canvas simulation mode.");
      return null;
    }
  };

  const startCamera = async () => {
    let landmarker = landmarkerRef.current;
    if (!landmarker) {
      landmarker = await initHandLandmarker();
    }

    try {
      setStatusText("Requesting camera permission...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" }
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        isCameraActiveRef.current = true;
        setIsCameraActive(true);
        setStatusText("Hand Tracking Active: Move index finger & pinch thumb+index to click!");
        predictLoop();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setStatusText("Webcam access denied/unavailable. Test using interactive touch canvas!");
      isCameraActiveRef.current = false;
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    isCameraActiveRef.current = false;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    setIsCameraActive(false);
    setStatusText("Camera stopped. Data was processed 100% locally.");
  };

  const predictLoop = () => {
    if (!videoRef.current || !isCameraActiveRef.current) return;

    const video = videoRef.current;
    if (video.readyState >= 2 && !video.paused && !video.ended) {
      const startTimeMs = performance.now();
      if (landmarkerRef.current) {
        const results = landmarkerRef.current.detectForVideo(video, startTimeMs);

        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];
          
          // Landmark 8 = Index Finger Tip, Landmark 4 = Thumb Tip
          const indexTip = landmarks[8];
          const thumbTip = landmarks[4];

          if (indexTip && thumbTip) {
            const canvasWidth = 320;
            const canvasHeight = 240;

            // Sensitivity Gain Mapping for natural reach
            const mappedX = ((1 - indexTip.x) - 0.15) / 0.7 * canvasWidth;
            const mappedY = (indexTip.y - 0.15) / 0.7 * canvasHeight;

            const clampedX = Math.max(10, Math.min(canvasWidth - 10, mappedX));
            const clampedY = Math.max(10, Math.min(canvasHeight - 10, mappedY));

            setCursorPos({ x: clampedX, y: clampedY });

            // Pinch distance calculation
            const dx = (indexTip.x - thumbTip.x) * canvasWidth;
            const dy = (indexTip.y - thumbTip.y) * canvasHeight;
            const dist = Math.hypot(dx, dy);

            const isPinching = dist < 35;
            setPinchDetected(isPinching);

            // Throttle click events to prevent double firing
            const now = Date.now();
            if (isPinching && now - lastClickTimeRef.current > 400) {
              lastClickTimeRef.current = now;
              triggerClickAt(clampedX, clampedY);
            }
          }
        }
      }
    }

    if (isCameraActiveRef.current) {
      requestRef.current = requestAnimationFrame(predictLoop);
    }
  };

  const triggerClickAt = (x: number, y: number) => {
    setRippleEffect({ x, y, id: Date.now() });

    // Hit test against canvas targets
    targets.forEach((t) => {
      const dist = Math.hypot(x - (t.x + 40), y - (t.y + 20));
      if (dist < 45) {
        setClickedTargets((prev) => (prev.includes(t.id) ? prev : [...prev, t.id]));
      }
    });
  };

  const handleCanvasSimClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });
    setPinchDetected(true);
    triggerClickAt(x, y);
    setTimeout(() => setPinchDetected(false), 250);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Top Header & Privacy Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-mono mb-1">
            <Hand className="w-4 h-4" />
            <span>INTERACTIVE DEMO #1</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Virtual Hand Gesture Mouse
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Controls cursor position with index finger & triggers clicks via thumb-index pinch.
          </p>
        </div>

        {/* Local Privacy Note */}
        <div className="flex items-center space-x-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-emerald-500/30 text-emerald-400 text-xs font-mono shrink-0">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>100% Client-Side Privacy (No Uploads)</span>
        </div>
      </div>

      {/* Main Demo Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Webcam Feed / Control */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center">
            
            {/* Hidden HTML5 Video element */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${
                isCameraActive ? 'block' : 'hidden'
              }`}
            />

            {!isCameraActive && (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-400 max-w-xs font-mono">
                  {statusText}
                </p>
              </div>
            )}

            {isLoadingModel && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center text-cyan-400 font-mono text-xs space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>Loading Vision Models...</span>
              </div>
            )}

            {/* Overlaid webcam indicator */}
            {isCameraActive && (
              <div className="absolute top-3 left-3 bg-red-500/80 text-white px-2.5 py-0.5 rounded-full text-[10px] font-mono flex items-center space-x-1 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span>WEBCAM LIVE</span>
              </div>
            )}
          </div>

          {/* Camera Buttons */}
          <div className="w-full mt-4 flex gap-3">
            {!isCameraActive ? (
              <button
                onClick={startCamera}
                disabled={isLoadingModel}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-heading font-semibold text-xs rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Start Camera Demo</span>
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-heading font-semibold text-xs rounded-xl transition-all flex items-center justify-center space-x-2"
              >
                <CameraOff className="w-4 h-4" />
                <span>Stop Camera</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Bounded Interactive Canvas Workspace */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>INTERACTIVE CANVAS TARGET</span>
            <span className={pinchDetected ? 'text-pink-400 font-bold animate-pulse' : 'text-cyan-400'}>
              {pinchDetected ? '⚡ PINCH / CLICK DETECTED' : 'MOVE FINGER OR CLICK CANVAS'}
            </span>
          </div>

          {/* Bounded Canvas Container */}
          <div
            onClick={handleCanvasSimClick}
            className="relative w-full h-[250px] bg-slate-950 rounded-2xl border-2 border-slate-800 hover:border-cyan-500/40 cursor-crosshair overflow-hidden shadow-inner flex items-center justify-center select-none"
          >
            {/* Background Grid */}
            <div className="absolute inset-0 cyber-dots opacity-40 pointer-events-none" />

            {/* Target Elements inside demo canvas */}
            {targets.map((t) => {
              const isHit = clickedTargets.includes(t.id);
              return (
                <div
                  key={t.id}
                  style={{ left: `${t.x}px`, top: `${t.y}px` }}
                  className={`absolute px-4 py-2 rounded-xl border text-xs font-mono transition-all duration-300 flex items-center space-x-2 ${
                    isHit
                      ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-110'
                      : t.color
                  }`}
                >
                  {isHit && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{t.label}</span>
                </div>
              );
            })}

            {/* Visual Cursor Dot */}
            <div
              style={{
                left: `${cursorPos.x}px`,
                top: `${cursorPos.y}px`,
              }}
              className={`absolute w-5 h-5 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 flex items-center justify-center ${
                pinchDetected
                  ? 'bg-pink-500 scale-150 shadow-[0_0_25px_#ec4899]'
                  : 'bg-cyan-400 shadow-[0_0_15px_#06b6d4]'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            {/* Click Ripple Effect */}
            {rippleEffect && (
              <div
                key={rippleEffect.id}
                style={{ left: `${rippleEffect.x}px`, top: `${rippleEffect.y}px` }}
                className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-pink-400 animate-ripple pointer-events-none"
              />
            )}

            {/* Click feedback counter overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span>TARGETS ACTIVATED: {clickedTargets.length} / {targets.length}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setClickedTargets([]);
                }}
                className="text-cyan-400 hover:underline"
              >
                Reset Targets
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
