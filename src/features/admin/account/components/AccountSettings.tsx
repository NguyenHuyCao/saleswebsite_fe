"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import PersonalInfoForm from "./PersonalInfoForm";
import SecurityForm from "./SecurityForm";
import { useUser } from "../../users/queries";

const steps = ["Thông tin cá nhân", "Bảo mật"];

export default function AccountSettings() {
  const sp = useSearchParams();
  const router = useRouter();

  // Bắt buộc ?userId=... trên URL
  const userId = sp.get("userId");
  const initialStep = Number(sp.get("step") ?? 0);
  const [activeStep, setActiveStep] = useState(initialStep);

  const { data: user, isLoading } = useUser(userId);

  // Giữ cho UI luôn sync theo URL
  useEffect(() => {
    const s = Number(sp.get("step") ?? 0);
    if (s !== activeStep) setActiveStep(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  const goto = (step: number) => {
    const params = new URLSearchParams(sp?.toString());
    params.set("step", String(step));
    router.replace(`?${params.toString()}`);
  };

  if (!userId) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" color="error">
          Thiếu tham số <code>userId</code> trên URL.
        </Typography>
        <Typography>
          Ví dụ: /admin/account-settings?userId=123&step=0
        </Typography>
      </Box>
    );
  }

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
        <PersonalInfoForm user={user || null} onNext={() => goto(1)} />
      ) : (
        <SecurityForm userId={userId} onBack={() => goto(0)} />
      )}
    </Box>
  );
}
