import Login from "mdi-material-ui/Login";
import HomeOutline from "mdi-material-ui/HomeOutline";
import AccountCogOutline from "mdi-material-ui/AccountCogOutline";
import AccountPlusOutline from "mdi-material-ui/AccountPlusOutline";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

// ** Type import
import { VerticalNavItemsType } from "src/@core/layouts/types";

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: "Dashboard",
      icon: HomeOutline,
      path: "/admin",
    },
    // {
    //   title: "Account",
    //   icon: AccountCogOutline,
    //   path: "/admin/account-settings",
    // },
    {
      title: "Contact",
      icon: ContactsOutlinedIcon,
      path: "/admin/contacts",
    },
    {
      title: "User",
      icon: PersonOutlineOutlinedIcon,
      path: "/admin/users",
    },
    {
      title: "Product",
      icon: Inventory2OutlinedIcon,
      path: "/admin/products",
    },
    {
      title: "Order",
      icon: AccountCogOutline,
      path: "/admin/orders",
    },
    {
      title: "Catogory",
      icon: CategoryOutlinedIcon,
      path: "/admin/categories",
    },
    {
      title: "Brand",
      icon: LabelOutlinedIcon,
      path: "/admin/brands",
    },
    {
      title: "Shipping",
      icon: LocalShippingOutlinedIcon,
      path: "/admin/shippings",
    },
    {
      sectionTitle: "Pages",
    },
    {
      title: "Login",
      icon: Login,
      path: "/pages/login",
      openInNewTab: true,
    },
    {
      title: "Register",
      icon: AccountPlusOutline,
      path: "/admin/pages/register",
      openInNewTab: true,
    },
    {
      title: "Home",
      icon: HomeOutlinedIcon,
      path: "/",
    },
  ];
};

export default navigation;
