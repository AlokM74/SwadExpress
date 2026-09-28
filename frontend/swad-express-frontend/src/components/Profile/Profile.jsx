import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { Button, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import ProfileNavigation from "./ProfileNavigation";
import UserProfile from "./UserProfile";
import Orders from "./Orders";
import Favorites from "./Favorites";
import Addresses from "./Addresses";
import Support from "./Support";
import Events from "./Events";

const Profile = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full bg-[#181818] lg:flex lg:h-[calc(100dvh-4rem)] lg:min-h-0 lg:overflow-hidden">
      <aside className="hidden h-full shrink-0 lg:block w-[18%]">
        <div className="sticky top-0 h-full min-h-0">
          <ProfileNavigation />
        </div>
      </aside>

      <div className="w-full px-4! pt-4! lg:hidden">
        <Button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          startIcon={<MenuIcon />}
          variant="outlined"
          sx={{
            color: "#fff",
            borderColor: "#4a232b",
            backgroundColor: "#24141a",
            textTransform: "none",
            borderRadius: "10px",
            px: 2,
            py: 1,
            fontSize: "14px",
            "&:hover": {
              borderColor: "#7a1f1f",
              backgroundColor: "#321820",
            },
          }}
        >
          Profile Menu
        </Button>

        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          PaperProps={{
            sx: {
              width: {
                xs: "82vw",
                sm: 320,
              },
              maxWidth: 320,
              backgroundColor: "#181818",
              color: "#fff",
            },
          }}
        >
          <ProfileNavigation onNavigate={() => setMobileMenuOpen(false)} />
        </Drawer>
      </div>

      <main className="w-full">
        <Routes>
          <Route path="/" element={<UserProfile />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/support" element={<Support />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </main>
    </div>
  );
};

export default Profile;
