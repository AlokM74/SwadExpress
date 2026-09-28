import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

const getEventImage = (event) =>
  Array.isArray(event.images) ? event.images[0] : event.images;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString || "Date unavailable";
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};


const EventCard = ({ event, onEdit, onDelete, busy }) => {
  const image = getEventImage(event);
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "18px",
        border: "1px solid #262626",
        backgroundColor: "#181818",
        overflow: "hidden",
        transition: "transform 200ms ease, border-color 200ms ease",
        "&:hover": { transform: "translateY(-3px)", borderColor: "#7a1f1f" },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          overflow: "hidden",
          backgroundColor: "#202020",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {image ? (
          <Box
            component="img"
            src={image}
            alt={event.eventName}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <AddPhotoAlternateRoundedIcon sx={{ color: "#555", fontSize: 40 }} />
        )}
        {image && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.75) 100%)",
            }}
          />
        )}
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Typography sx={{ fontSize: 19, fontWeight: 700, mb: 1 }}>
          {event.eventName}
        </Typography>
        {event.eventDescription && (
          <Typography sx={{ fontSize: 13, color: "#aaa", mb: 1.5, whiteSpace: "pre-line" }}>
            {event.eventDescription}
          </Typography>
        )}
        <Stack spacing={0.4} sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 12.5, color: "#60a5fa", fontWeight: 600 }}>
            {formatDate(event.eventStart)}
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: "#f87171", fontWeight: 600 }}>
            {formatDate(event.eventEnd)}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit event">
            <span>
              <IconButton
                size="small"
                disabled={busy}
                onClick={() => onEdit(event)}
                sx={{
                  color: "#999",
                  border: "1px solid #2a2a2a",
                  borderRadius: "8px",
                  "&:hover": { color: "#60a5fa", backgroundColor: "#60a5fa14" },
                }}
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Delete event">
            <span>
              <IconButton
                size="small"
                disabled={busy}
                onClick={() => onDelete(event.id)}
                sx={{
                  color: "#999",
                  border: "1px solid #2a2a2a",
                  borderRadius: "8px",
                  "&:hover": {
                    color: "#f87171",
                    backgroundColor: "#f8717114",
                    borderColor: "#f8717155",
                  },
                }}
              >
                <DeleteRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );
};

export default EventCard;