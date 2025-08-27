"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";
import { useUser } from "../queries";

const steps = ["Thông tin cá nhân", "Bảo mật"];

export default function MultiStepAccountPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const userId = sp.get("userId")!;
  const initialStep = parseInt(sp.get("step") || "0", 10);

  const [activeStep, setActiveStep] = useState(initialStep);
  const { data: userData } = useUser(userId);

  useEffect(() => {
    const s = parseInt(sp.get("step") || "0", 10);
    if (s !== activeStep) setActiveStep(s);
  }, [sp]); // eslint-disable-line

  const setStepInUrl = (step: number) => {
    const p = new URLSearchParams();
    p.set("userId", userId);
    p.set("step", String(step));
    router.replace(`?${p.toString()}`);
  };

  const next = () => {
    const s = activeStep + 1;
    setActiveStep(s);
    setStepInUrl(s);
  };
  const back = () => {
    const s = activeStep - 1;
    setActiveStep(s);
    setStepInUrl(s);
  };

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

      {activeStep === 0 && (
        <UserCombinedForm onNext={next} userData={userData ?? null} />
      )}

      {activeStep === 1 && userData && (
        <SecurityForm
          onBack={back}
          email={userData.email}
          userId={String(userId)}
        />
      )}
    </Box>
  );
}

// Lazy import để tránh vòng import
import UserCombinedForm from "./UserCombinedForm";
import SecurityForm from "./SecurityForm";
