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

  const initialStep = parseInt(searchParams.get("step") || "0", 10);
  const [activeStep, setActiveStep] = useState(initialStep);

  const userId = searchParams.get("userId");
  const [userData, setUserData] = useState<any>(null);

  const updateStepInUrl = (step: number) => {
    const newParams = new URLSearchParams();
    if (userId) newParams.set("userId", userId);
    newParams.set("step", step.toString());
    router.replace(`?${newParams.toString()}`);
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

  useEffect(() => {
    const stepFromUrl = parseInt(searchParams.get("step") || "0", 10);
    if (stepFromUrl !== activeStep) {
      setActiveStep(stepFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (userId) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) setUserData(res.data);
        })
        .catch(() => {
          console.error("Lỗi khi lấy dữ liệu người dùng");
        });
    }
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
        <UserCombinedForm onNext={handleNext} userData={userData} />
      )}
      {activeStep === 1 && userData && (
        <SecurityForm
          onBack={handleBack}
          email={userData.email}
          userId={userId || ""}
        />
      )}
    </Box>
  );
};

export default MultiStepAccountPage;
