// features/warranty/constants.tsx
import type { ReactNode } from "react";
import { Wrench, AlertTriangle, Package } from "lucide-react";

// Khuyến nghị: import từng icon để giảm bundle size
import BuildIcon from "@mui/icons-material/Build";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InventoryIcon from "@mui/icons-material/Inventory";

export type WarrantyCard = {
  icon: ReactNode;
  title: string;
  description: string;
};

export type WarrantyItem = {
  icon: ReactNode;
  title: string;
  content: string;
};

export const WARRANTY_CARDS: WarrantyCard[] = [
  {
    icon: <Wrench size={36} color="#2563eb" aria-label="Wrench Icon" />,
    title: "Thời gian bảo hành",
    description: "Tối đa 12 tháng kể từ ngày mua (tùy từng sản phẩm).",
  },
  {
    icon: <AlertTriangle size={36} color="#f25c05" aria-label="Alert Icon" />,
    title: "Không bảo hành nếu:",
    description:
      "Sản phẩm bị hỏng do sử dụng sai cách, rơi vỡ, tự ý tháo lắp hoặc can thiệp kỹ thuật.",
  },
  {
    icon: <Package size={36} color="#10b981" aria-label="Package Icon" />,
    title: "Yêu cầu:",
    description:
      "Cần cung cấp mã đơn hàng và tên sản phẩm cần bảo hành để được xử lý nhanh chóng.",
  },
];

export const WARRANTY_ITEMS: WarrantyItem[] = [
  {
    icon: <BuildIcon fontSize="large" color="primary" />,
    title: "Thời gian bảo hành",
    content: "Áp dụng tối đa 12 tháng kể từ ngày mua, tùy theo sản phẩm.",
  },
  {
    icon: <WarningAmberIcon fontSize="large" color="error" />,
    title: "Các trường hợp không áp dụng",
    content:
      "Rơi vỡ, cháy nổ, hư hỏng do tác động ngoại lực hoặc tự ý sửa chữa.",
  },
  {
    icon: <InventoryIcon fontSize="large" color="success" />,
    title: "Điều kiện tiếp nhận",
    content:
      "Cung cấp đúng mã đơn hàng, sản phẩm và mô tả lỗi rõ ràng để được xử lý nhanh.",
  },
];
