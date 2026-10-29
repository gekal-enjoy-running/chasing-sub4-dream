import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function NotFound() {
  return (
    <Box sx={{ py: 10, textAlign: 'center' }}>
      <Typography color="primary" sx={{ fontSize: '4rem', fontWeight: 700 }}>
        404
      </Typography>
      <Typography variant="h1" sx={{ mt: 2, fontSize: '1.5rem' }}>
        这条路线不存在
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        可能是迷路了，回到起点重新出发吧。
      </Typography>
      <Button href="/" variant="contained" sx={{ mt: 4 }}>
        返回首页
      </Button>
    </Box>
  );
}
