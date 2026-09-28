import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsersOrder } from "../../State/Order/Action";
import {
  Box,
  Typography,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Dialog,
  DialogContent,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { safeImageUrl } from "../config/media";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import OrderCard from './OrderCard';

const ACCENT = "#7a1f1f";
const BG = "#0e0e0e";
const BORDER = "#2a2a2a";
const CARD = "#161616";

const TABS = [
  "All",
  "Ready for delivery",
  "Out for delivery",
  "Delivered",
  "Preparing",
  "Cancelled",
];

const formatAddress = (address) => {
  if (!address) return "Delivery address unavailable";

  return [
    address.streetAddress,
    address.city,
    address.stateProvince,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
};

const Orders = () => {
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dispatch = useDispatch();
  const {
    orders: apiOrders = [],
    isLoading,
    error,
  } = useSelector((store) => store.order);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      dispatch(getUsersOrder(jwt));
    }
  }, [dispatch, jwt]);

  const orders = apiOrders.map((order) => {
    const items = (order.items || []).map((item) => ({
      name: item.food?.name || "Menu item",
      qty: item.quantity || 0,
      image: safeImageUrl(item.food?.images?.[0]) || "",
      total: item.totalPrice || 0,
    }));
    const totalItem =
      order.totalItem ?? items.reduce((count, item) => count + item.qty, 0);
    const statusMap = {
      PENDING: "Preparing",
      COMPLETED: "Ready for delivery",
      OUT_FOR_DELIVERY: "Out for delivery",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
    };

    return {
      id: `ORD-${order.id}`,
      restaurant: order.restaurant?.name || "Restaurant order",
      date: order.createdAt
        ? new Date(order.createdAt).toLocaleString()
        : "Date unavailable",
      status: statusMap[order.orderStatus] || "Preparing",
      paymentStatus: order.paymentStatus,
      transactionId: order.transactionId,
      items,
      itemCount: totalItem,
      totalItem,
      total: `₹${order.totalPrice ?? order.totalAmount ?? 0}`,
      subtotal: order.totalAmount ?? 0,
      deliveryFee: 20,
      restaurantCharges: 12,
      deliveryAddress: formatAddress(order.deliveryAddress),
    };
  });

  const filtered = orders.filter((order) => {
    const matchesTab = tab === "All" || order.status === tab;
    const matchesQuery =
      query.trim() === "" ||
      order.restaurant.toLowerCase().includes(query.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      );
    return matchesTab && matchesQuery;
  });

  return (
    <Box
      className="profile-scrollbar-hidden"
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
      <Typography
        sx={{
          fontSize: { xs: 20, sm: 26 },
          fontWeight: 600,
          mb: { xs: 2, sm: 3 },
        }}
      >
        <div  className="flex gap-2 items-center">
          <ShoppingBagOutlinedIcon sx={{color:"#AB47BC"}}/>
          <span>Orders</span>
        </div>
      </Typography>

      <TextField
        placeholder="Search by restaurant or dish"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ color: "#6b7280", fontSize: 20 }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          mb: { xs: 2, sm: 3 },
          "& .MuiOutlinedInput-root": {
            bgcolor: CARD,
            color: "#e5e5e5",
            borderRadius: 2,
            "& fieldset": { borderColor: BORDER },
            "&:hover fieldset": { borderColor: "#3d3d3d" },
            "&.Mui-focused fieldset": { borderColor: ACCENT },
          },
        }}
      />

      <Tabs
        value={tab}
        onChange={(_, val) => setTab(val)}
        variant="scrollable"
        scrollButtons={false}
        sx={{
          mb: { xs: 2.5, sm: 3.5 },
          minHeight: 36,
          borderBottom: `1px solid ${BORDER}`,
          "& .MuiTabs-indicator": { bgcolor: ACCENT, height: 2 },
        }}
      >
        {TABS.map((t) => (
          <Tab
            key={t}
            value={t}
            label={t}
            sx={{
              textTransform: "none",
              fontSize: { xs: 13, sm: 14 },
              minHeight: 36,
              color: "#9ca3af",
              "&.Mui-selected": { color: "#fff" },
            }}
          />
        ))}
      </Tabs>

      {isLoading ? (
        <Typography sx={{ color: "#9ca3af", textAlign: "center", py: 6 }}>
          Loading orders...
        </Typography>
      ) : error ? null : filtered.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={setSelectedOrder}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            border: `1px dashed ${BORDER}`,
            borderRadius: 3,
            py: { xs: 5, sm: 7 },
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: { xs: 14, sm: 15 }, color: "#9ca3af" }}>
            No orders found
          </Typography>
          <Typography
            sx={{ fontSize: { xs: 12, sm: 13 }, color: "#6b7280", mt: 0.5 }}
          >
            Try a different search term or filter
          </Typography>
          {query && (
            <Button
              onClick={() => setQuery("")}
              sx={{
                mt: 2,
                textTransform: "none",
                color: "#fff",
                bgcolor: ACCENT,
                px: 2.5,
                py: 0.75,
                borderRadius: 2,
                "&:hover": { bgcolor: "#5f1818" },
              }}
            >
              Clear search
            </Button>
          )}
        </Box>
      )}

      <Dialog
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent sx={{ bgcolor: "#111", color: "#fff", p: 3 }}>
          {selectedOrder && (
            <>
              <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 2 }}>
                {selectedOrder.restaurant}
              </Typography>
              {selectedOrder.items.map((item) => (
                <Box
                  key={`${selectedOrder.id}-${item.name}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  {item.image && (
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 2,
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700 }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ color: "#aaa" }}>
                      Quantity: {item.qty}
                    </Typography>
                  </Box>
                  <Typography>₹{item.total}</Typography>
                </Box>
              ))}
              <Box sx={{ borderTop: "1px solid #333", pt: 2 }}>
                <Typography sx={{ fontWeight: 700, mb: 1.5 }}>
                  Bill Details
                </Typography>
                {[
                  ["Item Total", selectedOrder.subtotal],
                  ["Delivery Fee", selectedOrder.deliveryFee],
                  ["GST & Restaurant Charges", selectedOrder.restaurantCharges],
                ].map(([label, amount]) => (
                  <Box
                    key={label}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#bbb",
                      mb: 1,
                    }}
                  >
                    <span>{label}</span>
                    <span>₹{amount}</span>
                  </Box>
                ))}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    borderTop: "1px solid #333",
                    pt: 1.5,
                  }}
                >
                  <span>Total Pay</span>
                  <span>{selectedOrder.total}</span>
                </Box>
              </Box>
              <Box
                sx={{
                  bgcolor: "#1b1b1b",
                  border: "1px solid #333",
                  borderRadius: 2,
                  p: 1.5,
                  mt: 2.5,
                }}
              >
                <Typography sx={{ color: "#aaa", fontSize: 12, mb: 0.5 }}>
                  Delivery address
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  {selectedOrder.deliveryAddress}
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "#1b1b1b",
                  border: "1px solid #333",
                  borderRadius: 2,
                  p: 1.5,
                  mt: 2,
                }}
              >
                <Typography sx={{ color: "#aaa", fontSize: 12, mb: 0.75 }}>
                  Payment
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 0.75,
                  }}
                >
                  <Typography sx={{ fontSize: 14 }}>Status</Typography>
                  <Chip
                    label={
                      selectedOrder.paymentStatus === "PAID"
                        ? "Paid"
                        : "Not paid"
                    }
                    size="small"
                    sx={{
                      height: 22,
                      color:
                        selectedOrder.paymentStatus === "PAID"
                          ? "#4ade80"
                          : "#f87171",
                      bgcolor:
                        selectedOrder.paymentStatus === "PAID"
                          ? "rgba(74, 222, 128, 0.1)"
                          : "rgba(248, 113, 113, 0.1)",
                      border: `1px solid ${
                        selectedOrder.paymentStatus === "PAID"
                          ? "#4ade80"
                          : "#f87171"
                      }66`,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography sx={{ color: "#aaa", fontSize: 13 }}>
                    Transaction ID
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: selectedOrder.transactionId ? "#e5e5e5" : "#777",
                      overflowWrap: "anywhere",
                      textAlign: "right",
                    }}
                  >
                    {selectedOrder.transactionId || "Not available"}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Orders;
