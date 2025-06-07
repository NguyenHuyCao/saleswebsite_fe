"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Button,
  Divider,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";

interface Promotion {
  id: number;
  name: string;
  code: string | null;
  discount: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  requiresCode: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
  pricePerUnit: number;
  stockQuantity: number;
  totalStock: number;
  imageAvt: string;
  rating: number;
  slug: string;
}

const PromotionListPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [productsMap, setProductsMap] = useState<Record<number, Product[]>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const router = useRouter();

  const fetchPromotions = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/promotions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      setPromotions(data.data);

      for (const promo of data.data) {
        const resProd = await fetch(
          `http://localhost:8080/api/v1/promotions/${promo.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const productData = await resProd.json();
        setProductsMap((prev) => ({ ...prev, [promo.id]: productData.data }));
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu khuyến mãi:", error);
    }
  };

  const handleUpdate = (id: number) => {
    router.push(`/admin/events?action=edit&id=${id}`);
  };

  const handleDeleteProductFromPromotion = async (
    promotionId: number,
    productId: number
  ) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/promotions/delete-product/${promotionId}?productId=${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const result = await res.json();

      if (result.status === 200) {
        setProductsMap((prev) => ({
          ...prev,
          [promotionId]: prev[promotionId].filter((p) => p.id !== productId),
        }));
        setSnackbar({ open: true, message: result.message, type: "success" });
      } else {
        throw new Error(result.message || "Xoá sản phẩm thất bại");
      }
    } catch (error: any) {
      console.error("Xoá sản phẩm lỗi:", error);
      setSnackbar({ open: true, message: error.message, type: "error" });
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <Box p={3}>
      <Box mb={3} display="flex" justifyContent="space-between">
        <Typography variant="h5">Danh sách khuyến mãi</Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/admin/events?action=add")}
        >
          Thêm khuyến mãi
        </Button>
      </Box>

      <Grid container spacing={3}>
        {promotions.map((promo) => (
          <Grid size={{ xs: 12, md: 6 }} key={promo.id}>
            <Card>
              <CardHeader
                title={promo.name}
                subheader={`Từ ${promo.startDate} đến ${promo.endDate}`}
                action={
                  <Button size="small" onClick={() => handleUpdate(promo.id)}>
                    Cập nhật
                  </Button>
                }
              />
              <CardContent>
                <Typography variant="body2">
                  Giảm: {(promo.discount * 100).toFixed(0)}%, tối đa{" "}
                  {promo.maxDiscount.toLocaleString()}₫
                </Typography>
                {promo.requiresCode && promo.code && (
                  <Chip
                    label={`Mã: ${promo.code}`}
                    color="warning"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2">Sản phẩm áp dụng:</Typography>
                <Grid container spacing={2} mt={1}>
                  {productsMap[promo.id]?.length ? (
                    productsMap[promo.id].map((product) => (
                      <Grid size={{ xs: 12 }} key={product.id}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          bgcolor="#f9f9f9"
                          p={1.5}
                          borderRadius={2}
                        >
                          <Typography variant="body2">
                            {product.name}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() =>
                              handleDeleteProductFromPromotion(
                                promo.id,
                                product.id
                              )
                            }
                          >
                            Xoá
                          </Button>
                        </Box>
                      </Grid>
                    ))
                  ) : (
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" color="text.secondary">
                        Không có sản phẩm nào
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PromotionListPage;
