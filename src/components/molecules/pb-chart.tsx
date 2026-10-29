import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { PbPoint } from '@/lib/races';
import { formatDuration } from '@/lib/time';

// テーマの cssVariables が出力する CSS 変数。ダークモードでも自動で色が切り替わる
const COLOR = {
  line: 'var(--mui-palette-primary-main)',
  goal: 'var(--mui-palette-success-main)',
  text: 'var(--mui-palette-text-primary)',
  muted: 'var(--mui-palette-text-secondary)',
  paper: 'var(--mui-palette-background-paper)',
};

/**
 * フルマラソン記録の推移を SVG で描く。
 * チャートライブラリを入れず、ビルド時に描き切ってランタイム JS をゼロにする。
 */
export function PbChart({ points, goalSeconds }: { points: PbPoint[]; goalSeconds: number }) {
  if (points.length === 0) return null;

  const width = 640;
  const height = 260;
  const pad = { top: 28, right: 24, bottom: 36, left: 48 };
  const values = [...points.map(p => p.resultSeconds), goalSeconds];
  // 上に 5 分、下に 10 分の余白を取る。下側には PB でない記録のラベルを描くため広めにする
  const min = Math.min(...values) - 300;
  const max = Math.max(...values) + 600;
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const x = (i: number) =>
    pad.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
  // タイムは速いほど上に描く
  const y = (sec: number) => pad.top + ((sec - min) / (max - min)) * innerH;
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(p.resultSeconds)}`).join('');

  return (
    <Card component="figure" sx={{ m: 0 }}>
      <CardContent>
        <Box sx={{ overflowX: 'auto' }}>
          <Box
            component="svg"
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="全马成绩变化"
            sx={{ width: '100%', minWidth: 480, height: 'auto', display: 'block' }}
          >
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={y(goalSeconds)}
              y2={y(goalSeconds)}
              stroke={COLOR.goal}
              strokeDasharray="6 4"
              strokeWidth={1.5}
            />
            <text
              x={pad.left}
              y={y(goalSeconds) - 6}
              textAnchor="start"
              fill={COLOR.goal}
              fontSize={12}
              fontWeight={700}
            >
              破四 {formatDuration(goalSeconds)}
            </text>
            <path d={path} fill="none" stroke={COLOR.line} strokeWidth={2.5} />
            {points.map((p, i) => (
              <g key={p.slug}>
                <circle
                  cx={x(i)}
                  cy={y(p.resultSeconds)}
                  r={p.isPb ? 6 : 4}
                  fill={p.isPb ? COLOR.line : COLOR.paper}
                  stroke={COLOR.line}
                  strokeWidth={2}
                />
                <text
                  x={x(i)}
                  // PB でない記録は谷になりやすく、上に描くと線と重なるため下に描く
                  y={y(p.resultSeconds) + (p.isPb ? -12 : 20)}
                  textAnchor="middle"
                  fill={COLOR.text}
                  fontSize={12}
                  fontWeight={700}
                >
                  {formatDuration(p.resultSeconds)}
                </text>
                <text x={x(i)} y={height - 12} textAnchor="middle" fill={COLOR.muted} fontSize={11}>
                  {p.date.slice(0, 7)}
                </text>
              </g>
            ))}
          </Box>
        </Box>
        <Typography component="figcaption" variant="caption" color="text.secondary">
          实心点 = 刷新 PB
        </Typography>
      </CardContent>
    </Card>
  );
}
