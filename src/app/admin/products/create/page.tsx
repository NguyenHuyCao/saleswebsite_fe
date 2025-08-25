// src/app/admin/products/create/page.tsx
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import Step1 from "@/features/admin/products/components/steps/Step1BasicInfo";
import Step2 from "@/features/admin/products/components/steps/Step2Technical";
import Step3 from "@/features/admin/products/components/steps/Step3PriceStock";
import Step4 from "@/features/admin/products/components/steps/Step4Images";
import { Mutations } from "@/features/admin/products/queries";
import type { Product } from "@/features/admin/products/types";

const steps = [
  "Thông tin cơ bản",
  "Thông số kỹ thuật",
  "Giá & tồn kho",
  "Hình ảnh sản phẩm",
];

export default function Page() {
  const router = useRouter();
  const sp = useSearchParams();
  const initial = Number(sp.get("step") ?? 0);
  const name = sp.get("name") || ""; // slug
  const [active, setActive] = useState(initial);
  const [slug, setSlug] = useState(name);
  const [form, setForm] = useState<Product>({
    id: 0,
    slug: "",
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
    costPrice: null,
    stockQuantity: null,
    warrantyMonths: null,
    imageAvt: null,
    imageDetail1: null,
    imageDetail2: null,
    imageDetail3: null,
    active: true,
  });

  const next = (s: number) => {
    setActive(s);
    router.replace(
      `/admin/products/create?step=${s}${slug ? `&name=${slug}` : ""}`
    );
  };
  const onChange = (k: keyof Product, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4} color="#ffb700" textAlign="center">
        Thêm sản phẩm mới
      </Typography>
      <Stepper activeStep={active} alternativeLabel sx={{ mb: 6 }}>
        {steps.map((l) => (
          <Step key={l}>
            <StepLabel>{l}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {active === 0 && (
        <Step1
          mode="create"
          formData={form}
          onChange={onChange}
          onSubmit={async () => {
            const { slug } = await Mutations.create.step1({
              name: form.name,
              description: form.description,
              origin: form.origin,
              category: { id: form.categoryId },
              brand: { id: form.brandId },
            });
            setSlug(slug);
            next(1);
          }}
        />
      )}

      {active === 1 && (
        <Step2
          formData={form}
          onChange={onChange}
          onNext={async () => {
            const data = await Mutations.create.step2(slug, {
              power: form.power,
              fuelType: form.fuelType,
              engineType: form.engineType,
              weight: Math.abs(form.weight ?? 0),
              dimensions: form.dimensions,
              tankCapacity: Math.abs(form.tankCapacity ?? 0),
            });
            next(2);
          }}
          onBack={() => next(0)}
        />
      )}

      {active === 2 && (
        <Step3
          formData={form}
          onChange={onChange}
          onNext={async () => {
            await Mutations.create.step3(slug, {
              price: form.price ?? 0,
              costPrice: form.costPrice ?? 0,
              stockQuantity: form.stockQuantity ?? 0,
              warrantyMonths: form.warrantyMonths ?? 0,
            });
            next(3);
          }}
          onBack={() => next(1)}
        />
      )}

      {active === 3 && (
        <Step4
          formData={form}
          onChange={onChange}
          onSubmit={async () => {
            await Mutations.create.step4(slug, {
              imageAvt: form.imageAvt as File | null,
              imageDetail1: form.imageDetail1 as File | null,
              imageDetail2: form.imageDetail2 as File | null,
              imageDetail3: form.imageDetail3 as File | null,
            });
            router.push("/admin/products");
          }}
        />
      )}
    </Box>
  );
}
