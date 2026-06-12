import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import classNames from "classnames";
import Octobuddy from "../assets/logo.svg?react";
import "./FullscreenLoader.css";

interface FullscreenLoaderProps {
  is404?: boolean;
}

export function FullscreenLoader({ is404 }: FullscreenLoaderProps) {
  return (
    <Box className="meta-container">
      <Stack
        className="loader-container"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Octobuddy className={classNames("octobuddy-loader-icon", { is404 })} />
        {is404 && (
          <Stack gap={2} alignItems={"center"}>
            <Typography variant="h4">Uh oh!</Typography>
            <Typography variant="body1" color="secondary">
              We couldn't find the page you're looking for.
            </Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
