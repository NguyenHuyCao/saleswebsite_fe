// warranty/components/WarrantyPolicyTabs.tsx
"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface WarrantyPolicy {
  type: string;
  duration: string;
  conditions: string[];
  exclusions: string[];
}

const policies: WarrantyPolicy[] = [
  {
    type: "Máy cơ khí",
    duration: "24 tháng",
    conditions: [
      "Sản phẩm còn nguyên tem bảo hành",
      "Lỗi từ nhà sản xuất",
      "Có hóa đơn mua hàng",
    ],
    exclusions: [
      "Hư hỏng do va đập, rơi vỡ",
      "Sử dụng sai hướng dẫn",
      "Tự ý tháo lắp, sửa chữa",
    ],
  },
  {
    type: "Máy điện cầm tay",
    duration: "12 tháng",
    conditions: [
      "Sản phẩm còn nguyên tem bảo hành",
      "Lỗi kỹ thuật từ nhà sản xuất",
      "Đăng ký bảo hành online",
    ],
    exclusions: [
      "Mòn tự nhiên (chổi than, dây cắt...)",
      "Vào nước, chập điện do người dùng",
      "Sử dụng điện áp không đúng",
    ],
  },
  {
    type: "Phụ kiện, linh kiện",
    duration: "6 tháng",
    conditions: [
      "Lỗi từ nhà sản xuất",
      "Còn nguyên tem",
      "Có hóa đơn mua hàng",
    ],
    exclusions: [
      "Hao mòn tự nhiên",
      "Lắp đặt sai quy cách",
      "Tác động từ môi trường",
    ],
  },
];

export default function WarrantyPolicyTabs() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ my: 6 }}>
      <Typography variant="h4" fontWeight={800} color="#333" gutterBottom>
        Chính sách bảo hành
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
          "& .Mui-selected": { color: "#0d47a1" },
        }}
      >
        {policies.map((policy) => (
          <Tab key={policy.type} label={policy.type} />
        ))}
      </Tabs>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Thời gian bảo hành: {policies[activeTab].duration}
            </Typography>

            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="success.main"
                  gutterBottom
                >
                  Điều kiện bảo hành
                </Typography>
                <List>
                  {policies[activeTab].conditions.map((condition, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon
                          sx={{ color: "#4caf50", fontSize: 20 }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={condition} />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="error.main"
                  gutterBottom
                >
                  Không được bảo hành
                </Typography>
                <List>
                  {policies[activeTab].exclusions.map((exclusion, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CancelIcon sx={{ color: "#f44336", fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary={exclusion} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
