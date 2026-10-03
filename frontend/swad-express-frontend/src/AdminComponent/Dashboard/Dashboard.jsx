import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  Avatar,
  AvatarGroup,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import { getRestaurantOrders } from "../../State/Order/Action";
import { getMenuItemsByRestaurantId } from "../../State/Menu/Action";

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;
const EMPTY_LIST = [];

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <Box
    sx={{
      width: "100%",
      minWidth: 0,
      boxSizing: "border-box",
      p: {
        xs: 1.5,
        sm: 2,
      },
      borderRadius: {
        xs: "14px",
        sm: "16px",
      },
      border: "1px solid #262626",
      background: "linear-gradient(180deg, #1c1c1c 0%, #171717 100%)",
    }}
  >
    <Stack
      direction="row"
      spacing={1.25}
      alignItems="center"
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: {
            xs: 38,
            sm: 40,
          },
          height: {
            xs: 38,
            sm: 40,
          },
          flexShrink: 0,
          borderRadius: "11px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: `${accent}1a`,
        }}
      >
        <Icon
          sx={{
            fontSize: {
              xs: 19,
              sm: 20,
            },
            color: accent,
          }}
        />
      </Box>

      <Box
        sx={{
          minWidth: 0,
          flex: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: 10,
              sm: 12,
            },
            color: "#8a8a8a",
            fontWeight: 500,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: {
              xs: 17,
              sm: 20,
            },
            fontWeight: 700,
            color: "#fff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  </Box>
);

