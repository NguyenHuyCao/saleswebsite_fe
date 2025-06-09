"use client";

import {
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
  Stack,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { visuallyHidden } from "@mui/utils";
import { chartsGridClasses, LineChart } from "@mui/x-charts";

// Dữ liệu biểu đồ
const data = [58, 115, 28, 83, 63, 75, 35];
const labels = ["Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"];

// Chấm tròn trạng thái đơn hàng
function Dot({
  color = "primary",
  size = 8,
  variant,
  sx,
}: {
  color?: string;
  size?: number;
  variant?: "outlined" | "filled";
  sx?: any;
}) {
  const theme = useTheme();
  const colorMap =
    theme.palette[color as keyof typeof theme.palette] || theme.palette.primary;
  const main = colorMap.main || colorMap[500];

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        ...(variant === "outlined"
          ? { border: `1px solid ${main}` }
          : { bgcolor: main }),
        ...sx,
      }}
    />
  );
}

// Kiểu dữ liệu đơn hàng
interface Data {
  tracking_no: number;
  name: string;
  fat: number;
  carbs: number;
  protein: number;
}

function createData(
  tracking_no: number,
  name: string,
  fat: number,
  carbs: number,
  protein: number
): Data {
  return { tracking_no, name, fat, carbs, protein };
}

// Dữ liệu mẫu
const rows: Data[] = [
  createData(84564564, "Ống kính máy ảnh", 40, 2, 40570),
  createData(98764564, "Laptop", 300, 0, 180139),
  createData(98756325, "Điện thoại", 355, 1, 90989),
  createData(98652366, "Tai nghe", 50, 1, 10239),
  createData(13286564, "Phụ kiện máy tính", 100, 1, 83348),
  createData(86739658, "TV", 99, 0, 410780),
  createData(13256498, "Bàn phím", 125, 2, 70999),
  createData(98753263, "Chuột", 89, 2, 10570),
  createData(987532963, "Chuột không dây", 89, 2, 10570),
];

const headCells = [
  { id: "tracking_no", align: "left", label: "Mã đơn" },
  { id: "name", align: "left", label: "Sản phẩm" },
  { id: "fat", align: "right", label: "Số lượng" },
  { id: "carbs", align: "left", label: "Trạng thái" },
  { id: "protein", align: "right", label: "Tổng tiền" },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<Key extends keyof any>(
  order: "asc" | "desc",
  orderBy: Key
) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Hiển thị trạng thái đơn hàng
function OrderStatus({ status }: { status: number }) {
  const map = [
    { color: "warning", label: "Đang xử lý" },
    { color: "success", label: "Đã duyệt" },
    { color: "error", label: "Từ chối" },
  ];
  const item = map[status] || { color: "primary", label: "Không rõ" };
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={item.color} />
      <Typography variant="body2">{item.label}</Typography>
    </Stack>
  );
}

// Format tiền
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

// Biểu đồ báo cáo
export function ReportAreaChart() {
  const theme = useTheme();
  const axisFontStyle = { fill: theme.palette.text.secondary };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Báo cáo phân tích
      </Typography>
      <List sx={{ p: 0, "& .MuiListItemButton-root": { py: 2 } }}>
        <ListItemButton divider>
          <ListItemText primary="Tăng trưởng tài chính công ty" />
          <Typography variant="h5">+45.14%</Typography>
        </ListItemButton>
        <ListItemButton divider>
          <ListItemText primary="Tỷ lệ chi phí doanh nghiệp" />
          <Typography variant="h5">0.58%</Typography>
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Tình trạng rủi ro kinh doanh" />
          <Typography variant="h5">Thấp</Typography>
        </ListItemButton>
      </List>
      <LineChart
        grid={{ horizontal: true }}
        xAxis={[
          {
            data: labels,
            scaleType: "point",
            disableLine: true,
            disableTicks: true,
            tickLabelStyle: axisFontStyle,
          },
        ]}
        yAxis={[{ tickMaxStep: 10 }]}
        leftAxis={null}
        series={[
          {
            data,
            showMark: false,
            id: "ReportAreaChart",
            color: theme.palette.warning.main,
            label: "Chuỗi dữ liệu",
          },
        ]}
        slotProps={{ legend: { hidden: true } }}
        height={340}
        margin={{ top: 30, bottom: 50, left: 20, right: 20 }}
        sx={{
          "& .MuiLineElement-root": { strokeWidth: 1 },
          [`& .${chartsGridClasses.line}`]: { strokeDasharray: "5 3" },
        }}
      />
    </Card>
  );
}

// Bảng đơn hàng
export default function OrderTable() {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("tracking_no");

  const sortedRows = useMemo(
    () => [...rows].sort(getComparator(order, orderBy)),
    [order, orderBy]
  );

  const handleSort = (property: keyof Data) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Đơn hàng mới
      </Typography>
      <TableContainer sx={{ maxHeight: 463, overflowY: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.align}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={() => handleSort(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id && (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc" ? "giảm dần" : "tăng dần"}
                      </Box>
                    )}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={`${row.tracking_no}-${row.name}`} hover>
                <TableCell>
                  <Link color="secondary">{row.tracking_no}</Link>
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell>
                  <OrderStatus status={row.carbs} />
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(row.protein)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
