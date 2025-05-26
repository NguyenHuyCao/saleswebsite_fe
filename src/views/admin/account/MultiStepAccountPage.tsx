"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

import SecurityForm from "@/views/admin/account/SecurityForm";
import UserCombinedForm from "./UserCombinedForm";

const steps = ["Thông tin cá nhân", "Bảo mật"];

const MultiStepAccountPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Lấy step từ query ?step=1, mặc định là 0
  const initialStep = parseInt(searchParams.get("step") || "0", 10);
  const [activeStep, setActiveStep] = useState(initialStep);

  // Cập nhật URL mỗi khi step thay đổi
  const updateStepInUrl = (step: number) => {
    router.replace(`?step=${step}`);
  };

  const handleNext = () => {
    const nextStep = activeStep + 1;
    setActiveStep(nextStep);
    updateStepInUrl(nextStep);
  };

  const handleBack = () => {
    const prevStep = activeStep - 1;
    setActiveStep(prevStep);
    updateStepInUrl(prevStep);
  };

  // Khi URL thay đổi bên ngoài (nút back trên trình duyệt), sync lại step
  useEffect(() => {
    const stepFromUrl = parseInt(searchParams.get("step") || "0", 10);
    if (stepFromUrl !== activeStep) {
      setActiveStep(stepFromUrl);
    }
  }, [searchParams]);

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

      {activeStep === 0 && <UserCombinedForm onNext={handleNext} />}
      {activeStep === 1 && <SecurityForm onBack={handleBack} />}
    </Box>
  );
};

export default MultiStepAccountPage;
