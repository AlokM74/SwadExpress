import { useEffect, useMemo, useState } from "react";
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
  Avatar,
  Stack,
  Switch,
  Button,
  Chip,
  Dialog,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import IngredientGroups from "./IngredientGroup";
import StatCard from "./StatCard";
import ActionButton from "./ActionButton";
import MobileMenuItemCard from "./MobileMenuItemCard";
import AdminEmptyState from "../AdminEmptyState";
import { useDispatch, useSelector } from "react-redux";
import {
  createMenuItem,
  deleteFoodAction,
  getMenuItemsByRestaurantId,
  updateMenuItemAvailability,
  updateMenuItemDetails,
} from "../../State/Menu/Action";
import { getRestaurantCategory } from "../../State/Restaurant/Action";
import {
  getIngredientCategory,
  getIngredientsOfRestaurant,
} from "../../State/Ingredients/Action";
import { notify } from "../../components/config/notifications";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  ingredients: [],
  isVegetarian: "Yes",
  isSeasonal: "No",
  imageUrls: "",
};
const EMPTY_LIST = [];

const getErrorMessage = (error) =>
  error?.response?.data?.message ??
  error?.message ??
  "Something went wrong. Please try again.";

const getBooleanValue = (value, fallback = false) => {
  if (value === undefined || value === null) return fallback;
  return value === true || value === 1 || value === "true";
};

const darkFieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#1c1c1c",
    borderRadius: "10px",
    color: "#fff",

    "& fieldset": {
      borderColor: "#2e2e2e",
    },

    "&:hover fieldset": {
      borderColor: "#444",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#e91e63",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#888",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#e91e63",
  },
};

