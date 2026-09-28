import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  Button,
  TextField,
} from "@mui/material";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { GET_USER_SUCCESS } from "../../State/Authentication/ActionType";
import { updateUserProfile } from "../../State/Authentication/ProfileAction";
import { notify } from "../config/notifications";

const ACCENT = "#7a1f1f";
const BG = "#0e0e0e";
const BORDER = "#2a2a2a";
const CARD = "#161616";

const DetailRow = ({ icon: Icon, label, value, color = "#9ca3af" }) => {
  return (
    <Box
      className="profile-scrollbar-hidden"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        py: 1.1,
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          bgcolor: `${color}12`,
        }}
      >
        <Icon
          sx={{
            fontSize: 18,
            color,
          }}
        />
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            fontSize: 11,
            color: "#6b7280",
            mb: 0.2,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 13, sm: 14 },
            color: "#e5e5e5",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || "Not available"}
        </Typography>
      </Box>
    </Box>
  );
};

const UserDetails = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [fullNameInput, setFullNameInput] = useState(
    user?.fullName || user?.name || "",
  );
  const [isSaving, setIsSaving] = useState(false);

  const fullName = user?.fullName || user?.name || "Guest";

  const email = user?.email || "";

  const role = user?.role || "ROLE_CUSTOMER";

  const addresses = user?.addresses || [];

  const defaultAddress =
    addresses.find((address) => address.isDefault) || addresses[0];

  const address = [
    defaultAddress?.streetAddress,
    defaultAddress?.city,
    defaultAddress?.stateProvince,
    defaultAddress?.postalCode,
    defaultAddress?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const emailVerified = Boolean(user?.emailVerified);

  const roleLabel =
    role === "ROLE_RESTAURANT_OWNER" ? "Restaurant Owner" : "Customer";

  const handleCancelEdit = () => {
    setFullNameInput(fullName === "Guest" ? "" : fullName);
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    const fullName = fullNameInput.trim();
    if (!fullName) {
      notify("Please enter your name.", "error");
      return;
    }

    const jwt = localStorage.getItem("jwt");
    if (!jwt || !user?.email) {
      notify("Please sign in again to update your profile.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser = await updateUserProfile({
        jwt,
        profile: { fullName, email: user.email },
      });
      dispatch({ type: GET_USER_SUCCESS, payload: updatedUser });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        bgcolor: BG,
        color: "#e5e5e5",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, sm: 5 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: { xs: 2.5, sm: 3.5 },
          gap: 2,
        }}
      >
        <Typography sx={{ fontSize: { xs: 20, sm: 26 }, fontWeight: 600 }}>
          <div className="flex gap-2 items-center">
            <PersonOutlineOutlinedIcon sx={{ color: "#42A5F5" }} />
            <span>Profile</span>
          </div>
        </Typography>
        {isEditing ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={handleCancelEdit}
              disabled={isSaving}
              startIcon={<CloseOutlinedIcon />}
              sx={{ color: "#9ca3af", textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              startIcon={<SaveOutlinedIcon />}
              sx={{
                color: "#fff",
                bgcolor: ACCENT,
                textTransform: "none",
                "&:hover": { bgcolor: "#922626" },
              }}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </Box>
        ) : (
          <Button
            onClick={() => {
                setFullNameInput(user?.fullName || user?.name || "");
                setIsEditing(true);
            }}
            startIcon={<EditOutlinedIcon />}
            sx={{ color: "#fca5a5", textTransform: "none" }}
          >
            Edit
          </Button>
        )}
      </Box>

      <Box
        sx={{
          bgcolor: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 3,
          p: { xs: 2, sm: 2.5 },
          mb: { xs: 1.5, sm: 2 },
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: { xs: 60, sm: 70 },
            height: { xs: 60, sm: 70 },
            bgcolor: ACCENT,
            fontSize: { xs: 24, sm: 28 },
            flexShrink: 0,
          }}
        >
          {fullName.charAt(0).toUpperCase()}
        </Avatar>

        <Box
          sx={{
            minWidth: 0,
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              flexWrap: "wrap",
            }}
          >
            {isEditing ? (
              <TextField
                size="small"
                label="Full name"
                value={fullNameInput}
                onChange={(event) => setFullNameInput(event.target.value)}
                disabled={isSaving}
                autoFocus
                sx={{
                  maxWidth: 320,
                  "& .MuiInputBase-input": { color: "#e5e5e5" },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: BORDER,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#555",
                  },
                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: ACCENT,
                  },
                }}
              />
            ) : (
              <Typography sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 600 }}>
                {fullName}
              </Typography>
            )}

            {emailVerified && (
              <VerifiedOutlinedIcon
                sx={{
                  color: "#22c55e",
                  fontSize: 19,
                }}
              />
            )}
          </Box>

          <Typography
            sx={{
              color: "#9ca3af",
              fontSize: { xs: 12, sm: 13 },
              mt: 0.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {email || "No email available"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 0.8,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={roleLabel}
              size="small"
              sx={{
                height: 22,
                bgcolor: "rgba(122, 31, 31, 0.15)",
                color: "#fca5a5",
                border: `1px solid ${ACCENT}`,
                fontSize: 10,
              }}
            />

            <Chip
              label={emailVerified ? "Verified" : "Not verified"}
              size="small"
              sx={{
                height: 22,
                bgcolor: emailVerified
                  ? "rgba(34, 197, 94, 0.1)"
                  : "rgba(239, 68, 68, 0.1)",
                color: emailVerified ? "#86efac" : "#fca5a5",
                border: `1px solid ${emailVerified ? "#166534" : "#7f1d1d"}`,
                fontSize: 10,
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
          },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Box
          sx={{
            bgcolor: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 3,
            p: { xs: 2, sm: 2.5 },
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "#e5e5e5",
              mb: 1,
            }}
          >
            Personal Information
          </Typography>

          <Divider
            sx={{
              borderColor: BORDER,
              mb: 0.5,
            }}
          />

          <DetailRow
            icon={PersonOutlineOutlinedIcon}
            label="Full Name"
            value={fullName}
            color="#42A5F5"
          />

          <DetailRow
            icon={BadgeOutlinedIcon}
            label="Account Type"
            value={roleLabel}
            color="#AB47BC"
          />
        </Box>

        <Box
          sx={{
            bgcolor: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 3,
            p: { xs: 2, sm: 2.5 },
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "#e5e5e5",
              mb: 1,
            }}
          >
            Contact Information
          </Typography>

          <Divider
            sx={{
              borderColor: BORDER,
              mb: 0.5,
            }}
          />

          <DetailRow
            icon={EmailOutlinedIcon}
            label="Email Address"
            value={email}
            color="#EC407A"
          />

          <DetailRow
            icon={VerifiedOutlinedIcon}
            label="Email Status"
            value={emailVerified ? "Email Verified" : "Email Not Verified"}
            color={emailVerified ? "#22c55e" : "#ef4444"}
          />
        </Box>

        <Box
          sx={{
            bgcolor: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 3,
            p: { xs: 2, sm: 2.5 },
            gridColumn: {
              xs: "auto",
              sm: "1 / -1",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "#e5e5e5",
              mb: 1,
            }}
          >
            Address Information
          </Typography>

          <Divider
            sx={{
              borderColor: BORDER,
              mb: 0.5,
            }}
          />

          <DetailRow
            icon={LocationOnOutlinedIcon}
            label="Complete Address"
            value={address}
            color="#7E57C2"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default UserDetails;
