import { IconButton, Tooltip } from "@mui/material";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';



const ActionButton = ({ type, onClick }) => {
  const isEdit = type === "edit";

  return (
    <Tooltip title={isEdit ? "Edit item" : "Delete item"}>
      <IconButton
        size="small"
        onClick={onClick}
        sx={{
          width: 34,
          height: 34,
          minWidth: 34,
          minHeight: 34,
          padding: 0,
          borderRadius: "10px",
          color: "#999",
          transition: "all 0.2s ease",

          "&:hover": {
            color: isEdit ? "#38bdf8" : "#f87171",
            backgroundColor: isEdit
              ? "rgba(56, 189, 248, 0.12)"
              : "rgba(248, 113, 113, 0.12)",
            borderRadius: "10px",
          },

          "&:active": {
            transform: "scale(0.94)",
          },
        }}
      >
        {isEdit ? (
          <EditRoundedIcon fontSize="small" />
        ) : (
          <DeleteRoundedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ActionButton;