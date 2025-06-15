"use client";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Button,
  Tooltip,
  CardActions,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface Product {
  id: string;
  name: string;
  image: string;
  inStock: boolean;
}

interface Props {
  product: Product;
}

const WishlistItemCard = ({ product }: Props) => {
  return (
    <Card
      sx={{
        display: "flex",
        p: 2,
        mb: 3,
        borderRadius: 3,
        boxShadow: 4,
        transition: "0.3s",
        "&:hover": { boxShadow: 6 },
      }}
    >
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 2 }}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {product.name}
        </Typography>
        <Typography color="text.secondary" mb={1}>
          {product.inStock ? "✅ Còn hàng" : "❌ Hết hàng"}
        </Typography>
        <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box display="flex" gap={1}>
            <Tooltip title="Thêm vào giỏ hàng">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ShoppingCartIcon />}
                disabled={!product.inStock}
              >
                Thêm vào giỏ
              </Button>
            </Tooltip>
            <Tooltip title="Bỏ khỏi yêu thích">
              <IconButton color="error">
                <FavoriteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default WishlistItemCard;
