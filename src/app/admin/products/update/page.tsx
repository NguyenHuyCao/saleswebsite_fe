// src/app/admin/products/update/page.tsx
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import Step1 from "@/features/admin/products/components/steps/Step1BasicInfo";
import Step2 from "@/features/admin/products/components/steps/Step2Technical";
import Step3 from "@/features/admin/products/components/steps/Step3PriceStock";
import Step4 from "@/features/admin/products/components/steps/Step4Images";
import { Mutations, useProduct } from "@/features/admin/products/queries";
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
  const productSlug = sp.get("productSlug")!;
  const initial = Number(sp.get("step") ?? 0);
  const { data } = useProduct(productSlug);

  const [active, setActive] = useState(initial);
  const [slug, setSlug] = useState(productSlug);
  const [form, setForm] = useState<Product | null>(null);

  useEffect(() => {
    if (data) setForm({ ...data });
  }, [data]);
  const next = (s: number) => {
    setActive(s);
    router.replace(`/admin/products/update?productSlug=${slug}&step=${s}`);
  };
  const onChange = (k: keyof Product, v: any) =>
    setForm((p) => ({ ...(p as Product), [k]: v } as Product));

  if (!form) return <Typography>Đang tải...</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4} color="#ffb700" textAlign="center">
        Cập nhật sản phẩm
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
            });
            if (newSlug && newSlug !== slug) setSlug(newSlug);
            next(1);
          }}
        />
      )}

      {active === 1 && (
        <Step2
          formData={form}
          onChange={onChange}
          onNext={async () => {
            await Mutations.update.step2(slug, {
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
            await Mutations.update.step3(slug, {
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
          onBack={() => next(2)}
          backLabel="Quay lại"
          onSubmit={async () => {
            await Mutations.update.step4(slug, {
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
