import { Box, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import React from "react";
import styles from "./NavBar.module.css";

function NavBar() {
  return (
    <Box className={styles.navbarContainer}>
      <Box className={styles.navbarContent}>
        {/* Left Side Links */}
        <Box className={styles.navbarLinks}>
          <p className={styles.navbarLink}>5iveBit.</p>
          <p className={styles.navbarLink}>Latest CVEs</p>
          <p className={styles.navbarLink}>Best Practices</p>
        </Box>

        {/* Right Side Button */}
        <Button
          className={styles.navbarButton}
          variant="outlined"
          startIcon={<PersonIcon />}
        >
          Senior Analyst
        </Button>
      </Box>
    </Box>
  );
}

export default NavBar;