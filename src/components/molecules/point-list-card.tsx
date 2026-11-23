import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

const ICONS = { check: CheckCircleOutlineIcon, muscle: FitnessCenterIcon };

/** 见出し + 箇条書きのカード（优势・锻炼到的地方） */
export function PointListCard({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: keyof typeof ICONS;
}) {
  const Icon = ICONS[icon];
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h3" component="h2">
          {title}
        </Typography>
        <List dense disablePadding sx={{ mt: 1 }}>
          {items.map(item => (
            <ListItem key={item} disableGutters sx={{ alignItems: 'flex-start' }}>
              <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                <Icon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
