import Login from "mdi-material-ui/Login";
import HomeOutline from "mdi-material-ui/HomeOutline";
import AccountCogOutline from "mdi-material-ui/AccountCogOutline";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import { VerticalNavItemsType } from "src/@core/layouts/types";

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: "Thống kê",
      icon: HomeOutline,
      path: "/admin",
    },
    // {
    //   title: "Account",
    //   icon: AccountCogOutline,
    //   path: "/admin/account-settings",
    // },
    {
      title: "Liên hệ",
      icon: ContactsOutlinedIcon,
      path: "/admin/contacts",
    },
    {
      title: "Người dùng",
      icon: PersonOutlineOutlinedIcon,
      path: "/admin/users",
    },
    {
      title: "Sản phẩm",
      icon: Inventory2OutlinedIcon,
      path: "/admin/products",
    },
    {
      title: "Đơn hàng",
      icon: AccountCogOutline,
      path: "/admin/orders",
    },
    {
      title: "Danh mục",
      icon: CategoryOutlinedIcon,
      path: "/admin/categories",
    },
    {
      title: "Thương hiệu",
      icon: LabelOutlinedIcon,
      path: "/admin/brands",
    },
    {
      title: "Đơn vị vận chuyển",
      icon: LocalShippingOutlinedIcon,
      path: "/admin/shippings",
    },
    {
      title: "Khuyến mãi",
      icon: LocalShippingOutlinedIcon,
      path: "/admin/events",
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
