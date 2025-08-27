"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import PersonalInfoForm from "./PersonalInfoForm";
import SecurityForm from "./SecurityForm";
import { useUser } from "../hooks/useUser";

const steps = ["Thông tin cá nhân", "Bảo mật"];

export default function AccountSettings() {
  const sp = useSearchParams();
  const router = useRouter();

  const userId = sp.get("userId");
  const initialStep = Number(sp.get("step") ?? 0);
  const [activeStep, setActiveStep] = useState(initialStep);

  const { data: user, isLoading } = useUser(userId);

  useEffect(() => {
    const s = Number(sp.get("step") ?? 0);
    if (s !== activeStep) setActiveStep(s);
  }, [sp]); // sync khi đổi URL

  const go = (step: number) => {
    const params = new URLSearchParams(sp?.toString());
    params.set("step", String(step));
    router.replace(`?${params.toString()}`);
  };

  const next = () =>
    setActiveStep((p) => {
      const n = p + 1;
      go(n);
      return n;
    });
  const back = () =>
    setActiveStep((p) => {
      const n = Math.max(0, p - 1);
      go(n);
      return n;
    });

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4} textAlign="center">
        Cài đặt tài khoản
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {isLoading ? (
        <Typography align="center">Đang tải...</Typography>
      ) : activeStep === 0 ? (
        <PersonalInfoForm user={user || null} onNext={next} />
      ) : (
        <SecurityForm onBack={back} userId={userId || ""} />
      )}
    </Box>
  );
}
