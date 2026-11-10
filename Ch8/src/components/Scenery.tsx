import React from 'react';
import {rand, flicker} from '../theme';

/** Procedural pine-tree silhouette line (seeded so it stays stable). */
export const Treeline: React.FC<{seed?: number; color?: string; width?: number; height?: number; count?: number; minH?: number; maxH?: number; style?: React.CSSProperties}> = ({
  seed = 1, color = '#060b16', width = 2200, height = 700, count = 26, minH = 260, maxH = 620, style,
}) => {
  const trees = Array.from({length: count}).map((_, i) => {
    const x = (i + rand(i + seed)) * (width / count);
    const h = minH + rand(i * 3 + seed) * (maxH - minH);
    const w = h * (0.28 + rand(i * 5 + seed) * 0.12);
    const tiers = 6 + Math.floor(rand(i * 9 + seed) * 3);
    let d = `M ${x} ${height - h}`;
    const left: string[] = [], right: string[] = [];
    for (let t = 1; t <= tiers; t++) {
      const yy = height - h + (h * t) / tiers;
      const ww = (w / 2) * (t / tiers) * (0.9 + rand(t + i + seed) * 0.3);
      left.push(`L ${x - ww} ${yy} L ${x - ww * 0.55} ${yy - 6}`);
      right.unshift(`L ${x + ww * 0.55} ${yy - 6} L ${x + ww} ${yy}`);
    }
    d += ' ' + right.join(' ') + ` L ${x} ${height} ` + left.reverse().join(' ') + ' Z';
    return <path key={i} d={d} fill={color} />;
  });
  return <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={style}>{trees}
    <rect x={0} y={height - 40} width={width} height={40} fill={color} /></svg>;
};

/** Gnarled bare tree (foreground frame). */
export const BareTree: React.FC<{seed?: number; color?: string; width?: number; height?: number; flip?: boolean; style?: React.CSSProperties}> = ({seed = 2, color = '#04060c', width = 520, height = 1100, flip, style}) => {
  const branches: string[] = [];
  const grow = (x: number, y: number, ang: number, len: number, w: number, depth: number, s: number) => {
    if (depth > 6 || len < 14) return;
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    branches.push(`<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`);
    const n = depth < 2 ? 2 : 2 + (rand(s) > 0.6 ? 1 : 0);
    for (let k = 0; k < n; k++) {
      const spread = (k - (n - 1) / 2) * (0.6 + rand(s + k) * 0.35);
      grow(x2, y2, ang + spread + (rand(s * 2 + k) - 0.5) * 0.3, len * (0.7 + rand(s + k * 3) * 0.12), w * 0.66, depth + 1, s * 1.7 + k + 1);
    }
  };
  grow(width / 2, height, -Math.PI / 2 + (rand(seed) - 0.5) * 0.15, height * 0.32, 34, 0, seed);
  return <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{transform: flip ? 'scaleX(-1)' : undefined, ...style}} dangerouslySetInnerHTML={{__html: branches.join('')}} />;
};

