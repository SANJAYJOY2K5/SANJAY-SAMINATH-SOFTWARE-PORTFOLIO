import React, { useState, useRef, useEffect } from 'react';
import { Eye, Camera, CameraOff, Shield, HeartHandshake, RefreshCw, CheckCircle2, Sparkles, Accessibility } from 'lucide-react';
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';

export const EyeGestureMouseDemo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [blinkDetected, setBlinkDetected] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 160, y: 120 });
  const [activatedNode, setActivatedNode] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("Click 'Launch Accessibility Eye Tracking' to start webcam");

  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const requestRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const accessibilityNodes = [
    { id: 'speak', label: '🔊 Text-to-Speech', x: 40, y: 50, desc: 'Auditory Assist' },
    { id: 'keyboard', label: '⌨️ On-Screen Keys', x: 180, y: 50, desc: 'Virtual Input' },
    { id: 'call', label: '📞 Emergency SOS', x: 110, y: 150, desc: 'Caregiver Ping' },
  ];

  const initFaceLandmarker = async () => {
    try {
      setIsLoadingModel(true);
      setStatusText("Initializing MediaPipe FaceMesh & Eye Landmark Models...");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numFaces: 1
      });
      landmarkerRef.current = landmarker;
      setIsLoadingModel(false);
      return landmarker;
    } catch (err) {
      console.warn("FaceMesh model error:", err);
      setIsLoadingModel(false);
      setStatusText("Note: Eye tracking in interactive canvas preview mode.");
      return null;
    }
  };

  const startCamera = async () => {
    let landmarker = landmarkerRef.current;
    if (!landmarker) {
      landmarker = await initFaceLandmarker();
    }

    try {
      setStatusText("Requesting webcam access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
        setStatusText("Eye Tracking Active: Move head/gaze to steer cursor. Blink to activate!");
        predictLoop();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setStatusText("Webcam un-available. Test using interactive gaze simulator!");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    setIsCameraActive(false);
    setStatusText("Camera stopped. Processed 100% locally in browser memory.");
  };

  const predictLoop = () => {
    if (!videoRef.current || !isCameraActive) return;

    const video = videoRef.current;
    if (video.currentTime > 0 && !video.paused && !video.ended) {
      const startTimeMs = performance.now();
      if (landmarkerRef.current) {
        const results = landmarkerRef.current.detectForVideo(video, startTimeMs);

        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
          const landmarks = results.faceLandmarks[0];

          // Eye Landmarks: Left pupil center ~468, Right pupil ~473, Left eyelids ~386/374
          const noseTip = landmarks[1];
          const leftEyeUpper = landmarks[386];
          const leftEyeLower = landmarks[374];

          if (noseTip) {
            // Map head/gaze position to canvas (320x240)
            const canvasWidth = 320;
            const canvasHeight = 240;
            const x = (1 - noseTip.x) * canvasWidth;
            const y = noseTip.y * canvasHeight;

            setCursorPos({ x, y });

            // Blink calculation: vertical eye aspect ratio
            if (leftEyeUpper && leftEyeLower) {
              const eyeOpening = Math.abs(leftEyeUpper.y - leftEyeLower.y);
              const isBlinking = eyeOpening < 0.015;
              setBlinkDetected(isBlinking);

              if (isBlinking) {
                checkNodeHit(x, y);
              }
            }
          }
        }
      }
    }

    requestRef.current = requestAnimationFrame(predictLoop);
  };

  const checkNodeHit = (x: number, y: number) => {
    accessibilityNodes.forEach((node) => {
      const dist = Math.hypot(x - (node.x + 50), y - (node.y + 20));
      if (dist < 50) {
        setActivatedNode(node.label);
      }
    });
  };

  const handleSimMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });
  };

  const handleSimClick = (nodeLabel: string) => {
    setBlinkDetected(true);
    setActivatedNode(nodeLabel);
    setTimeout(() => setBlinkDetected(false), 300);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Header & Accessibility Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-purple-400 text-xs font-mono mb-1">
            <Eye className="w-4 h-4" />
            <span>INTERACTIVE DEMO #2 — ACCESSIBILITY TOOL</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Virtual Mouse — Eye Gesture Control
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Empowers individuals with severe motor disabilities or ALS to operate computer interfaces completely hands-free using head orientation and eye blinks.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-purple-950/80 px-3.5 py-2 rounded-xl border border-purple-500/30 text-purple-300 text-xs font-mono shrink-0">
          <Accessibility className="w-4 h-4 text-purple-400" />
          <span>Assistive AI Engineering</span>
        </div>
      </div>

      {/* Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Camera Feed */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center">
            
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
                <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto">
                  <Eye className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-400 max-w-xs font-mono">
                  {statusText}
                </p>
              </div>
            )}

            {isLoadingModel && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center text-purple-400 font-mono text-xs space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>Loading FaceMesh Models...</span>
              </div>
            )}
          </div>

          <div className="w-full mt-4 flex gap-3">
            {!isCameraActive ? (
              <button
                onClick={startCamera}
                disabled={isLoadingModel}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-heading font-semibold text-xs rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Launch Accessibility Eye Tracking</span>
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

        {/* Right: Assistive UI Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>ASSISTIVE ACTION BOARD</span>
            <span className={blinkDetected ? 'text-purple-300 font-bold animate-pulse' : 'text-purple-400'}>
              {blinkDetected ? '👁️ BLINK / CLICK ACTIVATED' : 'GAZE TO TARGET'}
            </span>
          </div>

          <div
            onMouseMove={handleSimMouseMove}
            className="relative w-full h-[250px] bg-slate-950 rounded-2xl border-2 border-slate-800 hover:border-purple-500/40 cursor-crosshair overflow-hidden shadow-inner flex items-center justify-center select-none"
          >
            <div className="absolute inset-0 cyber-dots opacity-40 pointer-events-none" />

            {/* Accessibility Nodes */}
            {accessibilityNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => handleSimClick(node.label)}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                className="absolute px-4 py-2.5 rounded-xl bg-slate-900/90 border border-purple-500/40 hover:border-purple-400 text-xs font-mono transition-all duration-200 shadow-md cursor-pointer flex flex-col items-center"
              >
                <span className="text-slate-100 font-semibold">{node.label}</span>
                <span className="text-[10px] text-purple-400">{node.desc}</span>
              </div>
            ))}

            {/* Gaze Pointer Dot */}
            <div
              style={{
                left: `${cursorPos.x}px`,
                top: `${cursorPos.y}px`,
              }}
              className={`absolute w-6 h-6 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 flex items-center justify-center ${
                blinkDetected
                  ? 'bg-purple-500 scale-150 shadow-[0_0_30px_#8b5cf6]'
                  : 'bg-purple-400/80 shadow-[0_0_15px_#8b5cf6]'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>

            {/* Triggered output feedback */}
            {activatedNode && (
              <div className="absolute bottom-3 left-3 right-3 bg-purple-950/90 border border-purple-500/50 p-2.5 rounded-xl text-center text-xs font-mono text-purple-200 animate-fadeIn flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Activated Assistive Feature: <strong>{activatedNode}</strong></span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
