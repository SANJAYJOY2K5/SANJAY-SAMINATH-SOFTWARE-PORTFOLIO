import React, { useEffect, useRef, useState } from 'react';
import { X, Zap } from 'lucide-react';

interface LoadingMiniGameProps {
  onComplete: () => void;
  title?: string;
  autoDismissMs?: number;
}

export const LoadingMiniGame: React.FC<LoadingMiniGameProps> = ({
  onComplete,
  title = "Initializing Cyber Engine...",
  autoDismissMs = 4000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  const [progress, setProgress] = useState(0);

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;
  const isMountedRef = useRef(true);
  const restartTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (!isMountedRef.current) return;
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.floor((elapsed / autoDismissMs) * 100), 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (isMountedRef.current) {
            onComplete();
          }
        }, 300);
      }
    }, 50);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
      }
    };
  }, [autoDismissMs, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frameCount = 0;
    let localScore = 0;
    let isJumping = false;
    let playerY = 140;
    let playerVelocityY = 0;
    const gravity = 0.65;
    const groundY = 140;

    interface Obstacle {
      x: number;
      width: number;
      height: number;
      speed: number;
    }

    const obstacles: Obstacle[] = [];
    let spawnCounter = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !isJumping && gameStateRef.current === 'playing') {
        e.preventDefault();
        isJumping = true;
        playerVelocityY = -11;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const gameLoop = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background grid line
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 20);
      ctx.lineTo(canvas.width, groundY + 20);
      ctx.stroke();

      // Physics update for Player (Cyber Bot)
      if (isJumping) {
        playerY += playerVelocityY;
        playerVelocityY += gravity;
        if (playerY >= groundY) {
          playerY = groundY;
          isJumping = false;
          playerVelocityY = 0;
        }
      }

      // Draw Player (Cyber Square Bot with glowing eyes)
      const playerX = 50;
      const playerSize = 20;

      // Glow effect
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00f0ff';
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(playerX, playerY, playerSize, playerSize);

      // Visor / Eye
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(playerX + 12, playerY + 4, 6, 4);

      // Spawn Obstacles (Glitch Energy Barriers)
      spawnCounter++;
      if (spawnCounter > 70 + Math.random() * 40) {
        spawnCounter = 0;
        const obstacleHeight = 20 + Math.random() * 20;
        obstacles.push({
          x: canvas.width,
          width: 14,
          height: obstacleHeight,
          speed: 4 + Math.floor(localScore / 100),
        });
      }

      // Update & Draw Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= obs.speed;

        const obsY = groundY + playerSize - obs.height;

        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ec4899';
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(obs.x, obsY, obs.width, obs.height);

        // Collision Check
        if (
          playerX < obs.x + obs.width &&
          playerX + playerSize > obs.x &&
          playerY < obsY + obs.height &&
          playerY + playerSize > obsY
        ) {
          // Game Over hit
          if (isMountedRef.current) {
            setGameState('gameover');
          }
          // Reset score after brief pause
          if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
          restartTimerRef.current = setTimeout(() => {
            if (!isMountedRef.current) return;
            obstacles.length = 0;
            localScore = 0;
            setScore(0);
            setGameState('playing');
          }, 1200);
          return;
        }

        if (obs.x + obs.width < 0) {
          obstacles.splice(i, 1);
          localScore += 10;
          if (isMountedRef.current) {
            setScore(localScore);
            setHighScore((prev) => Math.max(prev, localScore));
          }
        }
      }

      // Draw particle trail when running
      if (!isJumping && frameCount % 4 === 0) {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.fillRect(playerX - 6, groundY + 14, 4, 4);
      }

      if (gameStateRef.current === 'playing') {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState]);

  return (
    <div className="fixed inset-0 z-[10000] bg-[#070a12]/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md glass-card rounded-2xl p-6 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col items-center">
        {/* Header bar */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-sm font-heading font-semibold text-slate-200 uppercase tracking-wider">
              {title}
            </span>
          </div>
          <button
            onClick={onComplete}
            className="flex items-center space-x-1 px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-full text-xs font-mono border border-cyan-400/40 transition-colors"
          >
            <span>Skip</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Canvas Game Container */}
        <div className="relative w-full h-[180px] bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={380}
            height={170}
            onClick={() => {
              if (canvasRef.current) {
                const event = new KeyboardEvent('keydown', { code: 'Space' });
                window.dispatchEvent(event);
              }
            }}
            className="cursor-pointer"
          />

          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-pink-400">
              <span className="font-heading font-bold text-lg mb-1">SYSTEM GLITCH!</span>
              <span className="text-xs text-slate-300">Restarting simulation...</span>
            </div>
          )}

          <div className="absolute top-2 right-3 flex items-center space-x-3 text-xs font-mono">
            <span className="text-cyan-400">SCORE: {score}</span>
            <span className="text-purple-400">HIGH: {highScore}</span>
          </div>

          <div className="absolute bottom-2 left-3 text-[10px] text-slate-500 font-mono">
            [PRESS SPACE / TAP CANVAS TO JUMP]
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="w-full mt-5">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1 font-mono">
            <span>LOADING PORTFOLIO MODULES</span>
            <span className="text-cyan-400">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
