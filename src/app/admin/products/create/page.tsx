// src/app/admin/products/create/page.tsx
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import Step1 from "@/features/admin/products/components/steps/Step1BasicInfo";
import Step2 from "@/features/admin/products/components/steps/Step2Technical";
import Step3 from "@/features/admin/products/components/steps/Step3PriceStock";
import Step4 from "@/features/admin/products/components/steps/Step4Images";
import Step5 from "@/features/admin/products/components/steps/Step5Variants";
import { Mutations } from "@/features/admin/products/queries";
import type { Product } from "@/features/admin/products/types";

// MACHINE: Basic → Tech → Price → Images → Variants
// non-MACHINE: Basic → Price → Images → Variants
const STEPS_MACHINE    = ["Thông tin cơ bản", "Thông số kỹ thuật", "Giá & tồn kho", "Hình ảnh", "Biến thể"];
const STEPS_NON_MACHINE = ["Thông tin cơ bản", "Giá & tồn kho", "Hình ảnh", "Biến thể"];

export default function Page() {
  const router = useRouter();
  const sp = useSearchParams();
  const [active, setActive] = useState(Number(sp.get("step") ?? 0));
  const [slug, setSlug] = useState(sp.get("name") || "");
  const [productId, setProductId] = useState<number | null>(null);
  const [form, setForm] = useState<Product>({
    id: 0, slug: "", name: "", description: "", origin: "",
    categoryId: null, brandId: null,
    power: "", fuelType: "", engineType: "", weight: null,
    dimensions: "", tankCapacity: null,
    price: null, costPrice: null, stockQuantity: null, warrantyMonths: null,
    imageAvt: null, imageDetail1: null, imageDetail2: null, imageDetail3: null,
    active: true,
    productType: "MACHINE", size: null, color: null, material: null,
  });

  const isMachine = !form.productType || form.productType === "MACHINE";
  const steps = isMachine ? STEPS_MACHINE : STEPS_NON_MACHINE;

  const nav = (s: number) => {
    setActive(s);
    router.replace(`/admin/products/create?step=${s}${slug ? `&name=${slug}` : ""}`);
  };

  const onChange = (k: keyof Product, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  // Step indices:
  // MACHINE:     0=Basic 1=Tech 2=Price 3=Images 4=Variants
  // non-MACHINE: 0=Basic 1=Price 2=Images 3=Variants
  const priceStep   = isMachine ? 2 : 1;
  const imagesStep  = isMachine ? 3 : 2;
  const variantsStep = isMachine ? 4 : 3;

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4} color="#ffb700" textAlign="center">
        Thêm sản phẩm mới
      </Typography>
      <Stepper activeStep={active} alternativeLabel sx={{ mb: 6 }}>
        {steps.map((l) => (
          <Step key={l}><StepLabel>{l}</StepLabel></Step>
        ))}
      </Stepper>

      {/* Step 0 — Basic info */}
      {active === 0 && (
        <Step1
          mode="create"
          formData={form}
          onChange={onChange}
          onSubmit={async () => {
            const { slug: newSlug } = await Mutations.create.step1({
              name: form.name,
              description: form.description,
              origin: form.origin,
              category: { id: form.categoryId },
              brand: { id: form.brandId },
              productType: form.productType,
              size: form.size,
              color: form.color,
              material: form.material,
            });
            setSlug(newSlug);
            nav(1);
          }}
        />
      )}

      {/* Step 1 — Technical specs (MACHINE only) */}
      {active === 1 && isMachine && (
        <Step2
          formData={form}
          onChange={onChange}
          onNext={async () => {
            await Mutations.create.step2(slug, {
              power: form.power ?? "",
              fuelType: form.fuelType ?? "",
              engineType: form.engineType ?? "",
              weight: Math.abs(form.weight ?? 0),
              dimensions: form.dimensions ?? "",
              tankCapacity: Math.abs(form.tankCapacity ?? 0),
            });
            nav(2);
          }}
          onBack={() => nav(0)}
        />
      )}

      {/* Price & Stock */}
      {active === priceStep && (
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
            nav(imagesStep);
          }}
          onBack={() => nav(isMachine ? 1 : 0)}
        />
      )}

      {/* Images */}
      {active === imagesStep && (
        <Step4
          formData={form}
          onChange={onChange}
          onBack={() => nav(priceStep)}
          backLabel="Quay lại"
          onSubmit={async () => {
            await Mutations.create.step4(slug, {
              imageAvt: form.imageAvt as File | null,
              imageDetail1: form.imageDetail1 as File | null,
              imageDetail2: form.imageDetail2 as File | null,
              imageDetail3: form.imageDetail3 as File | null,
            });
            // Fetch the created product id for variants step
            const { apiGetProduct } = await import("@/features/admin/products/api");
            const created = await apiGetProduct(slug);
            setProductId(created.id);
            nav(variantsStep);
          }}
        />
      )}

      {/* Variants */}
      {active === variantsStep && productId && (
        <Step5
          productId={productId}
          onBack={() => nav(imagesStep)}
          onDone={() => router.push("/admin/products")}
        />
      )}
    </Box>
  );
}
