// about/constants/features.ts
import WhatshotIcon from "@mui/icons-material/Whatshot";
import BuildIcon from "@mui/icons-material/Build";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SpeedIcon from "@mui/icons-material/Speed";
import LightModeIcon from "@mui/icons-material/LightMode";
import ReplayIcon from "@mui/icons-material/Replay";

export const whyTwoStroke = [
  {
    icon: WhatshotIcon,
    title: "Công suất mạnh, dễ khởi động",
    description: "Tỷ lệ công suất/trọng lượng cao hơn 30% so với máy 4 thì",
    stats: "30%",
    color: "#f25c05",
  },
  {
    icon: BuildIcon,
    title: "Cấu tạo đơn giản, dễ bảo trì",
    description: "Ít chi tiết chuyển động hơn, dễ dàng sửa chữa tại nhà",
    stats: "40%",
    color: "#4caf50",
  },
  {
    icon: AttachMoneyIcon,
    title: "Giá thành hợp lý",
    description: "Chi phí đầu tư ban đầu thấp, tiết kiệm nhiên liệu",
    stats: "25%",
    color: "#2196f3",
  },
  {
    icon: SpeedIcon,
    title: "Vận hành mượt mà",
    description: "Động cơ quay 2 vòng/phát nổ, tạo lực đều đặn",
    stats: "2 thì",
    color: "#9c27b0",
  },
  {
    icon: LightModeIcon,
    title: "Khởi động nhanh",
    description: "Chỉ cần 1-2 giật là nổ máy, kể cả khi trời lạnh",
    stats: "1-2s",
    color: "#ff9800",
  },
  {
    icon: ReplayIcon,
    title: "Độ bền cao",
    description: "Tuổi thọ động cơ lên đến 5-7 năm nếu bảo dưỡng đúng cách",
    stats: "5+ năm",
    color: "#f44336",
  },
];

export const companyStats = [
  { value: "5+", label: "Năm kinh nghiệm", suffix: "năm" },
  { value: "10k+", label: "Khách hàng", suffix: "khách" },
  { value: "50+", label: "Đối tác", suffix: "thương hiệu" },
  { value: "98%", label: "Hài lòng", suffix: "đánh giá" },
];
