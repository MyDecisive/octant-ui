import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Octobuddy from "../assets/logo.svg?react";
import "./FullscreenLoader.css";

export function FullscreenLoader() {
  return (
    <Box className="meta-container">
      <Stack
        className="loader-container"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Octobuddy className="octobuddy-loader-icon" />
      </Stack>
    </Box>
  );
}
