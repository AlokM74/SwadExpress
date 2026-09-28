import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Address from "../Address/Address";
import {
  createAddress,
  deleteAddress,
  getAddresses,
} from "../../State/Address/Action";

const emptyForm = {
  streetAddress: "",
  city: "",
  stateProvince: "",
  postalCode: "",
  country: "India",
};

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    let active = true;

    const loadAddresses = async () => {
      if (!jwt) {
        setAddresses([]);
        setIsLoading(false);
        return;
      }

      try {
        const data = await getAddresses(jwt);
        if (active) {
          setAddresses(Array.isArray(data) ? data : []);
          setLoadFailed(false);
        }
      } catch (loadError) {
        console.error("Failed to load profile addresses:", loadError);
        if (active) {
          setLoadFailed(true);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadAddresses();

    return () => {
      active = false;
    };
  }, [jwt]);

  const handleDelete = async (address) => {
    try {
      await deleteAddress({ jwt, addressId: address.id });
      setAddresses((current) =>
        current.filter((item) => item.id !== address.id),
      );
    } catch (deleteError) {
      console.error("Failed to delete profile address:", deleteError);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const savedAddress = await createAddress({
        jwt,
        address: {
          streetAddress: form.streetAddress.trim(),
          city: form.city.trim(),
          stateProvince: form.stateProvince.trim(),
          postalCode: form.postalCode.trim(),
          country: form.country,
          isDefault: addresses.length === 0,
        },
      });
      setAddresses((current) => [...current, savedAddress]);
      setForm(emptyForm);
      setDialogOpen(false);
    } catch (saveError) {
      console.error("Failed to save profile address:", saveError);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box
      className="profile-scrollbar-hidden"
      sx={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        bgcolor: "#0e0e0e",
        color: "#e5e5e5",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, sm: 5 },
      }}
    >
      <Typography
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontSize: { xs: 20, sm: 26 },
          fontWeight: 600,
          mb: { xs: 2.5, sm: 3.5 },
        }}
      >
        <LocationOnOutlinedIcon sx={{ color: "#26A69A" }} />
        <span>Addresses</span>
      </Typography>

      {isLoading ? (
        <Typography sx={{ color: "#9ca3af", textAlign: "center", py: 6 }}>
          Loading addresses...
        </Typography>
      ) : loadFailed ? null : addresses.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          {addresses.map((address) => (
            <Address
              key={address.id}
              address={address}
              onDelete={handleDelete}
            />
          ))}
          <Address isAddNew onAdd={() => setDialogOpen(true)} />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Box
            sx={{
              border: "1px dashed #2a2a2a",
              borderRadius: 3,
              minHeight: 235,
              py: { xs: 6, sm: 8 },
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocationOnOutlinedIcon
              sx={{ fontSize: 40, color: "#6b7280", mb: 1.5 }}
            />
            <Typography
              sx={{ fontSize: { xs: 14, sm: 15 }, color: "#9ca3af" }}
            >
              No saved addresses
            </Typography>
          </Box>
          <Address isAddNew onAdd={() => setDialogOpen(true)} />
        </Box>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => !isSaving && setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent sx={{ bgcolor: "#181818", color: "#fff", p: 3 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 600, mb: 3 }}>
            Add new address
          </Typography>
          <Box
            component="form"
            onSubmit={handleSave}
            sx={{ display: "grid", gap: 2 }}
          >
            {[
              ["streetAddress", "Street address"],
              ["city", "City"],
              ["stateProvince", "State"],
              ["postalCode", "Postal code"],
            ].map(([field, label]) => (
              <TextField
                key={field}
                label={label}
                value={form[field]}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [field]: event.target.value,
                  }))
                }
                required
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                  "& .MuiInputBase-input": { color: "#fff" },
                }}
              />
            ))}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                onClick={() => setDialogOpen(false)}
                disabled={isSaving}
                sx={{ color: "#9ca3af", textTransform: "none" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSaving}
                sx={{ bgcolor: "#7a1f1f", textTransform: "none" }}
              >
                {isSaving ? "Saving..." : "Save address"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Addresses;
