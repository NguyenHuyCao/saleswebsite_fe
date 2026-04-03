// src/app/admin/products/update/page.tsx
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import Step1 from "@/features/admin/products/components/steps/Step1BasicInfo";
import Step2 from "@/features/admin/products/components/steps/Step2Technical";
import Step3 from "@/features/admin/products/components/steps/Step3PriceStock";
import Step4 from "@/features/admin/products/components/steps/Step4Images";
import Step5 from "@/features/admin/products/components/steps/Step5Variants";
import { Mutations, useProduct } from "@/features/admin/products/queries";
import type { Product } from "@/features/admin/products/types";

const STEPS_MACHINE    = ["Thông tin cơ bản", "Thông số kỹ thuật", "Giá & tồn kho", "Hình ảnh", "Biến thể"];
const STEPS_NON_MACHINE = ["Thông tin cơ bản", "Giá & tồn kho", "Hình ảnh", "Biến thể"];

export default function Page() {
  const router = useRouter();
  const sp = useSearchParams();
  const productSlug = sp.get("productSlug")!;
  const { data } = useProduct(productSlug);

  const [active, setActive] = useState(Number(sp.get("step") ?? 0));
  const [slug, setSlug] = useState(productSlug);
  const [form, setForm] = useState<Product | null>(null);

  useEffect(() => {
    if (data) setForm({ ...data });
  }, [data]);

  if (!form) return <Typography>Đang tải...</Typography>;

  const isMachine = !form.productType || form.productType === "MACHINE";
  const steps = isMachine ? STEPS_MACHINE : STEPS_NON_MACHINE;

  const nav = (s: number) => {
    setActive(s);
    router.replace(`/admin/products/update?productSlug=${slug}&step=${s}`);
  };

  const onChange = (k: keyof Product, v: any) =>
    setForm((p) => ({ ...(p as Product), [k]: v } as Product));

  const priceStep   = isMachine ? 2 : 1;
  const imagesStep  = isMachine ? 3 : 2;
  const variantsStep = isMachine ? 4 : 3;

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4} color="#ffb700" textAlign="center">
        Cập nhật sản phẩm
      </Typography>
      <Stepper activeStep={active} alternativeLabel sx={{ mb: 6 }}>
        {steps.map((l) => (
          <Step key={l}><StepLabel>{l}</StepLabel></Step>
        ))}
      </Stepper>

      {/* Step 0 — Basic info */}
      {active === 0 && (
        <Step1
          mode="update"
          formData={form}
          onChange={onChange}
          onSubmit={async () => {
            const { slug: newSlug } = await Mutations.update.step1(form.id!, {
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
            if (newSlug && newSlug !== slug) setSlug(newSlug);
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
            await Mutations.update.step2(slug, {
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
            await Mutations.update.step3(slug, {
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
            await Mutations.update.step4(slug, {
              imageAvt: form.imageAvt as File | null,
              imageDetail1: form.imageDetail1 as File | null,
              imageDetail2: form.imageDetail2 as File | null,
              imageDetail3: form.imageDetail3 as File | null,
            });
            nav(variantsStep);
          }}
        />
      )}

      {/* Variants */}
      {active === variantsStep && (
        <Step5
          productId={form.id!}
          onBack={() => nav(imagesStep)}
          onDone={() => router.push("/admin/products")}
        />
      )}
    </Box>
  );
}
