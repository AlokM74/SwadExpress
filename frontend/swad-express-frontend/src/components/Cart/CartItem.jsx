import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import { Chip, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { removeCartItem, updateCartItem } from "../../State/Cart/Action";
import { safeImageUrl } from "../config/media";


const CartItem = ({ item }) => {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  

  const handleRemoveCartItem = () => {
    dispatch(removeCartItem({ cartItemId: item.id, jwt: auth.jwt || jwt }));
  };

  const handleUpdateCartItem = (value) => {
    if (value === -1 && item.quantity <= 1) {
      handleRemoveCartItem();
      return;
    }

    const data = {
      cartItemId: item.id,
      quantity: item.quantity + value,
    };
    dispatch(updateCartItem({ data, jwt }));
  };

  return (
    <div className="w-full p-5! lg:p-3! border-b border-gray-700">
      <div className="flex gap-3 sm:gap-5">
        <div className="shrink-0">
          <img
            className="
              w-20 h-20
              sm:w-24 sm:h-24
              object-cover
              rounded-lg
            "
            src={safeImageUrl(item.food?.images?.[0])}
            alt={item.food?.name || "Cart item"}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="lg:text-xl text-lg font-semibold text-white">
                {item.food.name}
              </p>
            </div>

            <p className="text-base font-semibold text-white">
              ₹{item.totalPrice}
            </p>
          </div>

          <div className="flex items-center mt-3! lg:mt-2!">
            <IconButton
            onClick={()=>handleUpdateCartItem(-1)}
              size="small"
              sx={{
                color: "red",
                padding: "4px",
              }}
            >
              <RemoveCircleOutlineOutlinedIcon fontSize="small" />
            </IconButton>

            <div className="w-7 h-7 flex items-center justify-center text-white font-semibold">
              {item.quantity}
            </div>

            <IconButton
              onClick={()=>handleUpdateCartItem(1)}
              size="small"
              sx={{
                color: "red",
                padding: "4px",
              }}
            >
              <AddCircleOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3! mb-2!">
        {(item.ingredients || []).map((ingredient) => (
          <Chip
            key={ingredient}
            label={ingredient}
            size="small"
            sx={{
              color: "#ddd",
              backgroundColor: "#292929",
            }}
          />
        ))}
      </div>
      <Divider />

      <div className="billDetails px-5! text-sm ">
        <p className="font-semibold py-5!">Bill Details</p>

        <div className="space-y-3 flex flex-col gap-2">
          <div className="flex justify-between text-gray-400">
            <p>Item Total</p>
            <p>₹{item.totalPrice}</p>
          </div>

          <div className="flex justify-between text-gray-400">
            <p>Delivery Fee</p>
            <p>₹20</p>
          </div>

          <div className="flex justify-between text-gray-400">
            <p>GST & Restaurant Charges</p>
            <p>₹12</p>
          </div>

          <Divider />

          <div className="flex justify-between text-white font-semibold">
            <p>Total Pay</p>
            <p>₹{item.totalPrice + 20 + 12}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
