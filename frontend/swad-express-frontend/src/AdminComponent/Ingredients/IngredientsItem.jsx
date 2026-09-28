import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AdminEmptyState from "../AdminEmptyState";
import {
  createIngredient,
  deleteIngredient,
  getIngredientCategory,
  getIngredientsOfRestaurant,
  updateIngredient,
  updateStockOfIngredient,
} from "../../State/Ingredients/Action";
import { notify } from "../../components/config/notifications";

const emptyForm = { name: "", categoryId: "" };

const isIngredientInStock = (ingredient) =>
  Boolean(ingredient.isStoke ?? ingredient.stoke);

const darkFieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#1c1c1c",
    borderRadius: "12px",
    color: "#fff",
    "& fieldset": { borderColor: "#2e2e2e" },
    "&:hover fieldset": { borderColor: "#444" },
    "&.Mui-focused fieldset": { borderColor: "#e91e63" },
  },
  "& .MuiInputLabel-root": { color: "#888" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#e91e63" },
};

const getCategoryId = (ingredient) =>
  ingredient.categoryId ?? ingredient.category?.id ?? "";

const getCategoryName = (ingredient, categories) => {
  if (ingredient.category && typeof ingredient.category === "object") {
    return ingredient.category.name ?? ingredient.category.categoryName ?? "Uncategorized";
  }
  if (typeof ingredient.category === "string" && ingredient.category) {
    return ingredient.category;
  }
  const category = categories.find(
    (item) => String(item.id) === String(getCategoryId(ingredient)),
  );
  return category?.name ?? category?.categoryName ?? "Uncategorized";
};

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
    <Typography sx={{ fontSize: 12, color: "#8a8a8a", fontWeight: 500 }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: 24, fontWeight: 700, color: color || "#fff", mt: 0.5 }}>
      {value}
    </Typography>
  </Box>
);

