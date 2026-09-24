import React, { useRef, useEffect, useState } from 'react';
import { RotateCw, Move, Layers, Sparkles, Sliders } from 'lucide-react';

interface Quant3DSceneProps {
  surfaceType?: 'heston' | 'black-scholes' | 'vasicek' | 'sabr';
  height?: number;
  interactive?: boolean;
}

export const Quant3DScene: React.FC<Quant3DSceneProps> = ({
  surfaceType = 'heston',
  height = 420,
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [modelType, setModelType] = useState<'heston' | 'black-scholes' | 'vasicek' | 'sabr'>(surfaceType);
  const [rotX, setRotX] = useState<number>(0.6);
  const [rotY, setRotY] = useState<number>(0.75);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [skewFactor, setSkewFactor] = useState<number>(1.2);
  const [volatility, setVolatility] = useState<number>(0.25);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 3D Surface function generator
  const getZValue = (x: number, y: number, time: number, type: string, skew: number, vol: number) => {
    // x: Strike/Spot (-1 to 1), y: Time to Expiry/Maturity (-1 to 1)
    const normX = x; 
    const normY = y + 1.2;

    switch (type) {
      case 'heston': {
        // Stochastic vol smile/skew surface with time decay
        const smile = Math.pow(normX - 0.1 * skew, 2) * 0.8;
        const termDecay = Math.sqrt(normY * 0.5 + 0.2);
        const wave = Math.sin(normX * 3 + time * 0.002) * 0.08 * vol;
        return (smile / termDecay + wave) * 0.8 - 0.3;
      }
      case 'black-scholes': {
        // Option call price surface
        const d1 = (normX + 0.5 * vol * vol * normY) / (vol * Math.sqrt(normY + 0.1));
        const cVal = Math.max(0, normX * 0.5 + Math.sin(d1) * 0.3);
        return cVal * 0.7 - 0.4;
      }
      case 'vasicek': {
        // Mean-reverting interest rate yield curve surface
        const r0 = 0.04 + vol * 0.1;
        const a = 1.5 * skew;
        const b = 0.05;
        const rate = b + (r0 - b) * Math.exp(-a * normY) + Math.sin(normX * 2 + time * 0.001) * 0.04;
        return rate * 4 - 0.2;
      }
      case 'sabr': {
        // SABR implied vol smile
        const alpha = vol;
        const beta = 0.7;
        const rho = -0.4 * skew;
        const logF = Math.abs(normX) + 0.05;
        const smile = alpha * (1 + (1 - beta) * (1 - beta) / 24 * Math.pow(logF, 2)) + rho * normX * 0.3;
        return smile * 1.5 - 0.3;
      }
      default:
        return 0;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Canvas size adjustment
    const updateSize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = height;
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Render 3D mesh frame
    const render = () => {
      time += 16;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const h = canvas.height;
      const centerX = width / 2;
      const centerY = h / 2 + 20;

      // 3D Perspective settings
      const focalLength = 450;
      const currentRotY = autoRotate ? rotY + time * 0.0004 : rotY;

      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Create 3D Surface Mesh Grid (24 x 24 resolution)
      const gridSizeX = 26;
      const gridSizeY = 26;
      const stepX = 2.4 / (gridSizeX - 1);
      const stepY = 2.4 / (gridSizeY - 1);

      interface Point3D {
        x: number;
        y: number;
        z: number;
        px: number;
        py: number;
        depth: number;
        rawZ: number;
      }

      const points: Point3D[][] = [];

      for (let i = 0; i < gridSizeX; i++) {
        points[i] = [];
        const x3d = -1.2 + i * stepX;
        for (let j = 0; j < gridSizeY; j++) {
          const y3d = -1.2 + j * stepY;
          const z3d = getZValue(x3d, y3d, time, modelType, skewFactor, volatility);

          // 3D Rotation transformations
          // Rotate around Y-axis
          const rx1 = x3d * cosY - y3d * sinY;
          const ry1 = x3d * sinY + y3d * cosY;
          const rz1 = z3d;

          // Rotate around X-axis
          const rx2 = rx1;
          const ry2 = ry1 * cosX - rz1 * sinX;
          const rz2 = ry1 * sinX + rz1 * cosX;

          // Scale & translate 3D
          const scale = 140;
          const worldX = rx2 * scale;
          const worldY = -rz2 * scale; // Invert Y for canvas
          const worldZ = ry2 * scale + 350;

          // Perspective Projection
          const px = centerX + (worldX * focalLength) / worldZ;
          const py = centerY + (worldY * focalLength) / worldZ;

          points[i][j] = {
            x: worldX,
            y: worldY,
            z: worldZ,
            px,
            py,
            depth: worldZ,
            rawZ: z3d
          };
        }
      }

      // Draw Floor Grid & Dynamic Particles
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let i = -3; i <= 3; i += 1.5) {
        const fY = 120;
        const fZ1 = 150;
        const fZ2 = 600;
        const p1x = centerX + ((i * 120) * focalLength) / fZ1;
        const p1y = centerY + ((fY) * focalLength) / fZ1;
        const p2x = centerX + ((i * 120) * focalLength) / fZ2;
        const p2y = centerY + ((fY) * focalLength) / fZ2;

        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.stroke();
      }

      // Draw 3D Polygons with Painter's Algorithm (Sort quads by average depth)
      interface Quad {
        p1: Point3D;
        p2: Point3D;
        p3: Point3D;
        p4: Point3D;
        avgDepth: number;
        avgZ: number;
      }

      const quads: Quad[] = [];

      for (let i = 0; i < gridSizeX - 1; i++) {
        for (let j = 0; j < gridSizeY - 1; j++) {
          const p1 = points[i][j];
          const p2 = points[i + 1][j];
          const p3 = points[i + 1][j + 1];
          const p4 = points[i][j + 1];

          const avgDepth = (p1.depth + p2.depth + p3.depth + p4.depth) / 4;
          const avgZ = (p1.rawZ + p2.rawZ + p3.rawZ + p4.rawZ) / 4;

          quads.push({ p1, p2, p3, p4, avgDepth, avgZ });
        }
      }

      // Sort back-to-front
      quads.sort((a, b) => b.avgDepth - a.avgDepth);

      // Render 3D Quads with Volumetric Gradient Fill
      quads.forEach((quad) => {
        const { p1, p2, p3, p4, avgZ } = quad;

        // Dynamic Color Heatmap based on height (avgZ)
        // low: cyan/blue, mid: violet, high: magenta/amber
        const normalizedZ = Math.min(1, Math.max(0, (avgZ + 0.4) / 0.8));
        
        let fillColor = '';
        let strokeColor = '';

        if (normalizedZ < 0.35) {
          fillColor = `rgba(0, 240, 255, ${0.15 + normalizedZ * 0.25})`;
          strokeColor = `rgba(0, 240, 255, ${0.4 + normalizedZ * 0.4})`;
        } else if (normalizedZ < 0.7) {
          const ratio = (normalizedZ - 0.35) / 0.35;
          fillColor = `rgba(139, 92, 246, ${0.2 + ratio * 0.3})`;
          strokeColor = `rgba(168, 85, 247, ${0.5 + ratio * 0.4})`;
        } else {
          const ratio = (normalizedZ - 0.7) / 0.3;
          fillColor = `rgba(244, 63, 94, ${0.25 + ratio * 0.35})`;
          strokeColor = `rgba(244, 63, 94, ${0.6 + ratio * 0.4})`;
        }

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.lineTo(p3.px, p3.py);
        ctx.lineTo(p4.px, p4.py);
        ctx.closePath();

        ctx.fillStyle = fillColor;
        ctx.fill();

        ctx.lineWidth = 0.8;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
      });

      // Render Floating 3D Data Nodes (Glow Dots on Top Peaks)
      for (let i = 0; i < gridSizeX; i += 5) {
        for (let j = 0; j < gridSizeY; j += 5) {
          const pt = points[i][j];
          if (pt.rawZ > 0.1) {
            ctx.beginPath();
            ctx.arc(pt.px, pt.py, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#00f0ff';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotX, rotY, autoRotate, modelType, skewFactor, volatility, height]);

  // Mouse Orbit Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setAutoRotate(false);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;

    setRotY((prev) => prev + deltaX * 0.008);
    setRotX((prev) => Math.max(0.1, Math.min(1.4, prev + deltaY * 0.008)));

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800/90 shadow-2xl">
      {/* 3D Controls Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            3D Volatility &amp; Risk Manifold Visualizer
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            REAL-TIME WEBGL MESH
          </span>
        </div>

        {/* Model Type Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setModelType('heston')}
            className={`px-2.5 py-1 rounded font-mono font-medium transition ${
              modelType === 'heston' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Heston 3D Surface
          </button>
          <button
            onClick={() => setModelType('sabr')}
            className={`px-2.5 py-1 rounded font-mono font-medium transition ${
              modelType === 'sabr' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SABR Smile 3D
          </button>
          <button
            onClick={() => setModelType('vasicek')}
            className={`px-2.5 py-1 rounded font-mono font-medium transition ${
              modelType === 'vasicek' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vasicek 3D Yield
          </button>
          <button
            onClick={() => setModelType('black-scholes')}
            className={`px-2.5 py-1 rounded font-mono font-medium transition ${
              modelType === 'black-scholes' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            BSM Call Surface
          </button>
        </div>

        {/* Orbit Auto-Rotate Toggle */}
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition border ${
            autoRotate
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span>{autoRotate ? '3D Orbiting' : 'Orbit Paused'}</span>
        </button>
      </div>

      {/* 3D Canvas */}
      <div
        className={`w-full relative cursor-grab active:cursor-grabbing ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas ref={canvasRef} className="w-full block" />

        {/* Drag Hint Overlay */}
        <div className="absolute bottom-4 left-4 pointer-events-none flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
          <Move className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click &amp; drag mouse to orbit 3D camera angles</span>
        </div>

        {/* Real-time Parameters Slider Floating Widget */}
        <div className="absolute bottom-4 right-4 z-20 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 space-y-2 text-xs font-mono w-56 hidden sm:block">
          <div className="flex items-center justify-between text-slate-300 font-bold text-[10px] uppercase border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1">
              <Sliders className="w-3 h-3 text-cyan-400" />
              Live Surface Controls
            </span>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 text-[10px]">
              <span>Volatility (σ):</span>
              <span className="text-cyan-400 font-bold">{(volatility * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.60"
              step="0.02"
              value={volatility}
              onChange={(e) => setVolatility(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-400 text-[10px]">
              <span>Skew / Reversion:</span>
              <span className="text-cyan-400 font-bold">{skewFactor.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={skewFactor}
              onChange={(e) => setSkewFactor(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
