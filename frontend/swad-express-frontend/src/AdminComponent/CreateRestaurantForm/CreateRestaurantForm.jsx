import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Stack,
  Paper,
  InputAdornment,
} from "@mui/material";

import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import { uploadImageToCloudinary } from "../Util/UploadToCloudinary";
import { createRestaurant } from "../../State/Restaurant/Action";
import { useNavigate } from "react-router-dom";
import { notify } from "../../components/config/notifications";

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "#ddd",
    backgroundColor: "#0d0d0d",
    borderRadius: "4px",

    "& fieldset": {
      borderColor: "#303030",
    },

    "&:hover fieldset": {
      borderColor: "#555",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#e91e63",
    },
  },

  "& .MuiInputBase-input": {
    fontSize: 14,
    padding: "12px 11px",
  },

  "& .MuiInputBase-input::placeholder": {
    color: "#8b8b8b",
    opacity: 1,
  },

  "& .MuiInputLabel-root": {
    color: "#777",
    fontSize: 13,
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#e91e63",
  },

  "& .MuiFormHelperText-root": {
    color: "#f44336",
    marginLeft: 0,
    fontSize: 11,
  },
};

const initialValues = {
  name: "",
  description: "",
  cuisineType: "",
  openingHours: "Mon-Sun: 9:00 AM - 9:00 PM",
  streetAddress: "",
  city: "",
  stateProvince: "",
  postalCode: "",
  country: "",
  email: "",
  mobile: "",
  twitter: "",
  instagram: "",
  images: [],
};

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Restaurant name is required"),

  description: Yup.string()
    .trim()
    .required("Restaurant description is required"),

  cuisineType: Yup.string().trim().required("Cuisine type is required"),

  openingHours: Yup.string().trim().required("Opening hours are required"),

  streetAddress: Yup.string().trim().required("Street address is required"),

  city: Yup.string().trim().required("City is required"),

  stateProvince: Yup.string().trim().required("State is required"),

  postalCode: Yup.string().trim().required("Postal code is required"),

  country: Yup.string().trim().required("Country is required"),

  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),

  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),

  twitter: Yup.string().trim(),

  instagram: Yup.string().trim(),

  images: Yup.array()
    .length(2, "Please upload exactly two restaurant images")
    .required("Please upload exactly two restaurant images"),
});

