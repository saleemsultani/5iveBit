import { Box, Button, IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import React from "react";

function NavBar() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", height: "10%" }}>
      <Box
        sx={{
          width: "95%",
          color: "white",
          // border: "red solid 1px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            // border: "red solid 1px",
            display: "flex",
            gap: 5,
            height: "100%",
            alignItems: "center",
          }}
        >
          <p>5iveBit.</p>
          <p>Latest CVEs</p>
          <p>Best Practices</p>
        </Box>

        <Button
          sx={{
            borderRadius: "10px",
            height: "60%",
            width: "18%",
            color: "white",
            padding: "10px",
            background: "linear-gradient(to right, #862e9c, #c10281)",
          }}
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
