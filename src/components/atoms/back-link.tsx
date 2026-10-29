import Link from '@mui/material/Link';

/** 詳細ページから一覧へ戻るリンク */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} variant="body2" color="text.secondary" underline="hover">
      ← {label}
    </Link>
  );
}