const CreateRestaurantForm = ({ onRestaurantCreated }) => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const imageInputRef = useRef(null);
  const lastInvalidSubmit = useRef(0);
  const [uploadImage, setUploadImage] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,

    onSubmit: async (values) => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        notify("Please sign in again before creating a restaurant.", "error");
        return;
      }

      const restaurantData = {
        name: values.name,
        description: values.description,
        cuisineType: values.cuisineType,

        address: {
          streetAddress: values.streetAddress,
          city: values.city,
          stateProvince: values.stateProvince,
          postalCode: values.postalCode,
          country: values.country,
        },

        contactInformation: {
          email: values.email,
          mobile: values.mobile,
          twitter: values.twitter,
          instagram: values.instagram,
        },

        openingHours: values.openingHours,

        images: values.images.map((image) => image.url),
      };

      try {
        await dispatch(createRestaurant({ data: restaurantData, jwt }));
        notify("Restaurant created successfully.", "success");
        onRestaurantCreated?.();
        navigate("/admin/restaurant/")
      } catch (error) {
        notify(
          error.response?.data?.message ||
            "Unable to create the restaurant. Please try again.",
          "error",
        );
      }
    },
  });

  useEffect(() => {
    if (
      formik.submitCount > lastInvalidSubmit.current &&
      !formik.isValid
    ) {
      lastInvalidSubmit.current = formik.submitCount;
      notify("Please complete all required fields and upload exactly two images.", "warning");
    }
  }, [formik.isValid, formik.submitCount]);

  const handleImageChange = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    if (!selectedFiles.length) return;

    const remainingSlots = 2 - formik.values.images.length;
    if (selectedFiles.length > remainingSlots) {
      formik.setFieldTouched("images", true, false);
      formik.setFieldError("images", "Please upload exactly two images.");
      notify("Please upload exactly two images.", "error");
      return;
    }

    setUploadImage(true);
    formik.setFieldError("images", undefined);
    const results = await Promise.allSettled(
      selectedFiles.map((file) => uploadImageToCloudinary(file)),
    );
    const uploadedImages = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => ({ url: result.value }));
    const failedUploads = results.filter(
      (result) => result.status === "rejected",
    );

    if (uploadedImages.length) {
      await formik.setFieldValue("images", [
        ...formik.values.images,
        ...uploadedImages,
      ]);
    }
    if (failedUploads.length) {
      notify(
        failedUploads[0].reason instanceof Error
          ? failedUploads[0].reason.message
          : "Image upload failed. Please try again.",
        "error",
      );
      formik.setFieldTouched("images", true, false);
      formik.setFieldError(
        "images",
        failedUploads[0].reason instanceof Error
          ? failedUploads[0].reason.message
          : "Image upload failed. Please try again.",
      );
    }
    setUploadImage(false);
  };

  const removeImage = (index) => {
    const updatedImage = [...formik.values.images];
    updatedImage.splice(index, 1);
    formik.setFieldValue("images", updatedImage);
    formik.setFieldError("images", "Please upload exactly two images.");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0d0d0d",
        color: "#fff",
        py: 5,
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          maxWidth: 760,
          mx: "auto",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            fontWeight: 700,
            mb: 3,
            color: "#fff",
          }}
        >
          Add New Restaurant
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <Stack spacing={2.2}>
            <Paper
              elevation={0}
              onClick={() => {
                if (!uploadImage && formik.values.images.length < 2) {
                  imageInputRef.current?.click();
                }
              }}
              sx={{
                width: 78,
                height: 78,
                border: "1px solid #353535",
                borderRadius: "5px",
                backgroundColor: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
                position: "relative",
                "&:hover": {
                  borderColor: "#e91e63",
                },
                opacity: uploadImage ? 0.6 : 1,
              }}
            >
              {formik.values.images.length > 0 ? (
                <Box
                  component="img"
                  src={formik.values.images[0].url}
                  alt="Restaurant"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <AddPhotoAlternateRoundedIcon
                  sx={{
                    color: "#fff",
                    fontSize: 25,
                  }}
                />
              )}
            </Paper>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              disabled={uploadImage || formik.values.images.length >= 2}
              onChange={handleImageChange}
            />

            <Typography sx={{ color: "#aaa", fontSize: 13 }}>
              Please upload two images ({formik.values.images.length}/2 uploaded).
              {uploadImage ? " Uploading..." : ""}
            </Typography>

            {formik.values.images.length > 0 && (
              <Box>
                <Typography
                  sx={{
                    color: "#aaa",
                    fontSize: 13,
                    mb: 1,
                  }}
                >
                  Restaurant Images
                </Typography>

                <Grid container spacing={1}>
                  {formik.values.images.map((image, index) => (
                    <Grid
                      item
                      xs={4}
                      sm={3}
                      md={2}
                      key={`${image.url}-${index}`}
                    >
                      <Box
                        sx={{
                          height: 85,
                          borderRadius: "5px",
                          overflow: "hidden",
                          border: "1px solid #333",
                          position: "relative",
                          backgroundColor: "#111",
                        }}
                      >
                        <Box
                          component="img"
                          src={image.url}
                          alt={`Restaurant ${index + 1}`}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />

                        <IconButton
                          type="button"
                          size="small"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeImage(index);
                          }}
                          sx={{
                            position: "absolute",
                            top: 3,
                            right: 3,
                            width: 25,
                            height: 25,
                            backgroundColor: "rgba(0,0,0,0.75)",
                            color: "#fff",
                            "&:hover": {
                              backgroundColor: "#e91e63",
                            },
                          }}
                        >
                          <DeleteRoundedIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploadImage || formik.values.images.length >= 2}
                  startIcon={<AddPhotoAlternateRoundedIcon />}
                  sx={{
                    mt: 1.5,
                    color: "#e91e63",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Add More Images
                </Button>
              </Box>
            )}

            {(formik.touched.images || formik.submitCount > 0) &&
              formik.errors.images && (
              <Typography
                sx={{
                  color: "#f44336",
                  fontSize: 12,
                  mt: -1,
                }}
              >
                {formik.errors.images}
              </Typography>
              )}

            <TextField
              fullWidth
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Restaurant Name"
              variant="outlined"
              size="small"
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={
                formik.touched.name && formik.errors.name
                  ? formik.errors.name
                  : ""
              }
              sx={inputStyle}
            />

            <TextField
              fullWidth
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Description"
              variant="outlined"
              size="small"
              multiline
              minRows={2}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
                  ? formik.errors.description
                  : ""
              }
              sx={inputStyle}
            />

            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="cuisineType"
                  value={formik.values.cuisineType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Cuisine Type"
                  variant="outlined"
                  size="small"
                  error={
                    formik.touched.cuisineType &&
                    Boolean(formik.errors.cuisineType)
                  }
                  helperText={
                    formik.touched.cuisineType && formik.errors.cuisineType
                      ? formik.errors.cuisineType
                      : ""
                  }
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="openingHours"
                  value={formik.values.openingHours}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Opening Hours"
                  variant="outlined"
                  size="small"
                  error={
                    formik.touched.openingHours &&
                    Boolean(formik.errors.openingHours)
                  }
                  helperText={
                    formik.touched.openingHours && formik.errors.openingHours
                      ? formik.errors.openingHours
                      : ""
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={inputStyle}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              name="streetAddress"
              value={formik.values.streetAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Street Address"
              variant="outlined"
              size="small"
              error={
                formik.touched.streetAddress &&
                Boolean(formik.errors.streetAddress)
              }
              helperText={
                formik.touched.streetAddress && formik.errors.streetAddress
                  ? formik.errors.streetAddress
                  : ""
              }
              sx={inputStyle}
            />

            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="City"
                  variant="outlined"
                  size="small"
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={
                    formik.touched.city && formik.errors.city
                      ? formik.errors.city
                      : ""
                  }
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name="stateProvince"
                  value={formik.values.stateProvince}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="State"
                  variant="outlined"
                  size="small"
                  error={
                    formik.touched.stateProvince &&
                    Boolean(formik.errors.stateProvince)
                  }
                  helperText={
                    formik.touched.stateProvince && formik.errors.stateProvince
                      ? formik.errors.stateProvince
                      : ""
                  }
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name="postalCode"
                  value={formik.values.postalCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Postal Code"
                  variant="outlined"
                  size="small"
                  error={
                    formik.touched.postalCode &&
                    Boolean(formik.errors.postalCode)
                  }
                  helperText={
                    formik.touched.postalCode && formik.errors.postalCode
                      ? formik.errors.postalCode
                      : ""
                  }
                  sx={inputStyle}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Country"
              variant="outlined"
              size="small"
              error={formik.touched.country && Boolean(formik.errors.country)}
              helperText={
                formik.touched.country && formik.errors.country
                  ? formik.errors.country
                  : ""
              }
              sx={inputStyle}
            />

            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Email"
                  variant="outlined"
                  size="small"
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={
                    formik.touched.email && formik.errors.email
                      ? formik.errors.email
                      : ""
                  }
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="mobile"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Mobile"
                  variant="outlined"
                  size="small"
                  error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                  helperText={
                    formik.touched.mobile && formik.errors.mobile
                      ? formik.errors.mobile
                      : ""
                  }
                  sx={inputStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{
                            color: "#777",
                            fontSize: 14,
                          }}
                        >
                          +91
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="twitter"
                  value={formik.values.twitter}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Twitter"
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="instagram"
                  value={formik.values.instagram}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Instagram"
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              disabled={formik.isSubmitting || uploadImage}
              startIcon={
                !formik.isSubmitting ? <RestaurantRoundedIcon /> : null
              }
              sx={{
                alignSelf: "flex-start",
                mt: 0.5,
                px: 2,
                py: 0.8,
                backgroundColor: "#e91e63",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: "3px",
                textTransform: "uppercase",
                "&:hover": {
                  backgroundColor: "#c2185b",
                },
                "&:disabled": {
                  backgroundColor: "#6b1740",
                  color: "#aaa",
                },
                "&:not(:disabled)": {
                  cursor: "pointer",
                },
              }}
            >
              {formik.isSubmitting ? "Creating..." : "Create Restaurant"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateRestaurantForm;
