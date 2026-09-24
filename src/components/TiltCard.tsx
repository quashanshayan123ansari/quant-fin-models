import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: 'cyan' | 'rose' | 'amber' | 'emerald' | 'violet' | 'green' | 'blue';
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  onClick,
  glowColor = 'cyan'
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [lightPos, setLightPos] = useState<{ x: number; y: number; opacity: number }>({ x: 0, y: 0, opacity: 0 });

  const getGlowBorderClass = () => {
    switch (glowColor) {
      case 'cyan':
        return 'hover:border-cyan-500/60 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]';
      case 'rose':
        return 'hover:border-rose-500/60 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]';
      case 'amber':
        return 'hover:border-amber-500/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]';
      case 'emerald':
      case 'green':
        return 'hover:border-emerald-500/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]';
      case 'violet':
        return 'hover:border-violet-500/60 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]';
      case 'blue':
        return 'hover:border-blue-500/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]';
      default:
        return 'hover:border-cyan-500/60';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate tilt angle (-9 deg to +9 deg)
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`);
    setLightPos({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setLightPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        transition: transform.includes('rotateX(0deg)') ? 'transform 0.5s ease-out' : 'transform 0.1s ease-out'
      }}
      className={`relative overflow-hidden bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${getGlowBorderClass()} ${className}`}
    >
      {/* Dynamic Specular Light Spot Sheen */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: lightPos.opacity,
          background: `radial-gradient(400px circle at ${lightPos.x}px ${lightPos.y}px, rgba(255, 255, 255, 0.08), transparent 80%)`
        }}
      />

      {/* Internal Content with 3D Depth Layer */}
      <div style={{ transform: 'translateZ(20px)' }} className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};
