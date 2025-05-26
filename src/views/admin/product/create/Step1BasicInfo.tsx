"use client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface Props {
  formData: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
}

const Step1BasicInfo = ({ formData, onChange, onNext }: Props) => {
  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <Typography variant="h6" fontWeight={700}>
        Bước 1: Thông tin cơ bản
      </Typography>

      {/* Box chia hàng 2 ô trên màn hình lớn, 1 ô trên mobile */}
      <Box display="flex" flexWrap="wrap" gap={4}>
        <Box flex={{ xs: "100%", md: "1 1 45%" }} minWidth={250}>
          <TextField
            label="Tên sản phẩm"
            value={formData.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            required
            fullWidth
          />
        </Box>

        <Box flex={{ xs: "100%", md: "1 1 45%" }} minWidth={250}>
          <TextField
            label="Xuất xứ"
            value={formData.origin || ""}
            onChange={(e) => onChange("origin", e.target.value)}
            fullWidth
          />
        </Box>

        <Box flex={{ xs: "100%", md: "1 1 45%" }} minWidth={250}>
          <TextField
            label="Danh mục ID"
            type="number"
            value={formData.categoryId || ""}
            onChange={(e) => onChange("categoryId", Number(e.target.value))}
            fullWidth
          />
        </Box>

        <Box flex={{ xs: "100%", md: "1 1 45%" }} minWidth={250}>
          <TextField
            label="Thương hiệu ID"
            type="number"
            value={formData.brandId || ""}
            onChange={(e) => onChange("brandId", Number(e.target.value))}
            fullWidth
          />
        </Box>
      </Box>

      {/* Mô tả chiếm toàn bộ chiều ngang */}
      <Box>
        <TextField
          label="Mô tả"
          value={formData.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          multiline
          rows={4}
          fullWidth
        />
      </Box>

      {/* Nút Tiếp theo */}
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={onNext} sx={{ px: 4, py: 1.5 }}>
          Tiếp theo
        </Button>
      </Box>
    </Box>
  );
};

export default Step1BasicInfo;
