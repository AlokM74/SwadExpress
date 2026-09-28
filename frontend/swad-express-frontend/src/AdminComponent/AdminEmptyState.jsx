import { Box, Typography } from "@mui/material";

const AdminEmptyState = ({ icon, message }) => (
  <Box
    sx={{
      boxSizing: "border-box",
      width: "100%",
      minHeight: 280,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      px: 2,
      py: 4,
      color: "#666",
      textAlign: "center",
    }}
  >
    {icon}
    <Typography sx={{ fontSize: 13, textAlign: "center" }}>{message}</Typography>
  </Box>
);

export default AdminEmptyState;
