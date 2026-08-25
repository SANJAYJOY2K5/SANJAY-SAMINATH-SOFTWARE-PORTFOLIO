import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Gamepad2, Trophy, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2, Sparkles, Zap, Shield, Flame } from 'lucide-react';

export const CyberArcade: React.FC<{ onOpenGameHub?: () => void }> = ({ onOpenGameHub }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sanjay_ironman_runner_highscore') || localStorage.getItem('sanjay_cyber_high_score') || '0';
      return parseInt(saved, 10);
    } catch {
      return 0;
    }
  });
  const [combo, setCombo] = useState(1);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [difficulty, setDifficulty] = useState<'Normal' | 'Hyper' | 'Matrix'>('Normal');

  // Refs for loop state
  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;
  const isGameOverRef = useRef(false);
  isGameOverRef.current = isGameOver;
  const difficultyRef = useRef(difficulty);
  difficultyRef.current = difficulty;
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Jump Trigger & Reset Functions
  const jumpRef = useRef<() => void>(() => {});
  const resetGameRef = useRef<() => void>(() => {});

  // Web Audio Synth for retro sound effects - Shared AudioContext for 60FPS performance
  const playSound = useCallback((type: 'jump' | 'coin' | 'hit' | 'start') => {
    if (!soundEnabledRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'jump') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'coin') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'start') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(261.63, now);
        osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {
      // AudioContext might be restricted until user gesture
    }
  }, []);

  const handleStartGame = () => {
    if (resetGameRef.current) {
      resetGameRef.current();
    }
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setCombo(1);
    setCoinsCollected(0);
    playSound('start');
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;
    let localScore = 0;
    let localCoins = 0;

    // Player physics
    const groundY = 230;
    let playerY = groundY;
    let playerVelY = 0;
    let jumpsRemaining = 2; // Double jump enabled!
    const gravity = 0.62;

    // Game Objects
    interface Obstacle {
      x: number;
      width: number;
      height: number;
      speed: number;
      type: 'laser' | 'drone' | 'barrier';
    }

    interface Coin {
      x: number;
      y: number;
      collected: boolean;
      radius: number;
    }

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      life: number;
      maxLife: number;
      size: number;
    }

    let obstacles: Obstacle[] = [];
    let coins: Coin[] = [];
    let particles: Particle[] = [];
    let spawnTimer = 0;
    let coinTimer = 0;

    const resetGame = () => {
      frame = 0;
      localScore = 0;
      localCoins = 0;
      playerY = groundY;
      playerVelY = 0;
      jumpsRemaining = 2;
      obstacles = [];
      coins = [];
      particles = [];
      spawnTimer = 0;
      coinTimer = 0;
    };
    resetGameRef.current = resetGame;

    const spawnParticles = (x: number, y: number, color: string, count = 12) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          color,
          life: 0,
          maxLife: 25 + Math.random() * 15,
          size: Math.random() * 3.5 + 1.5,
        });
      }
    };

    jumpRef.current = () => {
      if (!isPlayingRef.current || isGameOverRef.current) return;
      if (jumpsRemaining > 0) {
        playerVelY = jumpsRemaining === 2 ? -12 : -10;
        jumpsRemaining--;
        playSound('jump');
        spawnParticles(70, playerY + 20, '#06b6d4', 8);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        if (!isPlayingRef.current || isGameOverRef.current) {
          handleStartGame();
        } else {
          jumpRef.current();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Render loop
    const loop = () => {
      animId = requestAnimationFrame(loop);
      frame++;

      // Resize canvas display width/height dynamically
      const w = canvas.width;
      const h = canvas.height;

      // Clear Screen with Dark Cyber Gradient
      ctx.fillStyle = '#070a12';
      ctx.fillRect(0, 0, w, h);

      // Cyber Grid floor lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 24);
      ctx.lineTo(w, groundY + 24);
      ctx.stroke();

      // Moving floor neon grid segments
      const speedModifier = difficultyRef.current === 'Hyper' ? 1.4 : difficultyRef.current === 'Matrix' ? 1.8 : 1.0;
      const gridOffset = (frame * (4 * speedModifier)) % 40;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
      for (let x = -gridOffset; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, groundY + 24);
        ctx.lineTo(x - 20, h);
        ctx.stroke();
      }

      // Background Cyber City Silhouettes
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      for (let bx = 0; bx < w; bx += 80) {
        const bHeight = 40 + ((bx * 37) % 60);
        ctx.fillRect(bx, groundY + 24 - bHeight, 55, bHeight);
        // Window dots
        ctx.fillStyle = ((bx / 80 + frame) % 5 === 0) ? 'rgba(6, 182, 212, 0.4)' : 'rgba(236, 72, 153, 0.3)';
        ctx.fillRect(bx + 10, groundY + 24 - bHeight + 15, 4, 4);
        ctx.fillRect(bx + 30, groundY + 24 - bHeight + 25, 4, 4);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      }

      // If Not Playing (Idle Screen)
      if (!isPlayingRef.current && !isGameOverRef.current) {
        // Draw idle player bot
        const idleHover = Math.sin(frame * 0.08) * 4;
        drawRunnerBot(ctx, 70, groundY + idleHover, false, frame);
        return;
      }

      // If Game Over
      if (isGameOverRef.current) {
        // Render explosion particles
        renderParticles(ctx, particles);
        return;
      }

      // --- GAMEPLAY UPDATE ---
      // Player Physics
      playerVelY += gravity;
      playerY += playerVelY;

      if (playerY >= groundY) {
        playerY = groundY;
        playerVelY = 0;
        jumpsRemaining = 2;
      }

      // Update Score
      if (frame % 4 === 0) {
        localScore += Math.floor(1 * speedModifier);
        setScore(localScore);
      }

      // Spawn Obstacles
      spawnTimer++;
      const baseSpeed = difficultyRef.current === 'Hyper' ? 6.5 : difficultyRef.current === 'Matrix' ? 8.5 : 4.8;
      const currentSpeed = baseSpeed + Math.min(localScore * 0.003, 5);
      const spawnInterval = Math.max(65 - Math.floor(localScore * 0.015), 38);

      if (spawnTimer > spawnInterval) {
        spawnTimer = 0;
        const types: ('laser' | 'drone' | 'barrier')[] = ['laser', 'drone', 'barrier'];
        const chosenType = types[Math.floor(Math.random() * types.length)];
        let obsHeight = 28;
        let obsWidth = 18;
        if (chosenType === 'drone') {
          obsHeight = 22;
          obsWidth = 24;
        } else if (chosenType === 'barrier') {
          obsHeight = 36;
          obsWidth = 16;
        }

        obstacles.push({
          x: w + 20,
          width: obsWidth,
          height: obsHeight,
          speed: currentSpeed,
          type: chosenType,
        });
      }

      // Spawn Coins / Energy Orbs
      coinTimer++;
      if (coinTimer > 90) {
        coinTimer = 0;
        const coinY = Math.random() > 0.5 ? groundY - 45 : groundY - 15;
        coins.push({
          x: w + 30,
          y: coinY,
          collected: false,
          radius: 7,
        });
      }

      // Draw & Move Obstacles
      ctx.shadowBlur = 12;
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= obs.speed;

        // Draw Obstacle
        const obsY = groundY + 24 - obs.height;
        if (obs.type === 'laser') {
          ctx.fillStyle = '#ec4899';
          ctx.shadowColor = '#ec4899';
          ctx.fillRect(obs.x, obsY, obs.width, obs.height);
          // Core pulse
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(obs.x + 4, obsY + 4, obs.width - 8, obs.height - 8);
        } else if (obs.type === 'drone') {
          const droneFloat = Math.sin(frame * 0.15 + i) * 8;
          ctx.fillStyle = '#a855f7';
          ctx.shadowColor = '#a855f7';
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obsY - 15 + droneFloat, obs.width / 2, 0, Math.PI * 2);
          ctx.fill();
          // Drone eye
          ctx.fillStyle = '#22d3ee';
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obsY - 15 + droneFloat, 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Barrier
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.fillRect(obs.x, obsY, obs.width, obs.height);
          ctx.strokeStyle = '#fca5a5';
          ctx.strokeRect(obs.x, obsY, obs.width, obs.height);
        }

        // Collision Check (AABB box)
        const playerBox = { x: 70 - 12, y: playerY - 12, w: 24, h: 28 };
        const obstacleBox = {
          x: obs.x,
          y: obs.type === 'drone' ? obsY - 25 : obsY,
          w: obs.width,
          h: obs.height,
        };

        if (
          playerBox.x < obstacleBox.x + obstacleBox.w &&
          playerBox.x + playerBox.w > obstacleBox.x &&
          playerBox.y < obstacleBox.y + obstacleBox.h &&
          playerBox.y + playerBox.h > obstacleBox.y
        ) {
          // HIT!
          setIsGameOver(true);
          playSound('hit');
          spawnParticles(70, playerY, '#ec4899', 24);
          spawnParticles(70, playerY, '#06b6d4', 20);

          setHighScore((prev) => {
            const newHigh = Math.max(prev, localScore);
            try {
              localStorage.setItem('sanjay_ironman_runner_highscore', newHigh.toString());
              localStorage.setItem('sanjay_cyber_high_score', newHigh.toString());
            } catch {
              // ignore
            }
            return newHigh;
          });
        }

        // Remove out-of-screen obstacles
        if (obs.x < -40) {
          obstacles.splice(i, 1);
        }
      }

      // Draw & Move Coins
      for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        coin.x -= currentSpeed;

        if (!coin.collected) {
          // Draw Glowing Cyber Orb
          const pulse = Math.sin(frame * 0.2 + i) * 2;
          ctx.fillStyle = '#00f0ff';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(coin.x, coin.y + pulse, coin.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(coin.x, coin.y + pulse, coin.radius * 0.4, 0, Math.PI * 2);
          ctx.fill();

          // Collect Collision
          const dist = Math.hypot(70 - coin.x, playerY - coin.y);
          if (dist < 26) {
            coin.collected = true;
            localCoins += 1;
            localScore += 50;
            setCoinsCollected(localCoins);
            setScore(localScore);
            setCombo((c) => Math.min(c + 1, 8));
            playSound('coin');
            spawnParticles(coin.x, coin.y, '#00f0ff', 10);
            coins.splice(i, 1);
            continue;
          }
        }

        if (coin.x < -20) {
          coins.splice(i, 1);
        }
      }

      ctx.shadowBlur = 0;

      // Draw Mini Iron Man Player Bot & Particle FX
      drawRunnerBot(ctx, 70, playerY, jumpsRemaining < 2, frame);
      renderParticles(ctx, particles);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playSound]);

  // Helper: Draw Mini Iron Man Runner
  const drawRunnerBot = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    airborne: boolean,
    frame: number
  ) => {
    ctx.save();

    // 1. Dual Repulsor Boot Thrusters & Plasma Flames
    const flameHeight = airborne ? 18 + Math.sin(frame * 0.8) * 5 : 8 + Math.sin(frame * 0.5) * 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f0ff';

    const gradFlame = ctx.createLinearGradient(x - 6, y + 14, x - 14 - flameHeight, y + 17);
    gradFlame.addColorStop(0, '#ffffff');
    gradFlame.addColorStop(0.3, '#00f0ff');
    gradFlame.addColorStop(0.7, '#f59e0b');
    gradFlame.addColorStop(1, '#ef4444');

    ctx.fillStyle = gradFlame;
    ctx.beginPath();
    ctx.moveTo(x - 6, y + 14);
    ctx.lineTo(x - 14 - flameHeight, y + 17);
    ctx.lineTo(x - 6, y + 20);
    ctx.closePath();
    ctx.fill();

    // 2. Iron Man Legs (Gold & Crimson Armor)
    const legOffset = airborne ? 2 : Math.sin(frame * 0.35) * 4;
    // Back leg
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(x - 8, y + 10, 6, 8 + legOffset);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(x - 8, y + 13, 6, 3);

    // Front leg
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x - 1, y + 10, 6, 8 - legOffset);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x - 1, y + 13, 6, 3);

    // 3. Iron Man Torso / Chestplate (Hot Rod Red & Gold Titanium)
    ctx.fillStyle = '#b91c1c';
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - 11, y - 2, 22, 16, 4);
    ctx.fill();
    ctx.stroke();

    // Gold Abdominal & Collar Plates
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - 7, y - 2, 14, 3);
    ctx.fillRect(x - 6, y + 8, 12, 4);

    // 4. Glowing RT / Arc Reactor (Center Chest)
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#00f0ff';
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(x, y + 3, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y + 3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 5. Armored Shoulder Pads & Arms (Forward hero stance)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(x - 10, y + 1, 4, 0, Math.PI * 2);
    ctx.arc(x + 10, y + 1, 4, 0, Math.PI * 2);
    ctx.fill();

    // Right Hand & Palm Repulsor
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x + 7, y + 2, 7, 5);
    ctx.fillStyle = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00f0ff';
    ctx.fillRect(x + 13, y + 3, 2, 3);
    ctx.shadowBlur = 0;

    // 6. Mini Iron Man Helmet (Crimson Dome + Gold Faceplate)
    ctx.fillStyle = '#b91c1c';
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - 10, y - 17, 20, 16, 5);
    ctx.fill();
    ctx.stroke();

    // Gold Faceplate
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 14);
    ctx.lineTo(x + 6, y - 14);
    ctx.lineTo(x + 7, y - 5);
    ctx.lineTo(x + 4, y - 2);
    ctx.lineTo(x - 4, y - 2);
    ctx.lineTo(x - 7, y - 5);
    ctx.closePath();
    ctx.fill();

    // Glowing Cyan Visor Eyes
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f0ff';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 5, y - 9, 3.5, 2);
    ctx.fillRect(x + 1.5, y - 9, 3.5, 2);

    ctx.restore();
  };

  // Helper: Update & Draw Particles
  const renderParticles = (ctx: CanvasRenderingContext2D, list: any[]) => {
    ctx.save();
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      const alpha = 1 - p.life / p.maxLife;

      if (p.life >= p.maxLife) {
        list.splice(i, 1);
        continue;
      }

      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(alpha, 0);
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  return (
    <section id="arcade" className="py-24 relative bg-[#05070d] border-t border-slate-900 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-widest">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Interactive Cyber Arcade</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white">
            IRONMAN <span className="bg-gradient-to-r from-amber-400 via-red-500 to-amber-300 bg-clip-text text-transparent">RUNNER</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Take a break from exploring case studies! Jump over laser barriers, collect cyber orbs, and beat the high score.
          </p>

          {onOpenGameHub && (
            <div className="pt-2">
              <button
                onClick={onOpenGameHub}
                className="px-6 py-2.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-heading font-semibold text-xs rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-105 transition-all inline-flex items-center space-x-2 border border-amber-400/40"
              >
                <Gamepad2 className="w-4 h-4 text-amber-300" />
                <span>Open Dedicated Game Hub (3 Games Station) →</span>
              </button>
            </div>
          )}
        </div>

        {/* Arcade Console Container */}
        <div
          ref={containerRef}
          className={`glass-card rounded-3xl border border-slate-800 p-4 sm:p-8 max-w-4xl mx-auto shadow-2xl relative ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-[#05070d] flex flex-col justify-center' : ''
          }`}
        >
          {/* Top Arcade HUD Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800/80 text-xs font-mono">
            {/* Score & Multiplier */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-slate-400">SCORE:</span>
                <span className="font-heading font-bold text-lg text-amber-300">{score.toString().padStart(5, '0')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-slate-400">HIGH:</span>
                <span className="font-heading font-bold text-lg text-amber-400">{highScore.toString().padStart(5, '0')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400">ORBS:</span>
                <span className="font-bold text-cyan-300">{coinsCollected}</span>
              </div>
              <div className="hidden md:flex items-center space-x-1 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-mono">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>COMBO x{combo}</span>
              </div>
            </div>

            {/* Controls / Options */}
            <div className="flex items-center space-x-2">
              {/* Difficulty selector */}
              <div className="flex rounded-lg bg-slate-900/90 p-1 border border-slate-800">
                {(['Normal', 'Hyper', 'Matrix'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setDifficulty(diff);
                      if (isPlaying) handleStartGame();
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                      difficulty === diff ? 'bg-red-500/20 text-red-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={handleToggleFullscreen}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                title="Toggle Fullscreen Arcade"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4 text-amber-400" />}
              </button>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div
            onClick={() => {
              if (!isPlaying || isGameOver) {
                handleStartGame();
              } else {
                jumpRef.current();
              }
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              if (!isPlaying || isGameOver) {
                handleStartGame();
              } else {
                jumpRef.current();
              }
            }}
            className="relative w-full h-[260px] sm:h-[320px] rounded-2xl overflow-hidden bg-[#070a12] border border-slate-800/90 cursor-pointer select-none touch-none group"
          >
            <canvas
              ref={canvasRef}
              width={800}
              height={320}
              className="w-full h-full object-cover"
            />

            {/* Start Screen Overlay */}
            {!isPlaying && !isGameOver && (
              <div className="absolute inset-0 bg-[#070a12]/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn space-y-4">
                <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse">
                  <Gamepad2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-1">
                    IRONMAN RUNNER
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md font-light">
                    Press <strong className="text-amber-400 font-mono">SPACE / TAP SCREEN</strong> to Jump • Double-Tap for Double-Jump!
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartGame();
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-heading font-bold text-sm rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:scale-105 transition-all flex items-center space-x-2"
                >
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>START ARCADE RUN</span>
                </button>
              </div>
            )}

            {/* Game Over Screen Overlay */}
            {isGameOver && (
              <div className="absolute inset-0 bg-[#070a12]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn space-y-4">
                <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl border border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                  <Flame className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">ARMOR OVERHEAT</span>
                  <h3 className="text-3xl font-heading font-extrabold text-white">GAME OVER</h3>
                </div>
                <div className="flex items-center space-x-6 text-xs font-mono bg-slate-900/80 px-6 py-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px]">FINAL SCORE</span>
                    <span className="font-bold text-lg text-amber-300">{score}</span>
                  </div>
                  <div className="h-6 w-[1px] bg-slate-800" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">RECORD</span>
                    <span className="font-bold text-lg text-amber-400">{highScore}</span>
                  </div>
                  <div className="h-6 w-[1px] bg-slate-800" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">ORBS</span>
                    <span className="font-bold text-lg text-cyan-300">{coinsCollected}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartGame();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-amber-600 text-white font-heading font-semibold text-xs rounded-xl shadow-lg hover:scale-105 transition-all flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>PLAY AGAIN</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile On-Screen Action Jump Button */}
          <div className="flex sm:hidden items-center justify-center pt-2">
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                if (!isPlaying || isGameOver) handleStartGame();
                else jumpRef.current();
              }}
              onClick={() => {
                if (!isPlaying || isGameOver) handleStartGame();
                else jumpRef.current();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-heading font-extrabold text-sm shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-95 transition-all flex items-center justify-center space-x-2 border border-amber-400/40"
            >
              <Flame className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>{(!isPlaying || isGameOver) ? '🚀 START / RESTART RUN' : '⚡ JUMP / DOUBLE-TAP 2X'}</span>
            </button>
          </div>

          {/* Bottom Game Guide Strip */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-900">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <span className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-200">Space / Tap</span>
                <span>to Jump</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-amber-300">2x Jump</span>
                <span>Double-Jump</span>
              </span>
            </div>

            <div className="flex items-center space-x-4 text-slate-500">
              <span className="flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-red-400" />
                <span>HTML5 Canvas 60FPS</span>
              </span>
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Web Audio Synthesizer</span>
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
