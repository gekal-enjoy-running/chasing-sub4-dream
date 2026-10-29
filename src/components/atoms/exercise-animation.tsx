import Image from 'next/image';
import Box from '@mui/material/Box';

/**
 * 動作アニメーション（public/animations/<slug>.svg）。
 * SVG 自体が SMIL で動き、prefers-color-scheme で配色も切り替わるため、JS は要らない。
 * next/image を通すのは basePath を自動で付けるため（最適化は静的書き出しでは無効）。
 */
export function ExerciseAnimation({
  slug,
  title,
  priority = false,
}: {
  slug: string;
  title: string;
  priority?: boolean;
}) {
  return (
    <Box sx={{ bgcolor: 'action.hover', display: 'flex', justifyContent: 'center' }}>
      <Image
        src={`/animations/${slug}.svg`}
        alt={`${title}的动作示意动图`}
        width={240}
        height={200}
        priority={priority}
        style={{ width: '100%', maxWidth: 360, height: 'auto' }}
      />
    </Box>
  );
}
