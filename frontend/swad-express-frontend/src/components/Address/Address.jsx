import {
  Box,
  Typography,
  Chip,
  IconButton,
  Radio,
  Button,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";

const ACCENT = "#7a1f1f";
const BORDER = "#2a2a2a";
const CARD = "#161616";

const type_icon = {
  Home: HomeOutlinedIcon,
  Work: WorkOutlineOutlinedIcon,
  Other: LocationOnOutlinedIcon,
};

const Address = ({
  address,
  onEdit,
  onDelete,
  onSelect,
  selected,
  isAddNew = false,
  onAdd,
}) => {
  if (isAddNew) {
    return (
      <Box
        onClick={onAdd}
        sx={{
          bgcolor: CARD,
          width: "100%",
          minHeight: { xs: 210, sm: 225, md: 235 },
          boxSizing: "border-box",
          border: `1px dashed ${BORDER}`,
          borderRadius: { xs: 2.5, sm: 3 },
          p: { xs: 1.75, sm: 2.25, md: 2.5 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.25,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: ACCENT,
            bgcolor: "#1c1c1c",
          },
        }}
      >
        <AddLocationAltOutlinedIcon sx={{ color: ACCENT, fontSize: 34 }} />
        <Typography sx={{ fontWeight: 600 }}>Add new address</Typography>
        <Button
          variant="outlined"
          onClick={(event) => {
            event.stopPropagation();
            onAdd?.();
          }}
          sx={{
            color: "#f87171",
            borderColor: ACCENT,
            textTransform: "none",
            "&:hover": {
              borderColor: "#f87171",
              bgcolor: "rgba(122, 31, 31, 0.15)",
            },
          }}
        >
          Add address
        </Button>
      </Box>
    );
  }

  const isSelected = selected ?? address?.isDefault;
  const TypeIcon =
    type_icon[address?.type] || LocationOnOutlinedIcon;

  const addressType = address?.type || "Address";

  const streetAddress =
    address?.line1 ||
    address?.streetAddress ||
    "";

  const city = address?.city || "";

  const state =
    address?.state ||
    address?.stateProvince ||
    "";

  const postalCode =
    address?.pincode ||
    address?.postalCode ||
    "";

  return (
    <Box
      sx={{
        bgcolor: CARD,
        width: "100%",
        maxWidth: "100%",
        minHeight: {
          xs: 210,
          sm: 225,
          md: 235,
        },
        boxSizing: "border-box",

        border: `1px solid ${
          selected || address?.isDefault
            ? ACCENT
            : BORDER
        }`,

        borderRadius: {
          xs: 2.5,
          sm: 3,
        },

        p: {
          xs: 1.75,
          sm: 2.25,
          md: 2.5,
        },

        display: "flex",
        flexDirection: "column",

        gap: {
          xs: 1,
          sm: 1.25,
        },

        overflow: "hidden",

        transition: "all 0.2s ease",

        "&:hover": {
          borderColor: ACCENT,
        },
      }}
    >
      
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,

          minWidth: 0,
        }}
      >
        
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              xs: 0.75,
              sm: 1,
            },

            minWidth: 0,
            flex: 1,
          }}
        >
          <TypeIcon
            sx={{
              fontSize: {
                xs: 17,
                sm: 19,
              },
              color: "#9ca3af",
              flexShrink: 0,
            }}
          />

          <Typography
            sx={{
              fontSize: {
                xs: 13,
                sm: 14,
              },

              fontWeight: 600,

              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {addressType}
          </Typography>

          {address?.isDefault && (
            <Chip
              label="Default"
              size="small"
              sx={{
                bgcolor: "rgba(122, 31, 31, 0.15)",
                color: "#f87171",

                fontSize: {
                  xs: 9,
                  sm: 10,
                },

                height: {
                  xs: 19,
                  sm: 20,
                },

                border: `1px solid ${ACCENT}`,

                flexShrink: 0,

                "& .MuiChip-label": {
                  px: {
                    xs: 0.75,
                    sm: 1,
                  },
                },
              }}
            />
          )}
        </Box>

        
        <Box
          sx={{
            display: "flex",
            gap: {
              xs: 0,
              sm: 0.5,
            },

            flexShrink: 0,
          }}
        >
          {onEdit && (
            <IconButton
              size="small"
              onClick={() => onEdit(address)}
              sx={{
                color: "#9ca3af",
                p: { xs: 0.65, sm: 0.75 },
                "&:hover": {
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.05)",
                },
              }}
            >
              <EditOutlinedIcon
                sx={{ fontSize: { xs: 17, sm: 19 } }}
              />
            </IconButton>
          )}

          <IconButton
            size="small"
            onClick={() => onDelete?.(address)}
            sx={{
              color: "#9ca3af",

              p: {
                xs: 0.65,
                sm: 0.75,
              },

              "&:hover": {
                color: "#f87171",
                bgcolor: "rgba(248,113,113,0.05)",
              },
            }}
          >
            <DeleteOutlineOutlinedIcon
              sx={{
                fontSize: {
                  xs: 17,
                  sm: 19,
                },
              }}
            />
          </IconButton>
        </Box>
      </Box>

      
      <Typography
        sx={{
          fontSize: {
            xs: 13,
            sm: 14,
          },

          fontWeight: 500,

          wordBreak: "break-word",
        }}
      >
        {address?.name || "Delivery address"}

        {address?.phone && (
          <Box
            component="span"
            sx={{
              color: "#9ca3af",
              fontWeight: 400,
            }}
          >
            {" · "}
            {address.phone}
          </Box>
        )}
      </Typography>

      
      <Typography
        sx={{
          fontSize: {
            xs: 12,
            sm: 13,
          },

          color: "#9ca3af",
          lineHeight: 1.6,

          wordBreak: "break-word",

          overflowWrap: "anywhere",
        }}
      >
        {streetAddress}

        {address?.line2 && (
          <>
            {streetAddress && ", "}
            {address.line2}
          </>
        )}

        {(city || state || postalCode) && (
          <>
            <br />

            {[city, state]
              .filter(Boolean)
              .join(", ")}

            {postalCode && (
              <>
                {" - "}
                {postalCode}
              </>
            )}
          </>
        )}
      </Typography>

      {onSelect && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: "auto",
            pt: { xs: 0.5, sm: 0.75 },
            cursor: "pointer",
          }}
          onClick={() => onSelect(address)}
        >
          <Radio
            size="small"
            checked={Boolean(isSelected)}
            onChange={() => onSelect(address)}
            onClick={(e) => e.stopPropagation()}
            sx={{
              color: "#6b7280",
              p: { xs: 0.5, sm: 0.6 },
              mr: 0.5,
              "&.Mui-checked": { color: ACCENT },
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: 11.5, sm: 12, md: 13 },
              color: isSelected ? "#fff" : "#9ca3af",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            {isSelected ? "Default address" : "Set as default"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Address;