import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Avatar,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import {
  getRestaurantOrders,
  updateRestaurantOrder,
} from "../../State/Order/Action";
import AdminEmptyState from "../AdminEmptyState";

const EMPTY_ORDERS = [];

const normalizeStatus = (status) => {
  const normalized = String(status || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  return normalized || "PENDING";
};

const displayStatus = (status) => normalizeStatus(status).replace(/_/g, " ");

const getItemFood = (item) => item?.food || item?.menuItem || item?.product || item;

const normalizeOrder = (order = {}) => {
  const items = Array.isArray(order.items) ? order.items : [];
  const firstFood = getItemFood(items[0]);
  const customer = order.customer;
  const price = order.totalPrice ?? order.totalAmount ?? order.total ?? 0;
  const numericPrice = Number(price);
  const formattedPrice = Number.isFinite(numericPrice)
    ? `₹${numericPrice.toLocaleString("en-IN")}`
    : String(price || "0");
  const ingredients = items.flatMap((item) => {
    const food = getItemFood(item);
    const itemIngredients = food?.ingredients;
    return Array.isArray(itemIngredients)
      ? itemIngredients.map((ingredient) =>
          typeof ingredient === "string"
            ? ingredient
            : ingredient?.name || ingredient?.ingredientName
        ).filter(Boolean)
      : [];
  });

  return {
    id: order.id ?? order.orderId ?? "",
    image:
      firstFood?.images?.[0] ||
      firstFood?.image ||
      items[0]?.image ||
      "",
    customer:
      (typeof customer === "string" && customer) ||
      customer?.email ||
      customer?.fullName ||
      customer?.name ||
      order.customerEmail ||
      "Customer",
    price: formattedPrice,
    name:
      items
        .map((item) => getItemFood(item)?.name || item?.name)
        .filter(Boolean)
        .join(", ") ||
      order.name ||
      "Order",
    ingredients: [...new Set(ingredients)],
    status: normalizeStatus(order.orderStatus ?? order.status),
  };
};

const statusColor = {
  PENDING: "#29b6f6",
  COMPLETED: "#9c5cff",
  OUT_FOR_DELIVERY: "#ff9f43",
  DELIVERED: "#4ade80",
};

const statusIcon = {
  PENDING: <AccessTimeRoundedIcon sx={{ fontSize: 18 }} />,
  COMPLETED: <CheckCircleOutlineRoundedIcon sx={{ fontSize: 18 }} />,
  OUT_FOR_DELIVERY: <LocalShippingRoundedIcon sx={{ fontSize: 18 }} />,
  DELIVERED: <DoneRoundedIcon sx={{ fontSize: 18 }} />,
};

const statusOptions = [
  {
    label: "Pending",
    value: "PENDING",
    color: "#29b6f6",
  },
  {
    label: "Completed",
    value: "COMPLETED",
    color: "#9c5cff",
  },
  {
    label: "Out for delivery",
    value: "OUT_FOR_DELIVERY",
    color: "#ff9f43",
  },
  {
    label: "Delivered",
    value: "DELIVERED",
    color: "#4ade80",
  },
];

const nextStatus = {
  PENDING: "COMPLETED",
  COMPLETED: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
};

const StatCard = ({ title, value, color }) => {
  return (
    <Box
      sx={{
        minWidth: 0,
        background:
          "linear-gradient(145deg, #1b1b1b 0%, #151515 100%)",
        border: "1px solid #292929",
        borderRadius: "14px",
        px: 2,
        py: 1.7,
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: 10,
          color: "#777",
          mb: 0.5,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 700,
          color: color || "#fff",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

const MobileOrderCard = ({ order, onOpenMenu }) => {
  const currentStatusColor = statusColor[order.status] || "#999";

  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        borderRadius: "14px",
        border: "1px solid #292929",
        backgroundColor: "#171717",
        p: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.1,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.2}
        sx={{
          width: "100%",
          minWidth: 0,
        }}
      >
        <Avatar
          src={order.image}
          alt={order.name}
          sx={{
            width: 46,
            height: 46,
            borderRadius: "10px",
            backgroundColor: "#292929",
            flexShrink: 0,
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
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {order.name}
          </Typography>

          <Typography
            sx={{
              fontSize: 9,
              color: "#666",
              mt: 0.3,
            }}
          >
            #{String(order.id).padStart(4, "0")}
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={(event) => onOpenMenu(event, order)}
          disabled={order.status === "DELIVERED"}
          sx={{
            color: "#999",
            flexShrink: 0,
            "&.Mui-disabled": {
              color: "#555",
            },
            "&:hover": {
              color: "#fff",
              backgroundColor: "#292929",
            },
          }}
        >
          <MoreVertRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        sx={{
          width: "100%",
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            color: "#999",
            minWidth: 0,
            flex: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {order.customer}
        </Typography>

        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {order.price}
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          flexWrap: "wrap",
        }}
      >
        {order.ingredients.map((ingredient, index) => (
          <Chip
            key={`${ingredient}-${index}`}
            label={ingredient}
            size="small"
            sx={{
              height: 22,
              backgroundColor: "#292929",
              color: "#cfcfcf",
              border: "1px solid #353535",
              fontSize: 9,
              borderRadius: "7px",
            }}
          />
        ))}
      </Box>

      <Box>
        <Chip
          icon={statusIcon[order.status]}
          label={displayStatus(order.status)}
          size="small"
          sx={{
            height: 27,
            backgroundColor: `${currentStatusColor}18`,
            color: currentStatusColor,
            border: `1px solid ${currentStatusColor}55`,
            fontSize: 9,
            fontWeight: 700,
            borderRadius: "999px",
            whiteSpace: "nowrap",
            "& .MuiChip-icon": {
              color: currentStatusColor,
            },
          }}
        />
      </Box>
    </Box>
  );
};

const Orders = () => {
  const dispatch = useDispatch();
  const { auth, restaurant, order: orderState } = useSelector((state) => state);
  const jwt = auth?.jwt;
  const restaurantId =
    restaurant?.userRestaurant?.id ?? restaurant?.userRestaurant?._id;
  const restaurantOrders = Array.isArray(orderState?.restaurantOrders)
    ? orderState.restaurantOrders
    : EMPTY_ORDERS;
  const orderList = useMemo(
    () => restaurantOrders.map(normalizeOrder),
    [restaurantOrders]
  );
  const isLoading = Boolean(orderState?.isLoading);
  const loadError = orderState?.error;
  const loadErrorMessage =
    loadError?.message || loadError?.error || loadError || "";
  const [filter, setFilter] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (restaurantId && jwt) {
      dispatch(getRestaurantOrders({ restaurantId, jwt }));
    }
  }, [dispatch, restaurantId, jwt]);

  const filteredOrders = useMemo(() => {
    if (filter === "all") {
      return orderList;
    }

    return orderList.filter((order) => order.status === filter);
  }, [filter, orderList]);

  const counts = useMemo(
    () => ({
      total: orderList.length,
      pending: orderList.filter(
        (order) => order.status === "PENDING"
      ).length,
      completed: orderList.filter(
        (order) => order.status === "COMPLETED"
      ).length,
      delivered: orderList.filter(
        (order) => order.status === "DELIVERED"
      ).length,
    }),
    [orderList]
  );

  const openStatusMenu = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const closeStatusMenu = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const updateStatus = async (newStatus) => {
    if (!selectedOrder) {
      return;
    }

    try {
      const result = await dispatch(
        updateRestaurantOrder({
          orderId: selectedOrder.id,
          orderStatus: newStatus,
          jwt,
        })
      );
      if (result?.error) {
        throw new Error(result.error.message || "Unable to update order status.");
      }
      closeStatusMenu();
    } catch (error) {
      console.error("Unable to update order status:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#fff",
        px: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },
        py: {
          xs: 2,
          sm: 3,
        },
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          mb: 2.5,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: 21,
              sm: 24,
            },
            fontWeight: 700,
            color: "#fff",
          }}
        >
          Orders
        </Typography>

        <Typography
          sx={{
            fontSize: 12,
            color: "#777",
            mt: 0.4,
          }}
        >
          Track and update every order in one place.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "inline-flex",
          maxWidth: "100%",
          backgroundColor: "#1a1a1a",
          border: "1px solid #292929",
          borderRadius: "999px",
          p: 0.4,
          mb: 2.5,
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {[
          ["all", "All"],
          ["PENDING", "Pending"],
          ["COMPLETED", "Completed"],
          ["OUT_FOR_DELIVERY", "Out for Delivery"],
          ["DELIVERED", "Delivered"],
        ].map(([value, label]) => (
          <Button
            key={value}
            onClick={() => setFilter(value)}
            sx={{
              minWidth: {
                xs: value === "OUT_FOR_DELIVERY" ? 100 : 68,
                sm: 90,
              },
              minHeight: 34,
              px: 1.5,
              borderRadius: "999px",
              color: filter === value ? "#fff" : "#aaa",
              backgroundColor:
                filter === value ? "#e91e63" : "transparent",
              fontSize: {
                xs: 10,
                sm: 11,
              },
              textTransform: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              "&:hover": {
                backgroundColor:
                  filter === value ? "#e91e63" : "#252525",
              },
            }}
          >
            {label}
          </Button>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(4, minmax(0, 1fr))",
          },
          gap: {
            xs: 1.2,
            sm: 1.5,
          },
          mb: 2.5,
        }}
      >
        <StatCard
          title="Total orders"
          value={counts.total}
        />

        <StatCard
          title="Pending"
          value={counts.pending}
          color="#29b6f6"
        />

        <StatCard
          title="Completed"
          value={counts.completed}
          color="#9c5cff"
        />

        <StatCard
          title="Delivered"
          value={counts.delivered}
          color="#4ade80"
        />
      </Box>

      {isLoading && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1.2}
          sx={{ py: 5, color: "#aaa" }}
        >
          <CircularProgress size={20} sx={{ color: "#e91e63" }} />
          <Typography sx={{ fontSize: 13 }}>Loading orders...</Typography>
        </Stack>
      )}

      <Box
        sx={{
          display: {
            xs: "flex",
            sm: "none",
          },
          flexDirection: "column",
          gap: 1.2,
          width: "100%",
        }}
      >
        {filteredOrders.map((order) => (
          <MobileOrderCard
            key={order.id}
            order={order}
            onOpenMenu={openStatusMenu}
          />
        ))}

        {!isLoading && !loadErrorMessage && filteredOrders.length === 0 && (
          <AdminEmptyState message="No orders found." />
        )}
      </Box>

      <Box
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
          width: "100%",
          border: "1px solid #292929",
          borderRadius: "16px",
          backgroundColor: "#171717",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "1px solid #292929",
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            All Orders
          </Typography>
        </Box>

        <TableContainer
          sx={{
            width: "100%",
            overflowX: "auto",
            "&::-webkit-scrollbar": {
              height: 5,
            },
            "&::-webkit-scrollbar-track": {
              background: "#171717",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#3a3a3a",
              borderRadius: 10,
            },
          }}
        >
          <Table
            sx={{
              minWidth: 850,
              tableLayout: "auto",
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#151515",
                  "& th": {
                    color: "#777",
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #292929",
                    py: 1.5,
                  },
                }}
              >
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Ingredients</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredOrders.map((order) => {
                const currentStatusColor =
                  statusColor[order.status] || "#999";

                return (
                  <TableRow
                    key={order.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#1d1d1d",
                      },
                      "& td": {
                        borderBottom: "1px solid #292929",
                        color: "#eee",
                        py: 1.5,
                        fontSize: 12,
                      },
                      "&:last-child td": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.2,
                          minWidth: 150,
                        }}
                      >
                        <Avatar
                          src={order.image}
                          alt={order.name}
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: "10px",
                            backgroundColor: "#292929",
                          }}
                        />

                        <Box
                          sx={{
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#fff",
                              lineHeight: 1.25,
                              maxWidth: 120,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {order.name}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: 9,
                              color: "#666",
                              mt: 0.3,
                            }}
                          >
                            #{String(order.id).padStart(4, "0")}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 11,
                          color: "#ddd",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order.customer}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#fff",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order.price}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          flexWrap: "wrap",
                          maxWidth: 300,
                        }}
                      >
                        {order.ingredients.map(
                          (ingredient, index) => (
                            <Chip
                              key={`${ingredient}-${index}`}
                              label={ingredient}
                              size="small"
                              sx={{
                                height: 23,
                                backgroundColor: "#292929",
                                color: "#cfcfcf",
                                border: "1px solid #353535",
                                fontSize: 9,
                                borderRadius: "7px",
                              }}
                            />
                          )
                        )}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        icon={statusIcon[order.status]}
                        label={displayStatus(order.status)}
                        size="small"
                        sx={{
                          height: 27,
                          backgroundColor: `${currentStatusColor}18`,
                          color: currentStatusColor,
                          border: `1px solid ${currentStatusColor}55`,
                          fontSize: 9,
                          fontWeight: 700,
                          borderRadius: "999px",
                          whiteSpace: "nowrap",
                          "& .MuiChip-icon": {
                            color: currentStatusColor,
                          },
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(event) =>
                          openStatusMenu(event, order)
                        }
                        disabled={order.status === "DELIVERED"}
                        sx={{
                          color: "#999",
                          "&.Mui-disabled": {
                            color: "#555",
                          },
                          "&:hover": {
                            color: "#fff",
                            backgroundColor: "#292929",
                          },
                        }}
                      >
                        <MoreVertRoundedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {!isLoading && !loadErrorMessage && filteredOrders.length === 0 && (
          <AdminEmptyState message="No orders found." />
        )}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeStatusMenu}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 220,
              backgroundColor: "#303030",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
              overflow: "hidden",
            },
          },
        }}
      >
        <Box
          sx={{
            px: 1.8,
            py: 1.2,
          }}
        >
          <Typography
            sx={{
              color: "#888",
              fontSize: 10,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Update status
          </Typography>
        </Box>

        <Divider
          sx={{
            borderColor: "#444",
          }}
        />

        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => updateStatus(option.value)}
            selected={selectedOrder?.status === option.value}
            disabled={
              !selectedOrder ||
              nextStatus[selectedOrder.status] !== option.value
            }
            sx={{
              minHeight: 48,
              gap: 1.5,
              color: "#eee",
              fontSize: 13,
              "&:hover": {
                backgroundColor: "#3b3b3b",
              },
              "&.Mui-selected": {
                backgroundColor: "#3b3b3b",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#404040",
              },
              "&.Mui-disabled": {
                opacity: 0.45,
                color: "#888",
              },
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: option.color,
                flexShrink: 0,
              }}
            >
              {statusIcon[option.value]}
            </Box>

            <Typography
              sx={{
                fontSize: 13,
                color: "#eee",
                flex: 1,
              }}
            >
              {option.label}
            </Typography>

            {selectedOrder?.status === option.value && (
              <Typography
                sx={{
                  fontSize: 10,
                  color: "#777",
                }}
              >
                current
              </Typography>
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default Orders;