const PanelHeader = ({ title, onEdit }) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    sx={{ px: 2.5, py: 2, borderBottom: "1px solid #262626" }}
  >
    <Typography sx={{ fontSize: 17, fontWeight: 700 }}>{title}</Typography>
    <Tooltip title="Edit">
      <IconButton
        size="small"
        onClick={onEdit}
        sx={{
          color: "#999",
          "&:hover": { color: "#e91e63", backgroundColor: "#e91e6314" },
        }}
      >
        <EditRoundedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Stack>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt =
    useSelector((state) => state.auth?.jwt) || localStorage.getItem("jwt");
  const restaurant = useSelector((state) => state.restaurant?.userRestaurant);
  const storedOrders = useSelector((state) => state.order?.restaurantOrders);
  const storedMenuItems = useSelector((state) => state.menu?.menuItems);
  const restaurantId = restaurant?.id ?? restaurant?.restaurantId;
  const orders = Array.isArray(storedOrders) ? storedOrders : EMPTY_LIST;
  const menuItems = Array.isArray(storedMenuItems)
    ? storedMenuItems
    : EMPTY_LIST;
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      if (!jwt || !restaurantId) {
        setLoading(false);
        setLoadError(
          "Restaurant information is not available. Please reload the page.",
        );
        return;
      }

      setLoading(true);
      setLoadError("");
      const results = await Promise.allSettled([
        dispatch(getRestaurantOrders({ restaurantId, jwt })),
        dispatch(getMenuItemsByRestaurantId({ restaurantId, jwt })),
      ]);
      if (!active) return;

      const failedRequest = results.find(
        (result) => result.status === "rejected",
      );
      if (failedRequest) {
        setLoadError(
          failedRequest.reason?.response?.data?.message ||
            failedRequest.reason?.message ||
            "Unable to load dashboard data. Please try again.",
        );
      }
      setLoading(false);
    };

    loadDashboard();
    return () => {
      active = false;
    };
  }, [dispatch, jwt, restaurantId]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (first, second) =>
            new Date(second.createdAt || 0).getTime() -
            new Date(first.createdAt || 0).getTime(),
        )
        .slice(0, 5)
        .map((order) => {
          const items = Array.isArray(order.items) ? order.items : [];
          const foodItems = items.map((item) => item.food || item);
          return {
            id: order.id ?? order.orderId,
            images: foodItems.flatMap((food) =>
              Array.isArray(food.images)
                ? food.images.slice(0, 1)
                : food.image
                  ? [food.image]
                  : [],
            ),
            customer:
              order.customer?.fullName || order.customer?.email || "Customer",
            price: Number(order.totalPrice ?? order.totalAmount ?? 0),
            name:
              foodItems
                .map((food) => food.name)
                .filter(Boolean)
                .join(", ") || "Order",
          };
        }),
    [orders],
  );

  const recentMenuItems = useMemo(
    () =>
      [...menuItems]
        .sort(
          (first, second) =>
            new Date(second.creationDate || 0).getTime() -
            new Date(first.creationDate || 0).getTime(),
        )
        .slice(0, 5)
        .map((item) => ({
          id: item.id ?? item.foodId,
          image: Array.isArray(item.images) ? item.images[0] : item.image,
          title: item.name || "Menu item",
          price: Number(item.price || 0),
          availability:
            item.available ??
            item.isAvailable ??
            item.availability ??
            item.inStock ??
            item.isInStock ??
            false,
        })),
    [menuItems],
  );

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.totalPrice ?? order.totalAmount ?? 0),
      0,
    );
    const inStock = menuItems.filter((item) =>
      Boolean(
        item.available ??
        item.isAvailable ??
        item.availability ??
        item.inStock ??
        item.isInStock,
      ),
    ).length;
    return {
      totalOrders: orders.length,
      totalRevenue,
      menuItems: menuItems.length,
      inStock,
    };
  }, [menuItems, orders]);

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
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Typography sx={{ fontSize: 13, color: "#8a8a8a", mt: 0.5 }}>
          A quick look at today's activity.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: {
            xs: 1,
            sm: 2,
          },
          mb: {
            xs: 2,
            sm: 3,
          },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <StatCard
          icon={ReceiptLongRoundedIcon}
          label="Total orders"
          value={stats.totalOrders}
          accent="#38bdf8"
        />

        <StatCard
          icon={PaidRoundedIcon}
          label="Revenue"
          value={formatCurrency(stats.totalRevenue)}
          accent="#4ade80"
        />

        <StatCard
          icon={RestaurantMenuRoundedIcon}
          label="Menu items"
          value={stats.menuItems}
          accent="#a78bfa"
        />

        <StatCard
          icon={PeopleAltRoundedIcon}
          label="In stock"
          value={`${stats.inStock}/${stats.menuItems}`}
          accent="#f59e0b"
        />
      </Box>

      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={2.5}
        alignItems="flex-start"
      >
        <Box
          sx={{
            flex: 2,
            width: "100%",
            border: "1px solid #262626",
            borderRadius: "20px",
            backgroundColor: "#181818",
            overflow: "hidden",
          }}
        >
          <PanelHeader
            title="Recent Orders"
            onEdit={() => navigate("/admin/restaurant/orders")}
          />

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
                  <TableCell sx={{ width: "8%" }}>Id</TableCell>
                  <TableCell sx={{ width: "15%" }}>Image</TableCell>
                  <TableCell sx={{ width: "32%" }}>Customer</TableCell>
                  <TableCell sx={{ width: "15%" }}>Price</TableCell>
                  <TableCell sx={{ width: "30%" }}>Name</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress size={22} sx={{ color: "#e91e63" }} />
                    </TableCell>
                  </TableRow>
                ) : recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ color: "#888 !important" }}
                    >
                      No orders yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => (
                    <TableRow
                      key={order.id}
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
                      <TableCell sx={{ color: "#888 !important" }}>
                        {order.id}
                      </TableCell>
                      <TableCell>
                        <AvatarGroup
                          max={3}
                          sx={{
                            justifyContent: "flex-start",
                            "& .MuiAvatar-root": {
                              width: 36,
                              height: 36,
                              fontSize: 11,
                              border: "2px solid #181818",
                              marginLeft: "-8px",
                              "&:first-of-type": { marginLeft: 0 },
                            },
                          }}
                        >
                          {order.images.map((src, i) => (
                            <Avatar
                              key={`${order.id}-${src}-${i}`}
                              src={src}
                              variant="rounded"
                              sx={{ borderRadius: "10px" }}
                            />
                          ))}
                          {!order.images.length && (
                            <Avatar
                              variant="rounded"
                              sx={{ borderRadius: "10px", bgcolor: "#292929" }}
                            >
                              <RestaurantMenuRoundedIcon />
                            </Avatar>
                          )}
                        </AvatarGroup>
                      </TableCell>
                      <TableCell sx={{ color: "#bbb" }}>
                        {order.customer}
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "#fff !important" }}
                      >
                        {formatCurrency(order.price)}
                      </TableCell>
                      <TableCell>{order.name}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box
          sx={{
            flex: 1,
            width: "100%",
            border: "1px solid #262626",
            borderRadius: "20px",
            backgroundColor: "#181818",
            overflow: "hidden",
          }}
        >
          <PanelHeader
            title="Recently Added Menu"
            onEdit={() => navigate("/admin/restaurant/menu")}
          />

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
                  <TableCell sx={{ width: "45%" }}>Item</TableCell>
                  <TableCell sx={{ width: "25%" }}>Price</TableCell>
                  <TableCell sx={{ width: "30%" }}>Availability</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <CircularProgress size={22} sx={{ color: "#e91e63" }} />
                    </TableCell>
                  </TableRow>
                ) : recentMenuItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{ color: "#888 !important" }}
                    >
                      No menu items yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentMenuItems.map((item) => (
                    <TableRow
                      key={item.id}
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
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Avatar
                            src={item.image}
                            alt={item.title}
                            variant="rounded"
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "10px",
                              border: "1px solid #2c2c2c",
                            }}
                          />
                          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                            {item.title}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "#fff !important" }}
                      >
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            item.availability ? "IN STOCK" : "OUT OF STOCK"
                          }
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: "10px",
                            fontWeight: 700,
                            borderRadius: "999px",
                            color: item.availability ? "#4ade80" : "#f87171",
                            backgroundColor: item.availability
                              ? "rgba(74,222,128,0.12)"
                              : "rgba(248,113,113,0.12)",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>
      {loadError && (
        <Typography role="alert" sx={{ mt: 2, color: "#f87171", fontSize: 13 }}>
          {loadError}
        </Typography>
      )}
    </Box>
  );
};

export default Dashboard;
