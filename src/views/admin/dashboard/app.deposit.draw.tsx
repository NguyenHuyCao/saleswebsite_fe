// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { styled } from "@mui/material/styles";
import MuiDivider, { DividerProps } from "@mui/material/Divider";
import Image from "next/image";

interface DataType {
  logo: string;
  title: string;
  amount: string;
  subtitle: string;
  logoWidth: number;
  logoHeight: number;
}

const depositData: DataType[] = [
  {
    logoWidth: 28,
    logoHeight: 29,
    amount: "+$4,650",
    subtitle: "Bán UI Kit",
    title: "Tài khoản Gumroad",
    logo: "/images/logos/gumroad.png",
  },
  {
    logoWidth: 38,
    logoHeight: 38,
    amount: "+$92,705",
    title: "Mastercard",
    subtitle: "Nạp từ ví",
    logo: "/images/logos/mastercard-label.png",
  },
  {
    logoWidth: 20,
    logoHeight: 28,
    amount: "+$957",
    title: "Tài khoản Stripe",
    subtitle: "Ứng dụng iOS",
    logo: "/images/logos/stripe.png",
  },
  {
    logoWidth: 34,
    logoHeight: 32,
    amount: "+$6,837",
    title: "Ngân hàng Mỹ",
    subtitle: "Chuyển khoản ngân hàng",
    logo: "/images/logos/american-bank.png",
  },
  {
    logoWidth: 33,
    logoHeight: 22,
    amount: "+$446",
    title: "Tài khoản ngân hàng",
    subtitle: "Nạp từ ví",
    logo: "/images/logos/citi-bank.png",
  },
];

const withdrawData: DataType[] = [
  {
    logoWidth: 29,
    logoHeight: 30,
    amount: "-$145",
    title: "Google Adsense",
    subtitle: "Nạp vào Paypal",
    logo: "/images/logos/google.png",
  },
  {
    logoWidth: 34,
    logoHeight: 34,
    amount: "-$1870",
    title: "Github Enterprise",
    logo: "/images/logos/github.png",
    subtitle: "Bảo mật & tuân thủ",
  },
  {
    logoWidth: 30,
    logoHeight: 30,
    amount: "-$450",
    title: "Nâng cấp Slack",
    subtitle: "Nạp qua thẻ ghi nợ",
    logo: "/images/logos/slack.png",
  },
  {
    logoWidth: 30,
    logoHeight: 30,
    amount: "-$540",
    title: "Digital Ocean",
    subtitle: "Cloud Hosting",
    logo: "/images/logos/digital-ocean.png",
  },
  {
    logoWidth: 36,
    logoHeight: 21,
    amount: "-$21",
    title: "Tài khoản AWS",
    logo: "/images/logos/aws.png",
    subtitle: "Chọn nền tảng đám mây",
  },
];

const Divider = styled(MuiDivider)<DividerProps>(({ theme }) => ({
  margin: theme.spacing(5, 0),
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down("md")]: {
    borderRight: "none",
    margin: theme.spacing(0, 5),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const DepositWithdraw = () => {
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: ["column", "column", "row"],
      }}
    >
      <Box sx={{ width: "100%" }}>
        <CardHeader
          title="Nạp tiền"
          action={<Typography variant="caption">Xem tất cả</Typography>}
          titleTypographyProps={{
            variant: "h6",
            sx: {
              lineHeight: "1.6 !important",
              letterSpacing: "0.15px !important",
            },
          }}
        />
        <CardContent sx={{ pb: (theme) => `${theme.spacing(5.5)} !important` }}>
          {depositData.map((item, index) => (
            <Box
              key={item.title}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: index !== depositData.length - 1 ? 6 : 0,
              }}
            >
              <Box
                sx={{ minWidth: 38, display: "flex", justifyContent: "center" }}
              >
                <Image
                  src={item.logo}
                  alt={item.title}
                  width={item.logoWidth}
                  height={item.logoHeight}
                />
              </Box>
              <Box
                sx={{
                  ml: 4,
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    marginRight: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption">{item.subtitle}</Typography>
                </Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "success.main" }}
                >
                  {item.amount}
                </Typography>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Box>

      <Divider flexItem />

      <Box sx={{ width: "100%" }}>
        <CardHeader
          title="Rút tiền"
          action={<Typography variant="caption">Xem tất cả</Typography>}
          titleTypographyProps={{
            variant: "h6",
            sx: {
              lineHeight: "1.6 !important",
              letterSpacing: "0.15px !important",
            },
          }}
        />
        <CardContent sx={{ pb: (theme) => `${theme.spacing(5.5)} !important` }}>
          {withdrawData.map((item, index) => (
            <Box
              key={item.title}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: index !== withdrawData.length - 1 ? 6 : 0,
              }}
            >
              <Box
                sx={{ minWidth: 36, display: "flex", justifyContent: "center" }}
              >
                <Image
                  src={item.logo}
                  alt={item.title}
                  width={item.logoWidth}
                  height={item.logoHeight}
                />
              </Box>
              <Box
                sx={{
                  ml: 4,
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    marginRight: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption">{item.subtitle}</Typography>
                </Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "error.main" }}
                >
                  {item.amount}
                </Typography>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Box>
    </Card>
  );
};

export default DepositWithdraw;
