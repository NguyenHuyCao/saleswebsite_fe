"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

import Step1BasicInfo from "./Step1BasicInfo";
import Step2TechnicalInfo from "./Step2TechnicalInfo";
import Step3PricingInventory from "./Step3PricingInventory";
import Step4Images from "./Step4Images";

const steps = [
  "Thông tin cơ bản",
  "Thông số kỹ thuật",
  "Giá & tồn kho",
  "Hình ảnh sản phẩm",
];

const UpdateProduct = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialStep = parseInt(searchParams.get("step") || "0", 10);
  const productId = searchParams.get("productId");
  const [activeStep, setActiveStep] = useState(initialStep);
  const [slug, setSlug] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    origin: "",
    categoryId: null,
    brandId: null,
    power: "",
    fuelType: "",
    engineType: "",
    weight: null,
    dimensions: "",
    tankCapacity: null,
    price: null,
    stockQuantity: null,
    warrantyMonths: null,
    imageAvt: null,
    imageDetail1: null,
    imageDetail2: null,
    imageDetail3: null,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateStepInUrl = (step: number) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("step", step.toString());
    if (slug) currentParams.set("name", slug);
    router.replace(`?${currentParams.toString()}`);
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
    const fetchProductData = async () => {
      if (!productId) return;

      try {
        const res = await fetch(
          `http://localhost:8080/api/v1/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          const product = data.data;
          setSlug(product.slug);
          setFormData({
            name: product.name,
            description: product.description,
            origin: product.origin,
            categoryId: product.productCategory?.id || null,
            brandId: product.brand?.id || null,
            power: product.power,
            fuelType: product.fuelType,
            engineType: product.engineType,
            weight: product.weight,
            dimensions: product.dimensions,
            tankCapacity: product.tankCapacity,
            price: product.price,
            stockQuantity: product.stockQuantity,
            warrantyMonths: product.warrantyMonths,
            imageAvt: product.imageAvt,
            imageDetail1: product.imageDetail1,
            imageDetail2: product.imageDetail2,
            imageDetail3: product.imageDetail3,
          });
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    fetchProductData();
  }, [productId]);

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Step1BasicInfo
            formData={formData}
            onChange={handleChange}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <Step2TechnicalInfo
            formData={formData}
            onChange={handleChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <Step3PricingInventory
            formData={formData}
            onChange={handleChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step4Images
            formData={formData}
            onChange={handleChange}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4} color="#ffb700" textAlign="center">
        Cập nhật sản phẩm
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent()}
    </Box>
  );
};

export default UpdateProduct;
