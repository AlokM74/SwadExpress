import { Box, Typography } from "@mui/material";


const StatCard = ({ label, value, color }) => (
  <Box
    sx={{
      minWidth: 0,
      borderRadius: "16px",
      border: "1px solid #262626",
      background: "linear-gradient(180deg, #1c1c1c 0%, #171717 100%)",
      p: 2,
      textAlign: "center",
    }}
  >
    <Typography
      sx={{
        fontSize: 12,
        color: "#8a8a8a",
        fontWeight: 500,
      }}
    >
      {label}
    </Typography>

    <Typography
      sx={{
        fontSize: 24,
        fontWeight: 700,
        color: color ?? "#fff",
        mt: 0.5,
      }}
    >
      {value}
    </Typography>
  </Box>
);

export default StatCard;