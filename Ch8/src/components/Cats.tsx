import React from 'react';

/**
 * TEMPORARY ORIGINAL ARTWORK for characters not on the supplied model sheet
 * (Midnight, Felix, Whiskers). Swap these for final art any time — scenes only
 * depend on the props below.
 */
export type CatLook = {fur: string; shade: string; inner: string; eye: string; stripes?: string; belly?: string};

export const LOOKS: Record<'midnight' | 'felix' | 'whiskers', CatLook> = {
  midnight: {fur: '#10131c', shade: '#06080e', inner: '#3a2a35', eye: '#d6ff7a'},
  felix: {fur: '#7d838f', shade: '#4d525d', inner: '#b98b8b', eye: '#ffc247', stripes: '#3f4450', belly: '#aab0ba'},
  whiskers: {fur: '#b5946a', shade: '#7d6444', inner: '#c79a8a', eye: '#9ad46a', stripes: '#6b5233', belly: '#d9c4a0'},
};

export const CatHead: React.FC<{look: CatLook; size?: number; look_x?: number; look_y?: number; blink?: number; glow?: number; worried?: boolean; style?: React.CSSProperties}> = ({
  look, size = 200, look_x = 0, look_y = 0, blink = 0, glow = 0, worried = false, style,
}) => {
  const eyeH = 15 * (1 - blink * 0.92);
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={style}>
      <defs>
        <radialGradient id={`hg-${look.fur}`} cx="50%" cy="40%" r="65%"><stop offset="0" stopColor={look.fur} /><stop offset="1" stopColor={look.shade} /></radialGradient>
      </defs>
      <polygon points="30,92 38,18 88,56" fill={look.fur} /><polygon points="170,92 162,18 112,56" fill={look.fur} />
      <polygon points="42,80 45,38 74,60" fill={look.inner} /><polygon points="158,80 155,38 126,60" fill={look.inner} />
      <ellipse cx={100} cy={112} rx={74} ry={66} fill={`url(#hg-${look.fur})`} />
      {look.stripes && <g stroke={look.stripes} strokeWidth={5} strokeLinecap="round" opacity={0.7}>
        <path d="M100 52 L100 72" /><path d="M84 54 L87 70" /><path d="M116 54 L113 70" />
        <path d="M30 108 L50 110" /><path d="M32 124 L52 122" /><path d="M170 108 L150 110" /><path d="M168 124 L148 122" /></g>}
      {[-1, 1].map((s) => {
        const cx = 100 + s * 30;
        return (
          <g key={s}>
            <ellipse cx={cx} cy={104} rx={20} ry={eyeH + 2} fill="#05060a" />
            {glow > 0 && <ellipse cx={cx} cy={104} rx={26} ry={eyeH + 9} fill={look.eye} opacity={0.35 * glow} style={{filter: 'blur(6px)'}} />}
            <ellipse cx={cx} cy={104} rx={17} ry={eyeH} fill={look.eye} />
            <ellipse cx={cx + look_x} cy={104 + look_y} rx={4.2} ry={eyeH * 0.95} fill="#050505" />
            <circle cx={cx + look_x - 5} cy={98 + look_y} r={3.4} fill="#fff" opacity={0.9} />
            {worried && <path d={`M ${cx - s * 20} ${82 + (s > 0 ? 0 : 0)} L ${cx + s * 18} ${90}`} stroke={look.shade} strokeWidth={4} strokeLinecap="round" />}
          </g>
        );
      })}
      <polygon points="92,126 108,126 100,136" fill={look.inner} />
      <path d="M100 136 Q 90 148 80 142 M100 136 Q 110 148 120 142" stroke="#05060a" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <g stroke="#dfe6f2" strokeWidth={1.4} opacity={0.6}>
        <path d="M70 132 L18 122 M70 138 L16 142 M130 132 L182 122 M130 138 L184 142" />
      </g>
    </svg>
  );
};

/** Silver bell collar helper (200-unit coords relative to a head of same size). */
export const SilverBell: React.FC<{swing?: number; glint?: number; size?: number}> = ({swing = 0, glint = 0.5, size = 80}) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 80 104" style={{overflow: 'visible', transform: `rotate(${swing}deg)`, transformOrigin: '40px 6px'}}>
    <defs>
      <radialGradient id="bellg" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#fff" /><stop offset="0.35" stopColor="#c9d2e2" /><stop offset="1" stopColor="#5e6a82" /></radialGradient>
    </defs>
    <path d="M 0 14 Q 40 -4 80 14" stroke="#aab3c6" strokeWidth={7} fill="none" strokeLinecap="round" />
    <circle cx={40} cy={58} r={32} fill="url(#bellg)" stroke="#47516a" strokeWidth={2} />
    <path d="M 12 62 Q 40 76 68 62" stroke="#3a445a" strokeWidth={3} fill="none" />
    <ellipse cx={40} cy={74} rx={6} ry={4} fill="#2a3144" />
    <circle cx={28} cy={44} r={7} fill="#fff" opacity={0.5 + glint * 0.5} style={{filter: 'blur(1.5px)'}} />
  </svg>
);