const Menu = () => {
  const dispatch = useDispatch();
  const jwt = useSelector((state) => state.auth.jwt);
  const restaurant = useSelector((state) => state.restaurant.userRestaurant);
  const storedMenuItems = useSelector((state) => state.menu.menuItems);
  const storedCategories = useSelector(
    (state) => state.restaurant.categories,
  );
  const storedIngredients = useSelector(
    (state) => state.ingredients.ingredients,
  );
  const categories = Array.isArray(storedCategories) ? storedCategories : EMPTY_LIST;
  const availableIngredients = useMemo(
    () => (Array.isArray(storedIngredients) ? storedIngredients : []),
    [storedIngredients],
  );
  const restaurantId = restaurant?.id ?? restaurant?.restaurantId;
  const [loadedRestaurantId, setLoadedRestaurantId] = useState(null);
  const [loading, setLoading] = useState(Boolean(restaurantId && jwt));
  const [busy, setBusy] = useState(false);
  const [, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingFoodId, setEditingFoodId] = useState(null);
  const isEditing = editingFoodId !== null;
  const menuItems = useMemo(() => {
    if (String(loadedRestaurantId) !== String(restaurantId)) return [];

    return (Array.isArray(storedMenuItems) ? storedMenuItems : []).map((item) => {
      const rawIngredients = Array.isArray(item.ingredients)
        ? item.ingredients
        : [];
      const ingredientGroups = rawIngredients
        .map((ingredient) => {
          const ingredientId =
            typeof ingredient === "object"
              ? ingredient?.id
              : ingredient;
          const ingredientItem = availableIngredients.find(
            (candidate) =>
              String(candidate.id) === String(ingredientId) ||
              (typeof ingredient === "string" &&
                candidate.name?.toLowerCase() === ingredient.toLowerCase()),
          );
          const name =
            typeof ingredient === "string"
              ? ingredientItem?.name ?? ingredient
              : ingredient?.name ??
                ingredient?.ingredientName ??
                ingredientItem?.name;
          const categoryName =
            ingredient?.categoryName ??
            ingredientItem?.categoryName ??
            ingredient?.category?.name ??
            ingredientItem?.category?.name ??
            "Uncategorized";
          return name ? { name, categoryName } : null;
        })
        .filter(Boolean)
        .reduce((groups, ingredient) => {
          const group = groups.find(
            (itemGroup) => itemGroup.category === ingredient.categoryName,
          );
          if (group) {
            group.items.push(ingredient.name);
          } else {
            groups.push({
              category: ingredient.categoryName,
              items: [ingredient.name],
            });
          }
          return groups;
        }, []);
      const category = item.category ?? item.foodCategory;
      const categoryName =
        item.categoryName ??
        item.foodCategoryName ??
        (typeof category === "object"
          ? category?.name ??
            category?.categoryName ??
            categories.find(
              (candidate) =>
                String(candidate.id) === String(category?.id),
            )?.name
          : category) ??
        categories.find(
          (candidate) =>
            String(candidate.id) === String(item.categoryId),
        )?.name ??
        "";
      const images = Array.isArray(item.images)
        ? item.images
        : typeof item.images === "string"
          ? [item.images]
          : item.image
            ? [item.image]
            : [];
      const price = item.price ?? "";
      const image = images[0] ?? "";

      return {
        ...item,
        id: item.id ?? item.foodId,
        title: item.name ?? "",
        categoryName,
        vegetarian: getBooleanValue(
          item.isVegetarian ?? item.vegetarian,
        ),
        seasonal: getBooleanValue(
          item.isSeasonal ??
            item.seasonal ??
            item.isSessional ??
            item.sessional,
        ),
        image,
        ingredients: ingredientGroups,
        price:
          typeof price === "string" && price.startsWith("₹")
            ? price
            : `₹${price}`,
        availability:
          getBooleanValue(
            item.available ??
              item.isAvailable ??
              item.availability ??
              item.inStock ??
              item.isInStock,
            true,
          ),
        raw: item,
      };
    });
  }, [
    availableIngredients,
    categories,
    loadedRestaurantId,
    restaurantId,
    storedMenuItems,
  ]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      await Promise.resolve();
      if (!active) return;

      if (!jwt || !restaurantId) {
        setLoading(false);
        setLoadedRestaurantId(null);
        setError("Sign in and select a restaurant to manage its menu.");
        return;
      }

      setLoading(true);
      setError("");
      setLoadedRestaurantId(null);
      const [
        menuResult,
        categoryResult,
        ingredientResult,
        ingredientCategoryResult,
      ] =
        await Promise.allSettled([
        dispatch(getMenuItemsByRestaurantId({ restaurantId, jwt })),
        dispatch(getRestaurantCategory(jwt, restaurantId)),
        dispatch(getIngredientsOfRestaurant({ restaurantId, jwt })),
        dispatch(getIngredientCategory({ restaurantId, jwt })),
      ]);
      if (active) {
        if (menuResult.status === "fulfilled") {
          setLoadedRestaurantId(restaurantId);
        }
        const failedRequest = [
          menuResult,
          categoryResult,
          ingredientResult,
          ingredientCategoryResult,
        ].find(
          (result) => result.status === "rejected",
        );
        if (failedRequest) setError(getErrorMessage(failedRequest.reason));
        setLoading(false);
      }
    };
    loadData();

    return () => {
      active = false;
    };
  }, [dispatch, jwt, restaurantId]);

  const refreshMenu = async () => {
    try {
      await dispatch(getMenuItemsByRestaurantId({ restaurantId, jwt }));
      setLoadedRestaurantId(restaurantId);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const counts = useMemo(
    () => ({
      total: menuItems.length,

      inStock: menuItems.filter((item) => item.availability).length,

      outOfStock: menuItems.filter((item) => !item.availability).length,
    }),
    [menuItems],
  );

  const openAddDialog = () => {
    setEditingFoodId(null);
    setForm(emptyForm);
    setError("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (busy) return;
    setDialogOpen(false);
  };

  const updateField = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSaveMenuItem = async () => {
    if (busy) return;
    if (!form.name.trim() || !form.price.trim() || !form.category) {
      notify("Name, price, and category are required.", "error");
      return;
    }

    const selectedCategory = categories.find(
      (category) => String(category.id) === String(form.category),
    );
    const images = form.imageUrls
      .split(",")
      .map((imageUrl) => imageUrl.trim())
      .filter(Boolean);
    if (images.some((imageUrl) => !/^https?:\/\/\S+$/i.test(imageUrl))) {
      notify("Enter a valid http or https image URL.", "error");
      return;
    }
    const menu = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: selectedCategory
        ? { id: selectedCategory.id, name: selectedCategory.name }
        : form.category,
      images,
      restaurantId,
      vegetarian: form.isVegetarian === "Yes",
      seasonal: form.isSeasonal === "Yes",
      ingredients: form.ingredients
        .map((ingredientId) =>
          availableIngredients.find(
            (ingredient) => String(ingredient.id) === String(ingredientId),
          ),
        )
        .filter(Boolean)
        .map((ingredient) => ({ id: ingredient.id })),
    };

    setBusy(true);
    setError("");
    try {
      if (isEditing) {
        await dispatch(
          updateMenuItemDetails({ foodId: editingFoodId, menu, jwt }),
        );
      } else {
        await dispatch(createMenuItem({ menu, jwt }));
      }
      setDialogOpen(false);
      setEditingFoodId(null);
      await refreshMenu();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (item) => {
    const raw = item.raw;
    const category = raw.category ?? raw.foodCategory;
    const categoryId =
      (typeof category === "object" ? category?.id : undefined) ??
      raw.categoryId ??
      (categories.find(
        (candidate) =>
          candidate.name ===
          (typeof category === "object" ? category?.name : category),
      )?.id ??
        "");
    const ingredients = Array.isArray(raw.ingredients)
      ? raw.ingredients
          .map((ingredient) => {
            const ingredientId =
              typeof ingredient === "object"
                ? ingredient?.id
                : ingredient;
            const ingredientItem = availableIngredients.find(
              (candidate) =>
                String(candidate.id) === String(ingredientId) ||
                (typeof ingredient === "string" &&
                  candidate.name?.toLowerCase() === ingredient.toLowerCase()),
            );
            return ingredientItem ? String(ingredientItem.id) : "";
          })
          .filter(Boolean)
      : [];
    setError("");
    setEditingFoodId(item.id);
    setForm({
      name: raw.name ?? "",
      description: raw.description ?? "",
      price: String(raw.price ?? ""),
      category: String(categoryId),
      ingredients,
      isVegetarian: getBooleanValue(raw.isVegetarian ?? raw.vegetarian)
        ? "Yes"
        : "No",
      isSeasonal: getBooleanValue(
        raw.isSeasonal ??
          raw.seasonal ??
          raw.isSessional ??
          raw.sessional,
      )
        ? "Yes"
        : "No",
      imageUrls: Array.isArray(raw.images)
        ? raw.images.join(", ")
        : typeof raw.images === "string"
          ? raw.images
          : raw.image ?? "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await dispatch(deleteFoodAction({ foodId: id, jwt }));
      await refreshMenu();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const toggleAvailability = async (id) => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await dispatch(updateMenuItemAvailability({ foodId: id, jwt }));
      await refreshMenu();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };
  const imagePreview = form.imageUrls
    .split(",")
    .map((url) => url.trim())
    .find(Boolean);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#fff",
        p: {
          xs: 2,
          sm: 3,
        },
      }}
    >
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={1.5}
        sx={{
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Menu
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              color: "#8a8a8a",
              mt: 0.5,
            }}
          >
            Manage dishes, pricing and availability.
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

            "&:hover": {
              backgroundColor: "#d81b5f",
            },
          }}
        >
          Add Item
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
          },
          gap: {
            xs: 1.2,
            sm: 2,
          },
          mb: 3,
        }}
      >
        <StatCard label="Total items" value={counts.total} />

        <StatCard label="In stock" value={counts.inStock} color="#4ade80" />

        <StatCard
          label="Out of stock"
          value={counts.outOfStock}
          color="#f87171"
        />
      </Box>

      <Box
        sx={{
          border: "1px solid #262626",
          borderRadius: "20px",
          backgroundColor: "#181818",
          overflow: "hidden",
        }}
      >
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 600,
            px: 2.5,
            py: 2,
            borderBottom: "1px solid #262626",
          }}
        >
          All Menu Items
        </Typography>

        {loading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
            <Typography sx={{ fontSize: 13, color: "#888" }}>
              Loading menu items…
            </Typography>
          </Stack>
        ) : menuItems.length === 0 ? (
          <AdminEmptyState
            icon={<RestaurantMenuRoundedIcon sx={{ fontSize: 34 }} />}
            message="No menu items yet."
          />
        ) : (
          <>
            <Box
              sx={{
                display: {
                  xs: "flex",
                  sm: "none",
                },
                flexDirection: "column",
                gap: 1.2,
                p: 1.5,
              }}
            >
              {menuItems.map((item) => (
                <MobileMenuItemCard
                  key={item.id}
                  item={item}
                  onToggle={toggleAvailability}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </Box>

            <TableContainer
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
                overflowX: "auto",
              }}
            >
              <Table
                sx={{
                  minWidth: 900,
                  tableLayout: "fixed",
                }}
              >
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
                    <TableCell
                      sx={{
                        width: "22%",
                      }}
                    >
                      Item
                    </TableCell>

                    <TableCell
                      sx={{
                        width: "42%",
                      }}
                    >
                      Ingredients
                    </TableCell>

                    <TableCell
                      sx={{
                        width: "10%",
                      }}
                    >
                      Price
                    </TableCell>

                    <TableCell
                      sx={{
                        width: "14%",
                      }}
                    >
                      Availability
                    </TableCell>

                    <TableCell
                      sx={{
                        width: "12%",
                      }}
                      align="right"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        verticalAlign: "top",

                        transition: "background-color 150ms ease",

                        "&:hover": {
                          backgroundColor: "#1e1e1e",
                        },

                        "& td": {
                          color: "#eee",
                          borderBottom: "1px solid #232323",
                          py: 2,
                          fontSize: 13,
                        },

                        "&:last-of-type td": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <div className="flex flex-col gap-2  items-center justify-center text-center"> 
                            <Avatar
                              src={item.image}
                              alt={item.title}
                              variant="rounded"
                              sx={{
                                width: 100,
                                height: 100,
                                borderRadius: "12px",
                                border: "1px solid #2c2c2c",
                              }}
                            />

                            <Typography
                              sx={{
                                fontSize: 16,
                                fontWeight: 550,
                              }}
                            >
                              {item.title}
                            </Typography>
                          </div>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <IngredientGroups ingredients={item.ingredients} />
                      </TableCell>

                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#fff !important",
                        }}
                      >
                        {item.price}
                      </TableCell>

                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <Switch
                            size="small"
                            checked={item.availability}
                            onChange={() => toggleAvailability(item.id)}
                            disabled={busy}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#4ade80",
                              },

                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                {
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
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="flex-end"
                        >
                          <ActionButton
                            type="edit"
                            onClick={() => handleEdit(item)}
                          />

                          <ActionButton
                            type="delete"
                            onClick={() => handleDelete(item.id)}
                          />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-container": {
            scrollbarWidth: "none",
            msOverflowStyle: "none",

            "&::-webkit-scrollbar": {
              display: "none",
            },
          },
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#161616",
              border: "1px solid #262626",
              borderRadius: "18px",
              backgroundImage: "none",
              overflow: "hidden",
            },
          },
        }}
      >
        <DialogContent
          sx={{
            p: {
              xs: 2.5,
              sm: 4,
            },

            scrollbarWidth: "none",

            msOverflowStyle: "none",

            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 700,
                textAlign: "center",
                flex: 1,
              }}
            >
              {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
            </Typography>

            <IconButton
              onClick={closeDialog}
              size="small"
              sx={{
                color: "#888",
                position: "absolute",
                right: 16,
                top: 16,

                "&:hover": {
                  color: "#fff",
                  backgroundColor: "#ffffff12",
                  borderRadius: "10px",
                },
              }}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Stack spacing={2.5}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 88,
                  height: 88,
                  borderRadius: "12px",
                  border: "1px dashed #3a3a3a",
                  backgroundColor: "#1c1c1c",
                  overflow: "hidden",
                }}
              >
                {imagePreview ? (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : null}
              </Box>
              <TextField
                placeholder="Image URL(s), comma-separated"
                value={form.imageUrls}
                onChange={updateField("imageUrls")}
                fullWidth
                sx={darkFieldSx}
              />
            </Stack>

            <TextField
              placeholder="Name"
              value={form.name}
              onChange={updateField("name")}
              fullWidth
              sx={darkFieldSx}
            />

            <TextField
              placeholder="Description"
              value={form.description}
              onChange={updateField("description")}
              fullWidth
              multiline
              minRows={2}
              sx={darkFieldSx}
            />

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <TextField
                placeholder="Price"
                value={form.price}
                onChange={updateField("price")}
                fullWidth
                type="number"
                sx={darkFieldSx}
              />

              <FormControl fullWidth sx={darkFieldSx}>
                <Select
                  displayEmpty
                  value={form.category}
                  onChange={updateField("category")}
                  disabled={!categories.length}
                  renderValue={(value) =>
                    value || (
                      <span
                        style={{
                          color: "#888",
                        }}
                      >
                        Food Category
                      </span>
                    )
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <FormControl fullWidth sx={darkFieldSx}>
              <Select
                multiple
                displayEmpty
                value={form.ingredients}
                onChange={updateField("ingredients")}
                input={<OutlinedInput />}
                disabled={!availableIngredients.length}
                renderValue={(selected) =>
                  selected.length ? (
                    <Stack direction="row" flexWrap="wrap" gap={0.5}>
                      {selected.map((ingredientId) => {
                        const ingredient = availableIngredients.find(
                          (candidate) =>
                            String(candidate.id) === String(ingredientId),
                        );
                        return (
                          <Chip
                            key={ingredientId}
                            label={ingredient?.name ?? ingredientId}
                            size="small"
                            sx={{
                              backgroundColor: "#2a2a2a",
                              color: "#eee",
                            }}
                          />
                        );
                      })}
                    </Stack>
                  ) : (
                    <span style={{ color: "#888" }}>
                      {availableIngredients.length
                        ? "Select ingredients"
                        : "No backend ingredients available"}
                    </span>
                  )
                }
              >
                {availableIngredients.map((ingredient) => (
                  <MenuItem
                    key={ingredient.id}
                    value={String(ingredient.id)}
                  >
                    {ingredient.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <FormControl fullWidth sx={darkFieldSx}>
                <InputLabel
                  shrink
                  sx={{
                    backgroundColor: "#161616",
                    px: 0.5,
                  }}
                >
                  Is Vegetarian
                </InputLabel>

                <Select
                  value={form.isVegetarian}
                  onChange={updateField("isVegetarian")}
                >
                  <MenuItem value="Yes">Yes</MenuItem>

                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={darkFieldSx}>
                <InputLabel
                  shrink
                  sx={{
                    backgroundColor: "#161616",
                    px: 0.5,
                  }}
                >
                  Is Seasonal
                </InputLabel>

                <Select
                  value={form.isSeasonal}
                  onChange={updateField("isSeasonal")}
                >
                  <MenuItem value="Yes">Yes</MenuItem>

                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Button
              onClick={handleSaveMenuItem}
              disabled={busy || !categories.length}
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

                "&:hover": {
                  backgroundColor: "#d81b5f",
                },
              }}
            >
              {busy
                ? "Saving…"
                : isEditing
                  ? "Save Changes"
                  : "Create Menu Item"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Menu;
