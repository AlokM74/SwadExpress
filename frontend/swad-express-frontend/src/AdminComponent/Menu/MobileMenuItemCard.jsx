import { Avatar, Box, Stack, Switch, Typography } from "@mui/material";
import ActionButton from "./ActionButton";
import IngredientGroups from "./IngredientGroup";



const MobileMenuItemCard = ({ item, onToggle, onEdit, onDelete }) => (
  <Box
    sx={{
      borderRadius: "16px",
      border: "1px solid #262626",
      backgroundColor: "#181818",
      p: 2,
      display: "flex",
      flexDirection: "column",
      gap: 1.3,
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar
        src={item.image}
        alt={item.title}
        variant="rounded"
        sx={{
          width: 50,
          height: 50,
          borderRadius: "12px",
          border: "1px solid #2c2c2c",
        }}
      />

      <Box
        sx={{
          minWidth: 0,
          flex: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {item.title}
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            mt: 0.2,
          }}
        >
          {item.price}
        </Typography>
      </Box>

      <Stack direction="row" spacing={0.5}>
        <ActionButton type="edit" onClick={() => onEdit(item)} />

        <ActionButton type="delete" onClick={() => onDelete(item.id)} />
      </Stack>
    </Stack>

    <IngredientGroups ingredients={item.ingredients} />

    <Stack direction="row" spacing={0.7} alignItems="center">
      <Switch
        size="small"
        checked={item.availability}
        onChange={() => onToggle(item.id)}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#4ade80",
          },

          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#4ade80",
          },
        }}
      />

      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.03em",
          color: item.availability ? "#4ade80" : "#f87171",
        }}
      >
        {item.availability ? "IN STOCK" : "OUT OF STOCK"}
      </Typography>
    </Stack>
  </Box>
);

export default MobileMenuItemCard;