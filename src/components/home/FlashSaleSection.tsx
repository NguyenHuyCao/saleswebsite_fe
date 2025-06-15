// FlashSaleSection.tsx
"use client";

import { useEffect, useState } from "react";
import FlashSaleSlider, { Promotion } from "./FlashSaleSlider";

const FlashSaleSection = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const fetchPromotions = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/promotions`,
        {
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        }
      );

      const data = await res.json();
      const flashPromos: Promotion[] = (data?.data || []).filter(
        (promo: any) => !promo.requiresCode
      );
      setPromotions(flashPromos);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khuyến mãi:", error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <>
      {promotions.map((promo) => (
        <FlashSaleSlider key={promo.id} promotion={promo} />
      ))}
    </>
  );
};

export default FlashSaleSection;
