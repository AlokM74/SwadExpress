import { Box, Button, Divider, Modal, TextField } from "@mui/material";

import CartItem from "./CartItem";
import Address from "../Address/Address";

import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from './../../State/Order/Action';
import { clearCartAction } from "../../State/Cart/Action";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
} from "../../State/Address/Action";
import { useNavigate } from "react-router-dom";
import { api } from "../config/api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%",
    sm: 450,
  },
  bgcolor: "#181818",
  color: "white",
  outline: "none",
  boxShadow: 24,
  borderRadius: "12px",
  p: 3,
};

let razorpayCheckoutPromise;

const loadRazorpayCheckout = () => {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (razorpayCheckoutPromise) {
    return razorpayCheckoutPromise;
  }

  razorpayCheckoutPromise = new Promise((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), {
        once: true,
      });
      existingScript.addEventListener("error", () => resolve(false), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return razorpayCheckoutPromise;
};

const Cart = () => {
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const {cart}=useSelector(store=>store)
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    getAddresses(jwt)
      .then((data) => {
        setAddresses(data);
        setSelectedAddress(
          data.find((address) => address.isDefault) || data[0] || null,
        );
      })
      .catch((error) => console.error("Failed to load addresses:", error));
  }, [jwt]);

  const handleOpenAddressModel = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteAddress = async (address) => {
    try {
      await deleteAddress({ jwt, addressId: address.id });
      const nextAddresses = addresses.filter((item) => item.id !== address.id);
      setAddresses(nextAddresses);
      if (selectedAddress?.id === address.id) {
        setSelectedAddress(nextAddresses[0] || null);
      }
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const createOrderUsingSelectedAddress = async (address) => {
    try {
      await setDefaultAddress({ jwt, addressId: address.id });
      setAddresses((current) =>
        current.map((item) => ({
          ...item,
          isDefault: item.id === address.id,
        })),
      );
      setSelectedAddress({ ...address, isDefault: true });
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  };

  const handleDeliverOrder = async () => {
    if (!selectedAddress) {
      console.error("Cannot create order: delivery address is missing.");
      return;
    }

    if (!selectedAddress.id) {
      console.error("Cannot create order: selected address has no database ID.");
      return;
    }

    if (!(cart.cart?.cartItem || []).length) {
      console.error("Cannot create order: cart is empty.");
      return;
    }

    try {
      const { data: paymentOrder } = await api.post(
        "/api/payment/create-order",
        {},
        { headers: { Authorization: `Bearer ${jwt}` } },
      );

      const razorpayLoaded = await loadRazorpayCheckout();
      if (!razorpayLoaded) {
        throw new Error("Razorpay Checkout could not be loaded");
      }

      const razorpay = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "SwadExpress",
        description: "Food order",
        order_id: paymentOrder.orderId,
        prefill: {
          name: "SwadExpress customer",
        },
        theme: { color: "#7a1f1f" },
        handler: async (payment) => {
          const order = await dispatch(
            createOrder({
              jwt,
              order: {
                deliveryAddress: {
                  id: selectedAddress.id,
                  streetAddress: `${selectedAddress.line1 || selectedAddress.streetAddress || ""}${selectedAddress.line2 ? `, ${selectedAddress.line2}` : ""}`,
                  city: selectedAddress.city,
                  stateProvince: selectedAddress.state || selectedAddress.stateProvince,
                  postalCode: selectedAddress.pincode || selectedAddress.postalCode,
                  country: "India",
                  isDefault: Boolean(selectedAddress.isDefault),
                },
                razorpayOrderId: payment.razorpay_order_id,
                razorpayPaymentId: payment.razorpay_payment_id,
                razorpaySignature: payment.razorpay_signature,
              },
            }),
          );

          if (order) {
            window.setTimeout(() => {
              dispatch(clearCartAction());
              navigate("/my-profile/orders");
            }, 1000);
          } else {
            window.alert("Payment succeeded, but the order could not be created. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            console.info("Razorpay checkout was dismissed");
          },
        },
      });

      razorpay.open();
    } catch (error) {
      console.error("Failed to start payment:", error.response?.data || error);
      window.alert(error.response?.data || error.message || "Unable to start payment");
    }
  };

  const initialValues = {
    streetAddress: "",
    city: "",
    state: "",
    pincode: "",
  };

  const validationSchema = yup.object().shape({
    streetAddress: yup.string().required("Street address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    pincode: yup
      .string()
      .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits")
      .required("Pincode is required"),
  });

  const handleSaveAddress = async (values, { resetForm }) => {
    try {
      await createAddress({
        jwt,
        address: {
          streetAddress: values.streetAddress.trim(),
          city: values.city.trim(),
          stateProvince: values.state.trim(),
          postalCode: values.pincode.trim(),
          country: "India",
          isDefault: addresses.length === 0,
        },
      });
      const nextAddresses = await getAddresses(jwt);
      setAddresses(nextAddresses);
      setSelectedAddress(
        nextAddresses.find((address) => address.isDefault) ||
          nextAddresses[nextAddresses.length - 1] ||
          null,
      );
      resetForm();
      handleClose();
    } catch (error) {
      console.error("Failed to save address:", error);
    }
  };




  return (
    <div className="min-h-screen">
      <main className="lg:flex justify-between">
        <section className="w-full lg:w-[30%] space-y-6 lg:min-h-screen pt-10!">
          {(cart.cart?.cartItem || []).length > 0 ? (
            cart.cart.cartItem.map((item) => (
              <CartItem key={item.id} item={item} />
            ))
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4 px-5 text-center">
              <p className="text-lg font-semibold text-gray-300">
                Your cart is empty
              </p>
              <Button
                variant="contained"
                color="error"
                onClick={() => navigate("/")}
              >
                Add items to cart
              </Button>
            </div>
          )}

          
        </section>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderColor: "#333",
          }}
        />

        <section className="w-full lg:w-[70%]">
          <div className="p-5! lg:p-10!">
            <h1 className="text-center font-semibold text-xl lg:text-2xl py-10!">
              Choose Delivery Address
            </h1>


            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {addresses.map((address) => (
                <Address
                  key={address.id}
                  address={address}
                  onSelect={createOrderUsingSelectedAddress}
                  onDelete={handleDeleteAddress}
                  selected={selectedAddress?.id === address.id}
                />
              ))}

              <Address isAddNew onAdd={handleOpenAddressModel} />
            </div>

            <div className="flex justify-center mt-8!">
              <Button
                variant="contained"
                color="error"
                onClick={handleDeliverOrder}
                disabled={!selectedAddress || !(cart.cart?.cartItem || []).length}
                sx={{
                  minWidth: 220,
                  py: 1.25,
                  fontWeight: 700,
                  borderRadius: 2,
                }}
              >
                Place Order
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-address-modal"
      >
        <Box sx={style}>
          <h2 className="text-xl font-semibold mb-5!">Add New Address</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSaveAddress}
          >
            {({
              handleSubmit,
              errors,
              touched,
              handleChange,
              handleBlur,
              values,
            }) => (
              <form onSubmit={handleSubmit}>
                {[
                  ["streetAddress", "Street Address"],
                  ["city", "City"],
                  ["state", "State"],
                  ["pincode", "Pincode"],
                ].map(([name, label]) => (
                  <TextField
                    key={name}
                    fullWidth
                    label={label}
                    name={name}
                    value={values[name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched[name] && Boolean(errors[name])}
                    helperText={touched[name] && errors[name]}
                    margin="normal"
                    sx={{
                      input: { color: "white" },
                      label: { color: "#aaa" },
                    }}
                  />
                ))}
                <div className="flex justify-end gap-3 mt-5!">
                  <Button variant="outlined" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="error">
                    Save Address
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default Cart;