/** Midnight sitting, 3/4 view. 400x560 box. */
export const MidnightSitting: React.FC<{bellSwing?: number; glow?: number; tailSway?: number; blink?: number; style?: React.CSSProperties}> = ({bellSwing = 0, glow = 1, tailSway = 0, blink = 0, style}) => (
  <div style={{position: 'relative', width: 400, height: 560, ...style}}>
    <svg width={400} height={560} viewBox="0 0 400 560" style={{position: 'absolute', inset: 0}}>
      <defs><linearGradient id="mbody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1b2030" /><stop offset="1" stopColor="#05070c" /></linearGradient></defs>
      <path d={`M 290 520 Q ${380 + tailSway} 500 ${360 + tailSway * 1.5} 400 Q ${350 + tailSway} 340 ${392 + tailSway} 330`} stroke="#0a0d15" strokeWidth={34} fill="none" strokeLinecap="round" />
      <path d="M 110 540 Q 70 380 130 280 Q 200 220 270 280 Q 330 380 290 540 Z" fill="url(#mbody)" />
      <path d="M 150 540 L 150 460 Q 170 440 190 460 L 190 540 Z M 230 540 L 230 460 Q 250 440 270 460 L 270 540 Z" fill="#090c14" />
      <path d="M 130 290 Q 200 250 270 290" stroke="rgba(170,200,255,0.25)" strokeWidth={3} fill="none" />
    </svg>
    <CatHead look={LOOKS.midnight} size={250} glow={glow} blink={blink} style={{position: 'absolute', left: 75, top: 20}} />
    {/* collar + bell */}
    <div style={{position: 'absolute', left: 112, top: 232, width: 176, height: 16, borderRadius: 10, background: 'linear-gradient(#cfd6e4,#6d7890)', transform: 'rotate(-2deg)'}} />
    <div style={{position: 'absolute', left: 164, top: 232}}><SilverBell swing={bellSwing} /></div>
  </div>
);

/** Felix standing, front. 360x820 box. Wears a worn waistcoat. */
export const FelixStanding: React.FC<{lookX?: number; lookY?: number; blink?: number; headTilt?: number; headTurn?: number; style?: React.CSSProperties}> = ({lookX = 0, lookY = 0, blink = 0, headTilt = 0, headTurn = 0, style}) => (
  <div style={{position: 'relative', width: 360, height: 820, ...style}}>
    <svg width={360} height={820} viewBox="0 0 360 820" style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="fvest" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a2a22" /><stop offset="0.5" stopColor="#5a4234" /><stop offset="1" stopColor="#2c2019" /></linearGradient>
        <linearGradient id="ftr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#262a36" /><stop offset="1" stopColor="#14161e" /></linearGradient>
      </defs>
      <path d="M 250 700 Q 340 690 330 600 Q 322 540 350 520" stroke={LOOKS.felix.shade} strokeWidth={26} fill="none" strokeLinecap="round" />
      <rect x={118} y={520} width={54} height={270} rx={14} fill="url(#ftr)" /><rect x={188} y={520} width={54} height={270} rx={14} fill="url(#ftr)" />
      <ellipse cx={142} cy={796} rx={42} ry={16} fill="#0e0f14" /><ellipse cx={216} cy={796} rx={42} ry={16} fill="#0e0f14" />
      <path d="M 100 290 Q 180 260 260 290 L 276 540 L 84 540 Z" fill="#cfc5b4" />
      <path d="M 100 290 Q 180 262 260 290 L 270 540 L 90 540 Z" fill="url(#fvest)" />
      <path d="M 180 270 L 180 540" stroke="#1a120d" strokeWidth={3} />
      {[340, 390, 440, 490].map((y) => <circle key={y} cx={168} cy={y} r={4.5} fill="#b9a46a" />)}
      <rect x={58} y={300} width={44} height={230} rx={20} fill="#6f7580" /><rect x={258} y={300} width={44} height={230} rx={20} fill="#6f7580" />
      <ellipse cx={80} cy={540} rx={24} ry={20} fill={LOOKS.felix.fur} /><ellipse cx={280} cy={540} rx={24} ry={20} fill={LOOKS.felix.fur} />
      <path d="M 70 330 L 100 336 M 260 336 L 292 330" stroke="#3d424d" strokeWidth={4} />
    </svg>
    <CatHead look={LOOKS.felix} size={280} look_x={lookX} look_y={lookY} blink={blink} style={{position: 'absolute', left: 40, top: 40, transform: `rotate(${headTilt}deg) translateX(${headTurn}px)`, transformOrigin: '50% 90%'}} />
  </div>
);

/** One face on the old photograph; `scratched` draws savage scratch marks over the face. */
export const PhotoCat: React.FC<{look: CatLook; scratched?: boolean; size?: number}> = ({look, scratched, size = 200}) => (
  <div style={{position: 'relative', width: size, height: size * 1.4}}>
    <svg width={size} height={size * 1.4} viewBox="0 0 200 280" style={{position: 'absolute', inset: 0}}>
      <path d="M 28 280 Q 20 190 60 170 Q 100 156 140 170 Q 180 190 172 280 Z" fill={look.shade} />
    </svg>
    <CatHead look={look} size={size} style={{position: 'absolute', top: 0, left: 0}} />
    {scratched && (
      <svg width={size} height={size * 1.4} viewBox="0 0 200 280" style={{position: 'absolute', inset: 0}}>
        <path d="M 40 40 L 160 190 M 55 30 L 172 170 M 30 70 L 150 200 M 160 40 L 44 188 M 172 66 L 36 150 M 100 30 L 96 200" stroke="#e8e0d0" strokeWidth={6} strokeLinecap="round" />
        <path d="M 46 48 L 156 182 M 60 36 L 166 164 M 164 50 L 50 180" stroke="#1a110a" strokeWidth={2.4} strokeLinecap="round" />
        <path d="M 52 70 Q 100 120 60 180 M 150 80 Q 100 110 142 178" stroke="#8d2a22" strokeWidth={1.4} fill="none" opacity={0.7} />
      </svg>
    )}
  </div>
);
