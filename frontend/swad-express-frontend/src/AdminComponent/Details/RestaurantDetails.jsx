import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Stack,
  Switch,
  IconButton,
} from "@mui/material";

import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import LocationCityRoundedIcon from "@mui/icons-material/LocationCityRounded";
import MarkunreadMailboxRoundedIcon from "@mui/icons-material/MarkunreadMailboxRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import {
  deleteRestaurant,
  getRestaurantByUserId,
  updateRestaurant,
  updateRestaurantStatus,
} from "../../State/Restaurant/Action";
import { useNavigate } from "react-router-dom";

const toSocialUrl = (value) => {
  if (!value) return null;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

const SECTIONS = [
  {
    title: "Restaurant Info",
    fields: [
      { key: "owner", label: "Owner", icon: PersonOutlineRoundedIcon },
      { key: "restaurantName", label: "Restaurant Name", icon: StorefrontRoundedIcon },
      { key: "cuisineType", label: "Cuisine Type", icon: LanguageRoundedIcon },
      { key: "openingHours", label: "Opening Hours", icon: AccessTimeRoundedIcon },
    ],
  },
  {
    title: "Address",
    fields: [
      { key: "country", label: "Country", icon: PublicRoundedIcon },
      { key: "city", label: "City", icon: LocationCityRoundedIcon },
      { key: "postalCode", label: "Postal Code", icon: MarkunreadMailboxRoundedIcon },
      { key: "streetAddress", label: "Street Address", icon: HomeRoundedIcon },
    ],
  },
  {
    title: "Contact",
    fields: [
      { key: "email", label: "Email", icon: MailOutlineRoundedIcon },
      { key: "mobile", label: "Mobile", icon: PhoneOutlinedIcon },
    ],
  },
];
const cardHoverSx = {
  transition: "transform 200ms ease, border-color 200ms ease",
  "&:hover": { transform: "translateY(-2px)", borderColor: "#333" },
};

const RestaurantDetails = ({ onRestaurantDeleted }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth, restaurant: restaurantState } = useSelector((store) => store);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editValues, setEditValues] = useState({});
  const jwt = localStorage.getItem("jwt");
  const restaurant = restaurantState?.userRestaurant;
  const isLoading = restaurantState?.isLoading;
  const loadError = restaurantState?.error;
  const details = {
    owner: auth.user?.fullName || restaurant?.owner?.fullName || "Not available",
    restaurantName: restaurant?.name || "Restaurant",
    cuisineType: restaurant?.cuisineType || "Not available",
    openingHours: restaurant?.openingHours || "Not available",
    isOpen: Boolean(restaurant?.open),
    country: restaurant?.address?.country || "Not available",
    city: restaurant?.address?.city || "Not available",
    postalCode: restaurant?.address?.postalCode || "Not available",
    streetAddress: restaurant?.address?.streetAddress || "Not available",
    email: restaurant?.contactInformation?.email || "Not available",
    mobile: restaurant?.contactInformation?.mobile || "Not available",
  };

  useEffect(() => {
    if (jwt) {
      dispatch(getRestaurantByUserId(jwt)).catch((error) => {
        console.error("Failed to load restaurant details:", error);
      });
    }
  }, [dispatch, jwt]);

  const socialLinks = [
    {
      label: "Instagram",
      Icon: InstagramIcon,
      href: toSocialUrl(restaurant?.contactInformation?.instagram),
    },
    {
      label: "Twitter",
      Icon: TwitterIcon,
      href: toSocialUrl(restaurant?.contactInformation?.twitter),
    },
  ].filter((social) => social.href);

  const toggleOpenStatus = async () => {
    if (!restaurant?.id || !jwt) return;
    try {
      await dispatch(updateRestaurantStatus({ restaurantId: restaurant.id, jwt }));
    } catch (error) {
      console.error("Unable to update restaurant status:", error);
    }
  };

  const openEdit = () => {
    setEditValues({
      name: restaurant.name || "",
      description: restaurant.description || "",
      cuisineType: restaurant.cuisineType || "",
      openingHours: restaurant.openingHours || "",
      streetAddress: restaurant.address?.streetAddress || "",
      city: restaurant.address?.city || "",
      stateProvince: restaurant.address?.stateProvince || "",
      postalCode: restaurant.address?.postalCode || "",
      country: restaurant.address?.country || "",
      email: restaurant.contactInformation?.email || "",
      mobile: restaurant.contactInformation?.mobile || "",
      twitter: restaurant.contactInformation?.twitter || "",
      instagram: restaurant.contactInformation?.instagram || "",
    });
    setEditOpen(true);
  };

  const saveRestaurant = async () => {
    if (!restaurant?.id || !jwt) return;
    setIsSaving(true);
    const restaurantData = {
      name: editValues.name.trim(),
      description: editValues.description.trim(),
      cuisineType: editValues.cuisineType.trim(),
      openingHours: editValues.openingHours.trim(),
      address: {
        streetAddress: editValues.streetAddress.trim(),
        city: editValues.city.trim(),
        stateProvince: editValues.stateProvince.trim(),
        postalCode: editValues.postalCode.trim(),
        country: editValues.country.trim(),
      },
      contactInformation: {
        email: editValues.email.trim(),
        mobile: editValues.mobile.trim(),
        twitter: editValues.twitter.trim(),
        instagram: editValues.instagram.trim(),
      },
    };

    try {
      await dispatch(
        updateRestaurant({
          restaurantId: restaurant.id,
          restaurantData,
          jwt,
        }),
      );
      setEditOpen(false);
    } catch (error) {
      console.error("Unable to update restaurant details:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!restaurant?.id || !jwt) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteRestaurant({ restaurantId: restaurant.id, jwt }));
      setDeleteOpen(false);
      onRestaurantDeleted?.();
      navigate("/admin/restaurant");
    } catch (error) {
      console.error("Unable to delete this restaurant:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && !restaurant) {
    return (
      <Box sx={{ display: "grid", minHeight: "60vh", placeItems: "center" }}>
        <CircularProgress sx={{ color: "#e91e63" }} />
      </Box>
    );
  }

  if (loadError && !restaurant) {
    return <Box sx={{ minHeight: "60vh" }} />;
  }

  if (!restaurant) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No restaurant details are available yet.</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: "radial-gradient(circle at top right, rgba(233,30,99,0.07), transparent 32%), #101010",
        color: "#fff",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2.5}
        sx={{ alignItems: "flex-start" }}
      >
        
        <Box
          sx={{
            width: { xs: "100%", md: 300 },
            flexShrink: 0,
            position: { md: "sticky" },
            top: { md: 24 },
            border: "1px solid #262626",
            borderRadius: "22px",
            backgroundColor: "#181818",
            p: 3,
            textAlign: "center",
            ...cardHoverSx,
          }}
        >
          <Box
            sx={{
              width: 76,
              height: 76,
              mx: "auto",
              mb: 2,
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #e91e63, #7a1f3a)",
              boxShadow: "0 10px 30px rgba(233,30,99,0.2)",
            }}
          >
            <RestaurantRoundedIcon sx={{ fontSize: 36, color: "#fff" }} />
          </Box>

          <Typography sx={{ fontSize: 19, fontWeight: 700 }}>{details.restaurantName}</Typography>
          <Typography sx={{ fontSize: 13, color: "#888", mt: 0.3 }}>Owned by {details.owner}</Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={openEdit}
              sx={{ color: "#f472b6", borderColor: "#7a1f3a", textTransform: "none" }}
            >
              Edit details
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={() => {
                setDeleteOpen(true);
              }}
              sx={{ textTransform: "none" }}
            >
              Delete
            </Button>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              justifyContent: "center",
              mt: 2.5,
              mx: "auto",
              width: "fit-content",
              px: 1.5,
              py: 0.75,
              borderRadius: "999px",
              backgroundColor: "#1f1f1f",
              border: "1px solid #2a2a2a",
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: details.isOpen ? "#4ade80" : "#f87171" }}>
              {details.isOpen ? "OPEN NOW" : "CLOSED"}
            </Typography>
            <Switch
              size="small"
              checked={details.isOpen}
              onChange={toggleOpenStatus}
              disabled={isLoading}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#4ade80" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#4ade80" },
              }}
            />
          </Stack>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ justifyContent: "center", mt: 3 }}
          >
            <Box sx={{ flex: 1, borderRadius: "12px", border: "1px solid #262626", backgroundColor: "#1c1c1c", py: 1.25 }}>
              <Typography sx={{ fontSize: 10, color: "#666", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Cuisine
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#eee", fontWeight: 600, mt: 0.3 }}>{details.cuisineType}</Typography>
            </Box>
            <Box sx={{ flex: 1.4, borderRadius: "12px", border: "1px solid #262626", backgroundColor: "#1c1c1c", py: 1.25, px: 1 }}>
              <Typography sx={{ fontSize: 10, color: "#666", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Hours
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#eee", fontWeight: 600, mt: 0.3, lineHeight: 1.3 }}>
                {details.openingHours}
              </Typography>
            </Box>
          </Stack>

          <div className="mt-5! flex gap-4 items-center justify-center">
            {socialLinks.map(({ label, Icon, href }) => (
              <IconButton
                key={label}
                component="a"
                href={href}
                target={href !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                size="small"
                sx={{
                  width: 45,
                  height: 45,
                  color: "#aaa",
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #262626",
                  borderRadius: "10px",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "#fff",
                    backgroundColor: "#e91e63",
                    borderColor: "#e91e63",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Icon sx={{ fontSize: 17 }} />
              </IconButton>
            ))}
          </div>
        </Box>

        
        <Stack spacing={2.5} sx={{ flex: 1, width: "100%" }}>
          {SECTIONS.map((section) => (
            <Box
              key={section.title}
              sx={{
                border: "1px solid #262626",
                borderRadius: "22px",
                backgroundColor: "#181818",
                px: { xs: 2.5, sm: 3 },
                py: 1,
                ...cardHoverSx,
              }}
            >
              <Typography
                sx={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: "#e91e63",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  pt: 2.25,
                  pb: 1,
                }}
              >
                {section.title}
              </Typography>

              {section.fields.map((field) => {
                const FieldIcon = field.icon;
                return (
                  <Stack
                    key={field.key}
                    direction="row"
                    spacing={1.5}
                    sx={{
                      alignItems: "center",
                      py: 1.75,
                      borderBottom: "1px solid #232323",
                      "&:last-of-type": { borderBottom: "none" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        flexShrink: 0,
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#202020",
                        color: "#888",
                      }}
                    >
                      <FieldIcon sx={{ fontSize: 17 }} />
                    </Box>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: 11,
                          color: "#777",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          mb: 0.3,
                        }}
                      >
                        {field.label}
                      </Typography>

                      <Typography sx={{ fontSize: 14.5, color: "#eee", fontWeight: 500, wordBreak: "break-word" }}>
                        {details[field.key]}
                      </Typography>
                    </Box>
                  </Stack>
                );
              })}
            </Box>
          ))}
        </Stack>
      </Stack>
      <Dialog
        open={editOpen}
        onClose={() => !isSaving && setEditOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { bgcolor: "#181818", color: "#fff" } }}
      >
        <DialogTitle>Edit restaurant details</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            {[
              ["name", "Restaurant name"],
              ["description", "Description"],
              ["cuisineType", "Cuisine type"],
              ["openingHours", "Opening hours"],
              ["streetAddress", "Street address"],
              ["city", "City"],
              ["stateProvince", "State / Province"],
              ["postalCode", "Postal code"],
              ["country", "Country"],
              ["email", "Contact email"],
              ["mobile", "Contact mobile"],
              ["twitter", "Twitter URL"],
              ["instagram", "Instagram URL"],
            ].map(([field, label]) => (
              <TextField
                key={field}
                label={label}
                value={editValues[field] || ""}
                onChange={(event) =>
                  setEditValues((current) => ({
                    ...current,
                    [field]: event.target.value,
                  }))
                }
                multiline={field === "description"}
                minRows={field === "description" ? 3 : 1}
                size="small"
                fullWidth
                sx={{
                  "& .MuiInputBase-root": { color: "#eee" },
                  "& .MuiInputLabel-root": { color: "#aaa" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
                }}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditOpen(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={saveRestaurant}
            disabled={isSaving}
            variant="contained"
            sx={{ bgcolor: "#e91e63" }}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onClose={() => !isDeleting && setDeleteOpen(false)}
        PaperProps={{ sx: { bgcolor: "#181818", color: "#fff" } }}
      >
        <DialogTitle>Delete restaurant?</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the restaurant? This action cannot be
          undone.
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            disabled={isDeleting}
            color="error"
            variant="contained"
          >
            {isDeleting ? "Deleting..." : "OK"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestaurantDetails;