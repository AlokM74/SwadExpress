import { Box, Typography } from "@mui/material";
import { safeImageUrl } from "../config/media";

const BORDER = "#2a2a2a";
const CARD = "#161616";

const EventCard = ({ event }) => {
  const imageUrl = safeImageUrl(event.images?.[0]);

  return (
    <Box
      sx={{
        bgcolor: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: "18px",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        transition: "transform 200ms ease, border-color 200ms ease",
        "&:hover": { transform: "translateY(-3px)", borderColor: "#7a1f1f" },
      }}
    >
      {imageUrl ? (
        <Box
          component="img"
          src={imageUrl}
          alt=""
          sx={{
            display: "block",
            width: "100%",
            aspectRatio: "4/3",
            objectFit: "cover",
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            aspectRatio: "4 / 3",
            bgcolor: "#242424",
          }}
        />
      )}

      <Box sx={{ p: 2.5, minWidth: 0, height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{ fontSize: 19, fontWeight: 700, mb: 1, color: "#fff" }}
          >
            {event.title}
          </Typography>
        </Box>

        <Typography
          sx={{
            color: "#d1d5db",
            fontSize: 13,
            fontWeight: 600,
            mb: 1,
          }}
        >
          {event.restaurantName}
        </Typography>

        {event.description && (
          <Typography
            sx={{
              color: "#9ca3af",
              fontSize: 13,
              mb: 1.5,
              lineHeight: 1.5,
            }}
          >
            {event.description}
          </Typography>
        )}

        <Typography sx={{ color: "#60a5fa", fontSize: 12.5, fontWeight: 600, mt: 1.5 }}>
          {event.startDateTime}
        </Typography>
        <Typography sx={{ color: "#f87171", fontSize: 12.5, fontWeight: 600, mt: 0.4 }}>
          {event.endDateTime}
        </Typography>
      </Box>
    </Box>
  );
};

export default EventCard;
