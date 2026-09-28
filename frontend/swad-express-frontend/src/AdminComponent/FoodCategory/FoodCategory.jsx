import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Stack,
  Button,
  Dialog,
  DialogContent,
  TextField,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import AdminEmptyState from "../AdminEmptyState";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../components/config/notifications";
import {
  createCategoryAction,
  deleteCategoryAction,
  getRestaurantCategory,
  updateCategoryAction,
} from "../../State/Restaurant/Action";

const getErrorMessage = (error) =>
  error?.response?.data?.message ??
  error?.message ??
  "Something went wrong. Please try again.";

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
};

const StatCard = ({ label, value }) => (
  <Box
    sx={{
      flex: "1 1 150px",
      minWidth: 140,
      borderRadius: "16px",
      border: "1px solid #262626",
      background: "linear-gradient(180deg, #1c1c1c 0%, #171717 100%)",
      p: 2,
    }}
  >
    <Typography sx={{ fontSize: 12, color: "#8a8a8a", fontWeight: 500 }}>{label}</Typography>
    <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#fff", mt: 0.5 }}>{value}</Typography>
  </Box>
);

const FoodCategory = () => {
  const dispatch = useDispatch();
  const jwt = useSelector((state) => state.auth.jwt);
  const restaurant = useSelector((state) => state.restaurant.userRestaurant);
  const storedCategories = useSelector((state) => state.restaurant.categories);
  const categories = Array.isArray(storedCategories) ? storedCategories : [];
  const restaurantId = restaurant?.id ?? restaurant?.restaurantId;
  const [loadedRestaurantId, setLoadedRestaurantId] = useState(null);
  const [loading, setLoading] = useState(Boolean(restaurantId && jwt));
  const [busy, setBusy] = useState(false);
  const [, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const isEditing = editingId !== null;
  const visibleCategories =
    String(loadedRestaurantId) === String(restaurantId) ? categories : [];

  useEffect(() => {
    let active = true;
    const loadCategories = async () => {
      await Promise.resolve();
      if (!active) return;

      if (!jwt || !restaurantId) {
        setLoading(false);
        setLoadedRestaurantId(null);
        setError("Sign in and select a restaurant to manage its categories.");
        return;
      }

      setLoading(true);
      setError("");
      setLoadedRestaurantId(null);
      try {
        await dispatch(getRestaurantCategory(jwt, restaurantId));
        if (active) setLoadedRestaurantId(restaurantId);
      } catch (requestError) {
        if (active) setError(getErrorMessage(requestError));
      } finally {
        if (active) setLoading(false);
      }
    };
    loadCategories();

    return () => {
      active = false;
    };
  }, [dispatch, jwt, restaurantId]);

  const refreshCategories = async () => {
    try {
      await dispatch(getRestaurantCategory(jwt, restaurantId));
      setLoadedRestaurantId(restaurantId);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const openAddDialog = () => {
    setEditingId(null);
    setName("");
    setError("");
    setDialogOpen(true);
  };

  const openEditDialog = (category) => {
    setEditingId(category.id);
    setName(category.name);
    setError("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (!busy) setDialogOpen(false);
  };

  const handleSave = async () => {
    if (busy) return;
    const trimmed = name.trim();
    if (!trimmed) {
      notify("Category name is required.", "error");
      return;
    }

    setBusy(true);
    setError("");
    try {
      if (isEditing) {
        await dispatch(
          updateCategoryAction({
            categoryId: editingId,
            reqData: { name: trimmed },
            jwt,
          }),
        );
      } else {
        await dispatch(
          createCategoryAction({ reqData: { name: trimmed }, jwt }),
        );
      }
      setDialogOpen(false);
      await refreshCategories();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await dispatch(deleteCategoryAction({ categoryId: id, jwt }));
      await refreshCategories();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
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
          <Typography sx={{ fontSize: 24, fontWeight: 700 }}>Categories</Typography>
          <Typography sx={{ fontSize: 13, color: "#8a8a8a", mt: 0.5 }}>
            Group your menu items into food categories.
          </Typography>
        </Box>

        <Button
          startIcon={<AddRoundedIcon />}
          onClick={openAddDialog}
          disabled={loading || busy || !restaurantId}
          sx={{
            backgroundColor: "#e91e63",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            borderRadius: "999px",
            px: 2.5,
            py: 1,
            "&:hover": { backgroundColor: "#d81b5f" },
          }}
        >
          Add Category
        </Button>
      </Stack>

      <Stack direction="row" flexWrap="wrap" spacing={2} sx={{ mb: 3 }}>
        <StatCard label="Total categories"         value={visibleCategories.length} />
      </Stack>

      <Box
        sx={{
          border: "1px solid #262626",
          borderRadius: "20px",
          backgroundColor: "#181818",
          overflow: "hidden",
        }}
      >
        <Typography sx={{ fontSize: 15, fontWeight: 600, px: 2.5, py: 2, borderBottom: "1px solid #262626" }}>
          All Categories
        </Typography>

        {loading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
            <Typography sx={{ fontSize: 13, color: "#888" }}>
              Loading categories…
            </Typography>
          </Stack>
        ) : visibleCategories.length === 0 ? (
          <AdminEmptyState
            icon={<CategoryRoundedIcon sx={{ fontSize: 34 }} />}
            message="No categories yet."
          />
        ) : (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      color: "#7a7a7a",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #262626",
                      py: 1.5,
                    },
                  }}
                >
                  <TableCell sx={{ width: "15%" }}>Id</TableCell>
                  <TableCell sx={{ width: "65%" }}>Name</TableCell>
                  <TableCell sx={{ width: "20%" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {visibleCategories.map((category) => (
                  <TableRow
                    key={category.id}
                    sx={{
                      transition: "background-color 150ms ease",
                      "&:hover": { backgroundColor: "#1e1e1e" },
                      "& td": {
                        color: "#eee",
                        borderBottom: "1px solid #232323",
                        py: 1.75,
                        fontSize: 13,
                      },
                      "&:last-of-type td": { borderBottom: "none" },
                    }}
                  >
                    <TableCell sx={{ color: "#888 !important" }}>{category.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{category.name}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Edit category">
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(category)}
                            disabled={busy}
                            sx={{
                              color: "#999",
                              "&:hover": { color: "#38bdf8", backgroundColor: "#38bdf814" },
                            }}
                          >
                            <EditRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete category">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(category.id)}
                            disabled={busy}
                            sx={{
                              color: "#999",
                              "&:hover": { color: "#f87171", backgroundColor: "#f8717114" },
                            }}
                          >
                            <DeleteRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="xs"
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
        <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
              {isEditing ? "Edit Category" : "Add New Category"}
            </Typography>
            <IconButton onClick={closeDialog} size="small" sx={{ color: "#888" }}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Stack spacing={2.5}>
            <TextField
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={busy}
              autoFocus
              fullWidth
              sx={darkFieldSx}
            />

            <Button
              onClick={handleSave}
              disabled={busy}
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
              {busy
                ? "Saving…"
                : isEditing
                  ? "Save Changes"
                  : "Create Category"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FoodCategory;