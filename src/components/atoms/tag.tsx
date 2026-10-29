import Chip from '@mui/material/Chip';

export function Tag({ label }: { label: string }) {
  return <Chip label={label} size="small" color="primary" variant="outlined" />;
}
