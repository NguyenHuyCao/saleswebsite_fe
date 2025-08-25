// src/features/admin/users/components/MultiStepAccountPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";
import { apiGetUser } from "../../users/api";
import type { User } from "../../users/types";
import UserCombinedForm from "./UserCombinedForm";
import SecurityForm from "./SecurityForm";

const steps = ["Thông tin cá nhân", "Bảo mật"];

export default function MultiStepAccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialStep = parseInt(searchParams.get("step") || "0", 10);
  const [activeStep, setActiveStep] = useState(initialStep);

  const userId = searchParams.get("userId")!;
  const [userData, setUserData] = useState<User | null>(null);

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

  useEffect(() => {
    const stepFromUrl = parseInt(searchParams.get("step") || "0", 10);
    if (stepFromUrl !== activeStep) setActiveStep(stepFromUrl);
  }, [searchParams]); // eslint-disable-line

  useEffect(() => {
    if (!userId) return;
    apiGetUser(userId)
      .then(setUserData)
      .catch((e) => console.error(e));
  }, [userId]);

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
        <UserCombinedForm onNext={next} userData={userData} />
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