const IngredientsItem = () => {
  const dispatch = useDispatch();
  const { jwt } = useSelector((state) => state.auth);
  const restaurant = useSelector((state) => state.restaurant.userRestaurant);
  const {
    ingredients = [],
    category: ingredientCategories = [],
  } = useSelector((state) => state.ingredients);
  const restaurantId = restaurant?.id;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyIngredientId, setBusyIngredientId] = useState(null);
  const [, setError] = useState("");

  useEffect(() => {
    if (!restaurantId || !jwt) return;
    let active = true;
    Promise.resolve()
      .then(() => {
        if (!active) return [];
        setLoading(true);
        setError("");
        return Promise.all([
          dispatch(getIngredientsOfRestaurant({ restaurantId, jwt })),
          dispatch(getIngredientCategory({ restaurantId, jwt })),
        ]);
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError?.response?.data?.message ??
              requestError?.message ??
              "Unable to load ingredients.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [dispatch, restaurantId, jwt]);

  const counts = useMemo(
    () => ({
      total: ingredients.length,
      inStock: ingredients.filter(isIngredientInStock).length,
      outOfStock: ingredients.filter((item) => !isIngredientInStock(item)).length,
    }),
    [ingredients],
  );

  const openAddDialog = () => {
    setEditingIngredient(null);
    setForm(emptyForm);
    setError("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setDialogOpen(false);
    setEditingIngredient(null);
    setForm(emptyForm);
  };

  const updateField = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleEdit = (ingredient) => {
    setEditingIngredient(ingredient);
    setForm({
      name: ingredient.name ?? "",
      categoryId: String(getCategoryId(ingredient)),
    });
    setError("");
    setDialogOpen(true);
  };

  const reloadIngredients = async () => {
    await dispatch(getIngredientsOfRestaurant({ restaurantId, jwt }));
  };

  const handleSave = async () => {
    const name = form.name.trim();
    const selectedCategory = ingredientCategories.find(
      (item) => String(item.id) === String(form.categoryId),
    );
    if (!name || !selectedCategory) {
      notify("Enter an ingredient name and select a loaded category.", "error");
      return;
    }

    const categoryId = selectedCategory.id;
    setSaving(true);
    setError("");
    try {
      if (editingIngredient) {
        await dispatch(
          updateIngredient({
            ingredientId: editingIngredient.id,
            reqData: { name, categoryId },
            jwt,
          }),
        );
      } else {
        await dispatch(
          createIngredient({
            reqData: { restaurantId, name, categoryId },
            jwt,
          }),
        );
      }
      await reloadIngredients();
      setDialogOpen(false);
      setEditingIngredient(null);
      setForm(emptyForm);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ??
          requestError?.message ??
          "Unable to save ingredient.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ingredientId) => {
    setBusyIngredientId(ingredientId);
    setError("");
    try {
      await dispatch(deleteIngredient({ ingredientId, jwt }));
      await reloadIngredients();
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ??
          requestError?.message ??
          "Unable to delete ingredient.",
      );
    } finally {
      setBusyIngredientId(null);
    }
  };

  const toggleStock = async (ingredientId) => {
    setBusyIngredientId(ingredientId);
    setError("");
    try {
      await dispatch(updateStockOfIngredient({ ingredientId, jwt }));
      await reloadIngredients();
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ??
          requestError?.message ??
          "Unable to update ingredient availability.",
      );
    } finally {
      setBusyIngredientId(null);
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
          <Typography sx={{ fontSize: 24, fontWeight: 700 }}>Ingredients Item</Typography>
          <Typography sx={{ fontSize: 13, color: "#8a8a8a", mt: 0.5 }}>
            Manage ingredients and their availability.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button
            startIcon={<AddRoundedIcon />}
            onClick={openAddDialog}
            disabled={
              !restaurantId || !jwt || ingredientCategories.length === 0 || saving
            }
            sx={{
            background: "linear-gradient(135deg, #e91e63 0%, #c2185b 100%)",
            color: "#fff",
            textTransform: "none",
            fontWeight: 700,
            fontSize: 13,
            borderRadius: "12px",
            px: 2.5,
            py: 1.1,
            minHeight: 42,
            boxShadow: "0 8px 25px rgba(233,30,99,0.18)",
            "&:hover": {
              background: "linear-gradient(135deg, #f1266d 0%, #d81b60 100%)",
              transform: "translateY(-1px)",
              boxShadow: "0 10px 30px rgba(233,30,99,0.25)",
            },
            transition: "all 0.2s ease",
          }}
          >
            Add Ingredient Items
          </Button>
        </Stack>
      </Stack>

      {!restaurantId && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Restaurant information is not available. Ingredients cannot be loaded.
        </Alert>
      )}
      {restaurantId && ingredientCategories.length === 0 && !loading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Create an ingredient category before adding ingredient items.
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
          gap: { xs: 1.2, sm: 2 },
          mb: 3,
        }}
      >
        <StatCard label="Total ingredients" value={counts.total} />
        <StatCard
          label="Ingredient categories"
          value={ingredientCategories.length}
          color="#38bdf8"
        />
        <StatCard label="In stock" value={counts.inStock} color="#4ade80" />
        <StatCard label="Out of stock" value={counts.outOfStock} color="#f87171" />
      </Box>

      <Box
        sx={{
          border: "1px solid #262626",
          borderRadius: "20px",
          backgroundColor: "#181818",
          overflow: "hidden",
        }}
      >
        <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 2, borderBottom: "1px solid #262626" }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600 }}>All Ingredients</Typography>
          <Typography sx={{ fontSize: 11, color: "#666", mt: 0.4 }}>
            Manage your restaurant ingredients
          </Typography>
        </Box>

        {loading ? (
          <Typography sx={{ py: 6, textAlign: "center", color: "#aaa" }}>
            Loading ingredients…
          </Typography>
        ) : ingredients.length === 0 ? (
          <AdminEmptyState
            icon={<Inventory2RoundedIcon sx={{ fontSize: 36 }} />}
            message="No ingredients yet."
          />
        ) : (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 650, tableLayout: "fixed" }}>
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      color: "#777",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #262626",
                      py: 1.5,
                    },
                  }}
                >
                  <TableCell sx={{ width: "35%" }}>Ingredient</TableCell>
                  <TableCell sx={{ width: "25%" }}>Category</TableCell>
                  <TableCell sx={{ width: "25%" }}>Availability</TableCell>
                  <TableCell sx={{ width: "15%" }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ingredients.map((ingredient) => {
                  const inStock = isIngredientInStock(ingredient);
                  const busy = busyIngredientId === ingredient.id;
                  return (
                    <TableRow
                      key={ingredient.id}
                      sx={{
                        transition: "background-color 150ms ease",
                        "&:hover": { backgroundColor: "#1e1e1e" },
                        "& td": {
                          borderBottom: "1px solid #242424",
                          color: "#ddd",
                          py: 1.8,
                        },
                      }}
                    >
                      <TableCell>
                        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                          {ingredient.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getCategoryName(ingredient, ingredientCategories)}
                          size="small"
                          sx={{
                            backgroundColor: "#2a2a2a",
                            color: "#ccc",
                            fontSize: 11,
                            borderRadius: "8px",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          disabled={busy}
                          onClick={() => toggleStock(ingredient.id)}
                          sx={{
                            color: inStock ? "#4ade80" : "#f87171",
                            textTransform: "none",
                            fontSize: 12,
                            minWidth: 0,
                            px: 1,
                          }}
                        >
                          {inStock ? "In stock" : "Out of stock"}
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="Edit ingredient">
                            <span>
                              <IconButton
                                size="small"
                                disabled={busy}
                                onClick={() => handleEdit(ingredient)}
                                sx={{ color: "#888", "&:hover": { color: "#60a5fa" } }}
                              >
                                <EditRoundedIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Delete ingredient">
                            <span>
                              <IconButton
                                size="small"
                                disabled={busy}
                                onClick={() => handleDelete(ingredient.id)}
                                sx={{ color: "#888", "&:hover": { color: "#f87171" } }}
                              >
                                <DeleteRoundedIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

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
              {editingIngredient ? "Edit Ingredient" : "Add Ingredient"}
            </Typography>
            <IconButton size="small" onClick={closeDialog} sx={{ color: "#888" }} disabled={saving}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Stack spacing={2.5}>
            <TextField
              label="Ingredient name"
              value={form.name}
              onChange={updateField("name")}
              fullWidth
              sx={darkFieldSx}
              autoFocus
            />
            <FormControl fullWidth sx={darkFieldSx}>
              <InputLabel id="ingredient-category-label">Category</InputLabel>
              <Select
                labelId="ingredient-category-label"
                value={form.categoryId}
                label="Category"
                onChange={updateField("categoryId")}
              >
                {ingredientCategories.map((item) => (
                  <MenuItem key={item.id} value={String(item.id)}>
                    {item.name ?? item.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              onClick={handleSave}
              disabled={
                saving ||
                !restaurantId ||
                !jwt ||
                ingredientCategories.length === 0
              }
              sx={{
                alignSelf: "flex-start",
                backgroundColor: "#e91e63",
                color: "#fff",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "10px",
                px: 3,
                py: 1.1,
                "&:hover": { backgroundColor: "#d81b5f" },
                "&:disabled": { color: "#888" },
              }}
            >
              {saving ? "Saving…" : editingIngredient ? "Save Changes" : "Add Ingredient"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default IngredientsItem;