/** The abandoned house. 800x700 viewBox, ground at y=600. */
export const House: React.FC<{frame: number; upstairsFlicker?: boolean; doorOpen?: number; eyes?: number; windowGlow?: number; style?: React.CSSProperties}> = ({
  frame, upstairsFlicker = true, doorOpen = 0, eyes = 0, windowGlow = 1, style,
}) => {
  const fl = upstairsFlicker ? flicker(frame, 4, 0.5) : 0.9;
  const warm = (o: number) => `rgba(255,176,97,${o})`;
  const Win: React.FC<{x: number; y: number; w?: number; h?: number; o: number; broken?: boolean}> = ({x, y, w = 50, h = 72, o, broken}) => (
    <g>
      <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} fill="#0a0f1c" />
      <rect x={x} y={y} width={w} height={h} fill={warm(0.95 * o)} />
      {o > 0.2 && <rect x={x - 30} y={y - 30} width={w + 60} height={h + 60} fill={warm(0.18 * o)} style={{filter: 'blur(14px)'}} />}
      <rect x={x + w / 2 - 2} y={y} width={4} height={h} fill="#0a0f1c" />
      <rect x={x} y={y + h / 2 - 2} width={w} height={4} fill="#0a0f1c" />
      {broken && <path d={`M ${x + 6} ${y + 8} L ${x + w - 8} ${y + h - 10} M ${x + w - 6} ${y + 6} L ${x + 12} ${y + h - 6}`} stroke="#0a0f1c" strokeWidth={2} />}
    </g>
  );
  const doorW = 84 * (1 - 0.9 * doorOpen);
  return (
    <svg viewBox="0 0 800 700" width={800} height={700} style={style}>
      <defs>
        <linearGradient id="hwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a2640" /><stop offset="1" stopColor="#0b1222" /></linearGradient>
        <linearGradient id="hroof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a3a5c" /><stop offset="1" stopColor="#0d1424" /></linearGradient>
        <linearGradient id="spill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(255,190,110,0.95)" /><stop offset="1" stopColor="rgba(255,150,70,0.05)" /></linearGradient>
      </defs>
      {/* wing */}
      <rect x={70} y={380} width={160} height={220} fill="url(#hwall)" />
      <polygon points="50,392 150,290 250,392" fill="url(#hroof)" />
      {/* chimney */}
      <rect x={510} y={130} width={42} height={110} fill="#0d1424" />
      <rect x={504} y={124} width={54} height={12} fill="#1a2640" />
      {/* main body */}
      <rect x={190} y={300} width={420} height={300} fill="url(#hwall)" />
      <polygon points="160,312 400,110 640,312" fill="url(#hroof)" />
      <polygon points="160,312 400,110 400,126 182,312" fill="rgba(160,190,240,0.18)" />
      {/* clapboard lines */}
      {Array.from({length: 14}).map((_, i) => <line key={i} x1={190} x2={610} y1={312 + i * 21} y2={312 + i * 21} stroke="rgba(0,0,0,0.25)" strokeWidth={1.5} />)}
      {/* attic */}
      <circle cx={400} cy={205} r={32} fill="#0a0f1c" />
      <circle cx={400} cy={205} r={26} fill={warm(0.0)} />
      {/* windows */}
      <Win x={245} y={350} o={0.0} broken />
      <Win x={505} y={350} o={fl * windowGlow} />
      <Win x={245} y={455} o={0.55 * windowGlow * (0.85 + 0.15 * flicker(frame, 9, 0.2))} />
      <Win x={505} y={455} o={0.0} broken />
      <Win x={105} y={430} w={44} h={64} o={0.0} />
      {/* glowing eyes in the upstairs window */}
      {eyes > 0 && (
        <g opacity={eyes}>
          <rect x={505} y={350} width={50} height={72} fill="rgba(10,6,4,0.97)" />
          <ellipse cx={521} cy={386} rx={7} ry={4.5} fill="#ffe27a" style={{filter: 'drop-shadow(0 0 7px #ffd34a)'}} />
          <ellipse cx={541} cy={386} rx={7} ry={4.5} fill="#ffe27a" style={{filter: 'drop-shadow(0 0 7px #ffd34a)'}} />
          <ellipse cx={521} cy={386} rx={1.6} ry={4.2} fill="#000" /><ellipse cx={541} cy={386} rx={1.6} ry={4.2} fill="#000" />
        </g>
      )}
      {/* porch */}
      <rect x={330} y={440} width={140} height={160} fill="#0b1222" />
      <polygon points="316,452 400,410 484,452" fill="#1a2640" />
      <rect x={326} y={452} width={10} height={148} fill="#101a30" /><rect x={464} y={452} width={10} height={148} fill="#101a30" />
      {/* door + light spill */}
      <rect x={358} y={462} width={84} height={138} fill={doorOpen > 0 ? warm(0.98 * Math.min(1, doorOpen * 3)) : '#0f1626'} />
      {doorOpen > 0 && <>
        <polygon points="358,600 442,600 560,700 240,700" fill="url(#spill)" opacity={Math.min(1, doorOpen * 2) * 0.85} />
        <rect x={340} y={450} width={120} height={160} fill={warm(0.25 * doorOpen)} style={{filter: 'blur(18px)'}} />
      </>}
      <polygon points={`358,462 ${358 + doorW},${462 + 8 * doorOpen} ${358 + doorW},${600 - 8 * doorOpen} 358,600`} fill="#1b2538" stroke="#0a0f1c" strokeWidth={2} />
      <circle cx={358 + doorW - 9} cy={535} r={3.5} fill="#8896b4" opacity={1 - doorOpen} />
      {/* steps + ground line */}
      <rect x={340} y={600} width={120} height={9} fill="#141d33" /><rect x={348} y={609} width={104} height={8} fill="#101828" />
      {/* sagging porch rail */}
      <path d="M 300 560 L 330 566 M 470 566 L 510 556" stroke="#0a0f1c" strokeWidth={4} />
    </svg>
  );
};
