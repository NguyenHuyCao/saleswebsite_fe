"use client";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Card,
  Divider,
} from "@mui/material";
import { LineChart, chartsGridClasses } from "@mui/x-charts";
import { useTheme } from "@mui/material/styles";

// Biểu đồ đường thể hiện dữ liệu tăng trưởng
const ReportChart = () => {
  const theme = useTheme();
  const data = [58, 115, 28, 83, 63, 75, 35];
  const labels = ["Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"];
  const axisStyle = { fill: theme.palette.text.secondary };

  return (
    <Box sx={{ px: 3, pt: 1 }}>
      <LineChart
        grid={{ horizontal: true }}
        xAxis={[
          {
            data: labels,
            scaleType: "point",
            disableLine: true,
            disableTicks: true,
            tickLabelStyle: axisStyle,
          },
        ]}
        yAxis={[{ tickMaxStep: 10 }]}
        series={[
          {
            data,
            showMark: false,
            id: "report-series",
            color: theme.palette.warning.main,
            label: "Dữ liệu báo cáo",
          },
        ]}
        slotProps={{ legend: { hidden: true } }}
        height={260}
        margin={{ top: 20, bottom: 30, left: 20, right: 20 }}
        sx={{
          "& .MuiLineElement-root": { strokeWidth: 2 },
          [`& .${chartsGridClasses.line}`]: { strokeDasharray: "5 3" },
        }}
      />
    </Box>
  );
};

export default function DashboardDefault() {
  return (
    <Box>
      <Card sx={{ px: 2, py: 3, height: "100%" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Báo cáo phân tích
        </Typography>
        <List sx={{ p: 0 }}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Tăng trưởng tài chính công ty" />
              <Typography variant="h6" color="success.main">
                +45.14%
              </Typography>
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Tỷ lệ chi phí doanh nghiệp" />
              <Typography variant="h6" color="primary.main">
                0.58%
              </Typography>
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Rủi ro kinh doanh" />
              <Typography variant="h6" color="warning.main">
                Thấp
              </Typography>
            </ListItemButton>
          </ListItem>
        </List>
        <ReportChart />
      </Card>
    </Box>
  );
}
