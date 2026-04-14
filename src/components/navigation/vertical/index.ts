import Login from "mdi-material-ui/Login";
import HomeOutline from "mdi-material-ui/HomeOutline";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";

import { VerticalNavItemsType } from "src/@core/layouts/types";

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: "Thống kê",
      icon: HomeOutline,
      path: "/admin",
    },
    {
      title: "Liên hệ",
      icon: ContactsOutlinedIcon,
      path: "/admin/contacts",
    },
    {
      title: "Người dùng",
      icon: PeopleOutlinedIcon,
      path: "/admin/users",
    },
    {
      title: "Sản phẩm",
      icon: Inventory2OutlinedIcon,
      path: "/admin/products",
    },
    {
      title: "Đơn hàng",
      icon: ReceiptLongOutlinedIcon,
      path: "/admin/orders",
    },
    {
      title: "Thanh toán",
      icon: PaymentOutlinedIcon,
      path: "/admin/payments",
    },
    {
      title: "Danh mục",
      icon: CategoryOutlinedIcon,
      path: "/admin/categories",
    },
    {
      title: "Thương hiệu",
      icon: StorefrontOutlinedIcon,
      path: "/admin/brands",
    },
    {
      title: "Đơn vị vận chuyển",
      icon: LocalShippingOutlinedIcon,
      path: "/admin/shippings",
    },
    {
      title: "Khuyến mãi",
      icon: LocalOfferOutlinedIcon,
      path: "/admin/events",
    },
    {
      title: "Bảo hành",
      icon: VerifiedUserOutlinedIcon,
      path: "/admin/warranties",
    },
    {
      title: "Tin tức",
      icon: ArticleOutlinedIcon,
      path: "/admin/news",
    },
    {
      sectionTitle: "Điều hướng",
    },
    {
      title: "Đăng xuất",
      icon: Login,
      path: "/login",
    },
    {
      title: "Trang chủ",
      icon: HomeOutlinedIcon,
      path: "/",
    },
  ];
};

export default navigation;
