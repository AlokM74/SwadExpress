import { Box, Typography, Chip } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const BORDER = '#2a2a2a';
const CARD = '#161616';

 const STATUS_CONFIG = {
  Delivered: { color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)', icon: CheckCircleOutlineOutlinedIcon },
  'Ready for delivery': { color: '#9c5cff', bg: 'rgba(156, 92, 255, 0.1)', icon: CheckCircleOutlineOutlinedIcon },
  'Out for delivery': { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)', icon: LocalShippingOutlinedIcon },
  Processing: { color: '#facc15', bg: 'rgba(250, 204, 21, 0.1)', icon: ScheduleOutlinedIcon },
  Cancelled: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: CancelOutlinedIcon },
};

const OrderCard = ({ order, onClick }) => {
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.Processing;
  const StatusIcon = config.icon;
  const itemLabel =
    order.items.length === 1
      ? order.items[0].name
      : `${order.items[0].name} + ${order.itemCount - 1} more`;

  return (
    <Box
      onClick={() => onClick?.(order)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.(order);
      }}
      sx={{
        bgcolor: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 3,
        p: { xs: 2, sm: 2.5 },
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1.5, sm: 2.5 },
        cursor: 'pointer',
        transition: 'border-color 0.2s ease',
        '&:hover': { borderColor: '#3d3d3d' },
      }}
    >
      
      <Box
        sx={{
          width: { xs: 48, sm: 60 },
          height: { xs: 48, sm: 60 },
          borderRadius: 2,
          bgcolor: '#222',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: { xs: 11, sm: 12 },
          color: '#6b7280',
          overflow: 'hidden',
        }}
      >
        {order.items[0]?.image ? (
          <Box
            component="img"
            src={order.items[0].image}
            alt={order.items[0].name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          'Food'
        )}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Typography sx={{ fontSize: { xs: 13, sm: 14 }, fontWeight: 600 }}>
            {order.id}
          </Typography>
          <Chip
            icon={<StatusIcon sx={{ fontSize: '15px !important', color: `${config.color} !important` }} />}
            label={order.status}
            size="small"
            sx={{
              bgcolor: config.bg,
              color: config.color,
              fontSize: 11,
              height: 24,
              border: `1px solid ${config.color}40`,
            }}
          />
        </Box>

        <Typography noWrap sx={{ fontSize: { xs: 12, sm: 13 }, color: '#9ca3af', mt: 0.5 }}>
          {itemLabel}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 1,
          }}
        >
          <Typography sx={{ fontSize: { xs: 11, sm: 12 }, color: '#6b7280' }}>
            Placed on {order.date}
          </Typography>
          <Typography sx={{ fontSize: { xs: 13, sm: 14 }, fontWeight: 600 }}>
            {order.total}
          </Typography>
        </Box>
      </Box>

      <KeyboardArrowRightIcon sx={{ color: '#6b7280', display: { xs: 'none', sm: 'block' } }} />
    </Box>
  );
};

export default OrderCard;