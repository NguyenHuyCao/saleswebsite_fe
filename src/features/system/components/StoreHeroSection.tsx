"use client";

import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useCallback } from "react";
import StoreInfoCard from "./StoreInfoCard";
import MapEmbed from "./MapEmbed";
import type { StoreInfo } from "../types";
import { googleDirectionsUrl } from "../queries";

type Props = { store: StoreInfo };

export default function StoreHeroSection({ store }: Props) {
  const openMap = useCallback(() => {
    const href = googleDirectionsUrl(store.coords.lat, store.coords.lng);
    window.open(href, "_blank", "noopener,noreferrer");
  }, [store.coords.lat, store.coords.lng]);

  return (
    <Box px={4} py={6}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <StoreInfoCard store={store} onDirections={openMap} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MapEmbed lat={store.coords.lat} lng={store.coords.lng} />
        </Grid>
      </Grid>
    </Box>
  );
}
