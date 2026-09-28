import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AddRounded as AddRoundedIcon,
  CategoryRounded as CategoryRoundedIcon,
  CloseRounded as CloseRoundedIcon,
  Inventory2Rounded as Inventory2RoundedIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AdminEmptyState from "../AdminEmptyState";
import {
  createIngredientCategory,
  getIngredientCategory,
  getIngredientsOfRestaurant,
} from "../../State/Ingredients/Action";
import { notify } from "../../components/config/notifications";

const fieldSx = {
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

const IngredientsCategory = () => {
  const dispatch = useDispatch();
  const { jwt } = useSelector((state) => state.auth);
  const restaurant = useSelector((state) => state.restaurant.userRestaurant);
  const {
    category: ingredientCategories = [],
    ingredients = [],
  } = useSelector((state) => state.ingredients);
  const restaurantId = restaurant?.id ?? restaurant?.restaurantId;
  const [loading, setLoading] = useState(Boolean(restaurantId && jwt));
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(() => {
        if (!active || !restaurantId || !jwt) return undefined;
        setLoading(true);
        return Promise.all([
          dispatch(getIngredientCategory({ restaurantId, jwt })),
          dispatch(getIngredientsOfRestaurant({ restaurantId, jwt })),
        ]);
      })
      .catch((error) => {
        if (active) console.error("Unable to load ingredient categories:", error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [dispatch, restaurantId, jwt]);

  const itemsByCategory = useMemo(() => {
    const groupedItems = new Map();
    ingredients.forEach((item) => {
      const categoryId = item.categoryId ?? item.category?.id;
      if (categoryId === undefined || categoryId === null) return;
      const key = String(categoryId);
      groupedItems.set(key, [...(groupedItems.get(key) ?? []), item]);
    });
    return groupedItems;
  }, [ingredients]);

  const handleCreateCategory = async () => {
    const name = categoryName.trim();
    if (!name) {
      notify("Ingredient category name is required.", "error");
      return;
    }

    setSaving(true);
    try {
      await dispatch(
        createIngredientCategory({
          reqData: { name, restaurantId },
          jwt,
        }),
      );
      await dispatch(getIngredientCategory({ restaurantId, jwt }));
      setCategoryName("");
      setDialogOpen(false);
      notify("Ingredient category created successfully.", "success");
    } catch (error) {
      console.error("Unable to create ingredient category:", error);
    } finally {
      setSaving(false);
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
          <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
            Ingredient Category
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#8a8a8a", mt: 0.5 }}>
            Create ingredient categories and view the items assigned to each.
          </Typography>
        </Box>
        <Button
          startIcon={<AddRoundedIcon />}
          onClick={() => {
            setCategoryName("");
            setDialogOpen(true);
          }}
          disabled={!restaurantId || !jwt || saving}
          sx={{
            background: "linear-gradient(135deg, #e91e63 0%, #c2185b 100%)",
            color: "#fff",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "12px",
            px: 2.5,
            py: 1.1,
          }}
        >
          Add Ingredient Category
        </Button>
      </Stack>

      {!restaurantId && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Restaurant information is not available. Ingredient categories cannot
          be loaded.
        </Alert>
      )}

      {loading ? (
        <Typography sx={{ py: 6, textAlign: "center", color: "#aaa" }}>
          Loading ingredient categories…
        </Typography>
      ) : ingredientCategories.length === 0 ? (
        <Box
          sx={{
            border: "1px solid #262626",
            borderRadius: "20px",
            backgroundColor: "#181818",
            overflow: "hidden",
          }}
        >
          <AdminEmptyState
            icon={<CategoryRoundedIcon sx={{ fontSize: 36 }} />}
            message="No ingredient categories yet. Create one to organize ingredient items."
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 2,
          }}
        >
          {ingredientCategories.map((category) => {
            const categoryItems =
              itemsByCategory.get(String(category.id)) ?? [];
            return (
              <Box
                key={category.id}
                sx={{
                  border: "1px solid #262626",
                  borderRadius: "18px",
                  backgroundColor: "#181818",
                  overflow: "hidden",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ px: 2.5, py: 2, borderBottom: "1px solid #262626" }}
                >
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <CategoryRoundedIcon sx={{ color: "#7E57C2" }} />
                    <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                      {category.name ?? category.categoryName}
                    </Typography>
                  </Stack>
                  <Chip
                    label={`${categoryItems.length} ${
                      categoryItems.length === 1 ? "item" : "items"
                    }`}
                    size="small"
                    sx={{ backgroundColor: "#292929", color: "#ccc" }}
                  />
                </Stack>
                {categoryItems.length ? (
                  <Stack spacing={0.75} sx={{ p: 2 }}>
                    {categoryItems.map((item) => (
                      <Stack
                        key={item.id}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                          px: 1.5,
                          py: 1.25,
                          borderRadius: 2,
                          backgroundColor: "#202020",
                        }}
                      >
                        <Inventory2RoundedIcon
                          sx={{ color: "#888", fontSize: 18 }}
                        />
                        <Typography sx={{ flex: 1, fontSize: 14 }}>
                          {item.name}
                        </Typography>
                        <Chip
                          label={item.stoke ?? item.isStoke ? "In stock" : "Out of stock"}
                          size="small"
                          sx={{
                            color:
                              item.stoke ?? item.isStoke ? "#4ade80" : "#f87171",
                            backgroundColor: "#292929",
                          }}
                        />
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <Typography
                    sx={{ px: 2.5, py: 2.25, color: "#888", fontSize: 13 }}
                  >
                    No ingredient items in this category yet.
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => !saving && setDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#161616",
              border: "1px solid #262626",
              borderRadius: "18px",
              backgroundImage: "none",
              color: "#fff",
            },
          },
        }}
      >
        <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
              Add Ingredient Category
            </Typography>
            <IconButton
              onClick={() => setDialogOpen(false)}
              disabled={saving}
              size="small"
              sx={{ color: "#888" }}
              aria-label="Close dialog"
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Stack spacing={2}>
            <TextField
              label="Category name"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              disabled={saving}
              autoFocus
              fullWidth
              sx={fieldSx}
            />
            <Button
              onClick={handleCreateCategory}
              disabled={saving || !restaurantId || !jwt}
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
              }}
            >
              {saving ? "Saving…" : "Create Category"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default IngredientsCategory;
