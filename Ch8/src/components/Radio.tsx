import React from 'react';

export const Radio: React.FC<{on: number; frame: number; style?: React.CSSProperties}> = ({on, frame, style}) => {
  const needle = 190 + Math.sin(frame / 6) * 10 * on + Math.sin(frame / 2.1) * 4 * on;
  return (
    <svg width={760} height={560} viewBox="0 0 760 560" style={style}>
      <defs>
        <linearGradient id="rwood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5a3a22" /><stop offset="0.5" stopColor="#3b2414" /><stop offset="1" stopColor="#1e120a" /></linearGradient>
        <radialGradient id="rdial" cx="50%" cy="60%" r="70%"><stop offset="0" stopColor="#ffd9a0" /><stop offset="1" stopColor="#b8651e" /></radialGradient>
        <pattern id="grille" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#1b1009" /><circle cx="7" cy="7" r="3" fill="#080503" /></pattern>
      </defs>
      <rect x={20} y={20} width={720} height={520} rx={70} fill="url(#rwood)" stroke="#120a05" strokeWidth={6} />
      <rect x={50} y={50} width={660} height={460} rx={50} fill="none" stroke="rgba(255,200,140,0.12)" strokeWidth={3} />
      {/* speaker */}
      <rect x={70} y={90} width={300} height={400} rx={30} fill="url(#grille)" stroke="#0c0704" strokeWidth={4} />
      <circle cx={220} cy={290} r={140} fill="none" stroke="rgba(255,190,120,0.06)" strokeWidth={3} />
      {/* dial window */}
      <rect x={400} y={90} width={290} height={190} rx={22} fill="#0d0805" stroke="#6b4a2b" strokeWidth={5} />
      <rect x={410} y={100} width={270} height={170} rx={14} fill="url(#rdial)" opacity={0.08 + 0.92 * on} />
      <g opacity={0.25 + 0.75 * on} stroke="#2a1608" strokeWidth={2}>
        {Array.from({length: 25}).map((_, i) => <line key={i} x1={430 + i * 10} x2={430 + i * 10} y1={210} y2={i % 4 === 0 ? 180 : 195} />)}
        <path d="M 425 210 H 675" />
      </g>
      <g fill="#2a1608" fontFamily="serif" fontSize={16} opacity={0.3 + 0.7 * on}><text x={428} y={170}>55</text><text x={500} y={170}>80</text><text x={574} y={170}>120</text><text x={640} y={170}>160</text></g>
      <line x1={needle + 240} x2={needle + 240} y1={116} y2={232} stroke="#b01818" strokeWidth={3} opacity={0.4 + 0.6 * on} />
      {on > 0.1 && <rect x={400} y={80} width={290} height={210} rx={22} fill="rgba(255,170,80,0.28)" style={{filter: 'blur(26px)'}} opacity={on} />}
      {/* knobs */}
      {[470, 620].map((x) => <g key={x}><circle cx={x} cy={400} r={46} fill="#1a0f08" stroke="#8c6a3f" strokeWidth={5} /><circle cx={x} cy={400} r={34} fill="#2e1c10" /><line x1={x} y1={400} x2={x + 16} y2={376} stroke="#c9a56a" strokeWidth={5} strokeLinecap="round" /></g>)}
      <circle cx={680} cy={340} r={8} fill={on > 0.2 ? '#ff9a3a' : '#2b1408'} style={{filter: on > 0.2 ? 'drop-shadow(0 0 8px #ff9a3a)' : undefined}} />
    </svg>
  );
};
