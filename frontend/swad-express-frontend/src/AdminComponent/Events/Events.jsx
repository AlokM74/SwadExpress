import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import AdminEmptyState from "../AdminEmptyState";
import {
  createEventAction,
  deleteEventAction,
  getRestaurantsEvents,
  updateEventAction,
} from "../../State/Restaurant/Action";
import { notify } from "../../components/config/notifications";
import EventCard from "./EventCard";

const emptyForm = {
  eventName: "",
  eventDescription: "",
  eventStart: "",
  eventEnd: "",
  imageUrl: "",
};

const darkFieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#1c1c1c",
    borderRadius: "10px",
    color: "#fff",
    "& fieldset": { borderColor: "#2e2e2e" },
    "&:hover fieldset": { borderColor: "#444" },
    "&.Mui-focused fieldset": { borderColor: "#e91e63" },
  },
  "& .MuiInputLabel-root": { color: "#888" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#e91e63" },
  "& input::-webkit-calendar-picker-indicator": { filter: "invert(1)" },
};


const toDateTimeInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return String(dateString).slice(0, 16);
  const pad = (part) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const getEventImage = (event) =>
  Array.isArray(event.images) ? event.images[0] : event.images;


const Events = () => {
  const dispatch = useDispatch();
  const { jwt } = useSelector((state) => state.auth);
  const restaurant = useSelector((state) => state.restaurant.userRestaurant);
  const events = useSelector((state) => state.restaurant.restaurantEvents) ?? [];
  const restaurantId = restaurant?.id;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyEventId, setBusyEventId] = useState(null);

  useEffect(() => {
    if (!restaurantId || !jwt) return;
    let active = true;
    Promise.resolve()
      .then(() => {
        if (!active) return undefined;
        setLoading(true);
        return dispatch(getRestaurantsEvents({ restaurantId, jwt }));
      })
      .catch((requestError) => {
        if (active) console.error("Unable to load restaurant events:", requestError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [dispatch, restaurantId, jwt]);

  const updateField = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const closeDialog = () => {
    if (saving) return;
    setDialogOpen(false);
    setEditingEvent(null);
    setForm(emptyForm);
  };

  const openCreateDialog = () => {
    setEditingEvent(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (event) => {
    setEditingEvent(event);
    setForm({
      eventName: event.eventName ?? "",
      eventDescription: event.eventDescription ?? "",
      eventStart: toDateTimeInput(event.eventStart),
      eventEnd: toDateTimeInput(event.eventEnd),
      imageUrl: getEventImage(event) ?? "",
    });
    setDialogOpen(true);
  };

  const reloadEvents = async () => {
    await dispatch(getRestaurantsEvents({ restaurantId, jwt }));
  };

  const handleSave = async () => {
    if (!form.eventName.trim() || !form.eventStart || !form.eventEnd) {
      notify("Enter an event title, start date, and end date.", "error");
      return;
    }
    const startTime = new Date(form.eventStart).getTime();
    const endTime = new Date(form.eventEnd).getTime();
    if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime <= startTime) {
      notify("The end date and time must be later than the start date and time.", "error");
      return;
    }
    if (form.imageUrl.trim()) {
      try {
        const url = new URL(form.imageUrl.trim());
        if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid protocol");
      } catch {
        notify("Enter a valid image URL beginning with http:// or https://.", "error");
        return;
      }
    }

    const data = {
      eventName: form.eventName.trim(),
      eventDescription: form.eventDescription.trim(),
      eventStart: form.eventStart,
      eventEnd: form.eventEnd,
      images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
    };

    setSaving(true);
    try {
      if (editingEvent) {
        await dispatch(updateEventAction({ eventId: editingEvent.id, data, jwt }));
      } else {
        await dispatch(createEventAction({ data, jwt, restaurantId }));
      }
      await reloadEvents();
      setDialogOpen(false);
      setEditingEvent(null);
      setForm(emptyForm);
    } catch (requestError) {
      console.error("Unable to save event:", requestError);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId) => {
    setBusyEventId(eventId);
    try {
      await dispatch(deleteEventAction({ eventId, jwt }));
      await reloadEvents();
    } catch (requestError) {
      console.error("Unable to delete event:", requestError);
    } finally {
      setBusyEventId(null);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#fff",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 700 }}>Events</Typography>
          <Typography sx={{ fontSize: 13, color: "#8a8a8a", mt: 0.5 }}>
            Promotions and food events running on your storefront.
          </Typography>
        </Box>
        <Button
          startIcon={<AddRoundedIcon />}
          onClick={openCreateDialog}
          disabled={!restaurantId || !jwt}
          sx={{
            backgroundColor: "#e91e63",
            color: "#fff",
            textTransform: "uppercase",
            fontWeight: 700,
            fontSize: 12.5,
            letterSpacing: "0.03em",
            borderRadius: "10px",
            px: 3,
            py: 1.2,
            "&:hover": { backgroundColor: "#d81b5f" },
          }}
        >
          Create New Event
        </Button>
      </Stack>

      {!restaurantId && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Restaurant information is not available. Events cannot be loaded.
        </Alert>
      )}

      {loading ? (
        <Typography sx={{ py: 6, textAlign: "center", color: "#aaa" }}>
          Loading events…
        </Typography>
      ) : events.length === 0 ? (
        <Box
          sx={{
            border: "1px dashed #262626",
            borderRadius: "18px",
            overflow: "hidden",
          }}
        >
          <AdminEmptyState
            icon={<EventRoundedIcon sx={{ fontSize: 34 }} />}
            message="No events yet. Create your first one."
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            },
            gap: 2.5,
          }}
        >
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={openEditDialog}
              onDelete={handleDelete}
              busy={busyEventId === event.id}
            />
          ))}
        </Box>
      )}

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#161616",
              border: "1px solid #262626",
              borderRadius: "18px",
              backgroundImage: "none",
            },
          },
        }}
      >
        <DialogContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
              {editingEvent ? "Edit Event" : "Create New Event"}
            </Typography>
            <IconButton size="small" onClick={closeDialog} sx={{ color: "#888" }} disabled={saving}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Stack spacing={2.5}>
            {form.imageUrl && (
              <Box
                component="img"
                src={form.imageUrl}
                alt="Event image preview"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
                sx={{
                  width: 120,
                  height: 90,
                  objectFit: "cover",
                  borderRadius: "10px",
                  border: "1px solid #333",
                }}
              />
            )}
            <TextField
              label="Image URL"
              placeholder="https://example.com/event-image.jpg"
              value={form.imageUrl}
              onChange={updateField("imageUrl")}
              fullWidth
              sx={darkFieldSx}
            />
            <TextField
              label="Event title"
              value={form.eventName}
              onChange={updateField("eventName")}
              fullWidth
              sx={darkFieldSx}
            />
            <TextField
              label="Event description"
              value={form.eventDescription}
              onChange={updateField("eventDescription")}
              fullWidth
              multiline
              minRows={3}
              sx={darkFieldSx}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  component="label"
                  htmlFor="event-start"
                  sx={{ display: "block", color: "#aaa", fontSize: 13, mb: 0.75 }}
                >
                  Start date &amp; time
                </Typography>
                <TextField
                  id="event-start"
                  type="datetime-local"
                  value={form.eventStart}
                  onChange={updateField("eventStart")}
                  fullWidth
                  sx={darkFieldSx}
                />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  component="label"
                  htmlFor="event-end"
                  sx={{ display: "block", color: "#aaa", fontSize: 13, mb: 0.75 }}
                >
                  End date &amp; time
                </Typography>
                <TextField
                  id="event-end"
                  type="datetime-local"
                  value={form.eventEnd}
                  onChange={updateField("eventEnd")}
                  fullWidth
                  sx={darkFieldSx}
                />
              </Box>
            </Stack>
            <Button
              onClick={handleSave}
              disabled={saving}
              sx={{
                alignSelf: "flex-start",
                backgroundColor: "#e91e63",
                color: "#fff",
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: 12.5,
                letterSpacing: "0.03em",
                borderRadius: "8px",
                px: 3,
                py: 1.2,
                "&:hover": { backgroundColor: "#d81b5f" },
              }}
            >
              {saving ? "Saving…" : editingEvent ? "Save Changes" : "Create Event"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Events;
