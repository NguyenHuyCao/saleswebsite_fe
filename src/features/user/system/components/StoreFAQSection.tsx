"use client";

import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Stack,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useState, useMemo } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SearchIcon from "@mui/icons-material/Search";

const faqs = [
  // Địa điểm & Giờ mở cửa
  {
    category: "Địa điểm",
    question: "Cửa hàng Cường Hoa nằm ở đâu?",
    answer:
      "Cửa hàng Cường Hoa tọa lạc tại 293 TL293, Nghĩa Phương, Lương Tài, Bắc Ninh. Bạn có thể dùng Google Maps tìm kiếm \"Cường Hoa\" hoặc nhấn nút \"Chỉ đường\" trên trang này để được dẫn đường trực tiếp.",
  },
  {
    category: "Địa điểm",
    question: "Giờ mở cửa của cửa hàng là mấy giờ?",
    answer:
      "Cửa hàng mở cửa từ Thứ 2 đến Thứ 7: 7:00 – 18:00. Chủ nhật: 7:00 – 17:00. Chúng tôi hoạt động tất cả các ngày trong tuần, kể cả ngày lễ (ngoại trừ Tết Nguyên Đán).",
  },
  {
    category: "Địa điểm",
    question: "Cửa hàng có bãi đỗ xe không?",
    answer:
      "Có, cửa hàng có bãi đỗ xe rộng rãi cho cả ô tô và xe máy. Bạn có thể đỗ xe miễn phí trong suốt thời gian ghé thăm.",
  },
  {
    category: "Địa điểm",
    question: "Tôi có thể đi phương tiện công cộng đến cửa hàng không?",
    answer:
      "Cửa hàng nằm trên tuyến đường TL293 nên khá thuận tiện di chuyển bằng xe máy hoặc ô tô. Nếu đến bằng xe buýt, bạn có thể xuống ở điểm gần nhất và đi bộ hoặc gọi xe công nghệ đến cửa hàng.",
  },
  // Sản phẩm & Tư vấn
  {
    category: "Sản phẩm",
    question: "Tôi có thể xem và thử sản phẩm trực tiếp trước khi mua không?",
    answer:
      "Hoàn toàn có thể! Showroom Cường Hoa trưng bày đầy đủ các dòng máy 2 thì như máy cắt cỏ, máy cưa xích, máy thổi lá, bơm nước... Nhân viên kỹ thuật sẽ demo sản phẩm thực tế để bạn cảm nhận trước khi quyết định mua.",
  },
  {
    category: "Sản phẩm",
    question: "Cửa hàng có sẵn hàng tất cả các sản phẩm trên website không?",
    answer:
      "Hầu hết các sản phẩm đều có sẵn tại cửa hàng. Tuy nhiên, một số model đặc biệt hoặc màu sắc cụ thể có thể cần đặt hàng trước 1–3 ngày. Bạn nên gọi điện xác nhận trước khi đến để không mất thời gian.",
  },
  {
    category: "Sản phẩm",
    question: "Cửa hàng bán những loại máy móc nào?",
    answer:
      "Cường Hoa chuyên cung cấp các dòng máy động cơ 2 thì chính hãng bao gồm: máy cắt cỏ, máy cưa xích, máy thổi lá, máy xới đất mini, máy bơm nước, và các phụ kiện kèm theo. Tất cả sản phẩm đều là hàng chính hãng có tem và hóa đơn đầy đủ.",
  },
  {
    category: "Sản phẩm",
    question: "Tôi muốn tư vấn chọn máy phù hợp, cửa hàng có hỗ trợ không?",
    answer:
      "Có. Đội ngũ kỹ thuật viên tại cửa hàng sẽ tư vấn miễn phí và chuyên sâu dựa trên nhu cầu sử dụng thực tế của bạn (diện tích, loại cây cỏ, địa hình...). Bạn cũng có thể gọi hotline 0392 923 392 để được tư vấn trước.",
  },
  // Mua hàng & Thanh toán
  {
    category: "Mua hàng",
    question: "Thanh toán tại cửa hàng chấp nhận những hình thức nào?",
    answer:
      "Cửa hàng chấp nhận: Tiền mặt, chuyển khoản ngân hàng, quẹt thẻ (Visa/Mastercard), ví điện tử (MoMo, ZaloPay, VNPay). Ngoài ra còn hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng một số ngân hàng.",
  },
  {
    category: "Mua hàng",
    question: "Tôi có thể đặt hàng online và đến cửa hàng lấy không?",
    answer:
      "Có, bạn hoàn toàn có thể đặt hàng trên website và chọn hình thức \"nhận tại cửa hàng\". Đơn hàng sẽ được giữ trong 24 giờ. Khi đến lấy, bạn chỉ cần cung cấp mã đơn hàng và CCCD để xác nhận.",
  },
  {
    category: "Mua hàng",
    question: "Cửa hàng có hỗ trợ trả góp không?",
    answer:
      "Có. Cường Hoa hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng các ngân hàng như VPBank, Techcombank, MB Bank, BIDV... Ngoài ra còn có hình thức trả góp qua công ty tài chính với điều kiện đơn giản.",
  },
  {
    category: "Mua hàng",
    question: "Mua hàng tại cửa hàng có rẻ hơn online không?",
    answer:
      "Giá tại cửa hàng và online là như nhau. Tuy nhiên, khi mua tại cửa hàng bạn có thể thương lượng để được tặng thêm phụ kiện như dây cắt, nhớt, kính bảo hộ... Đặc biệt khi mua combo nhiều sản phẩm sẽ được ưu đãi tốt hơn.",
  },
  // Giao hàng
  {
    category: "Giao hàng",
    question: "Mua tại cửa hàng có được giao hàng tận nơi không?",
    answer:
      "Có. Nếu bạn không thể mang về ngay (do kích thước hoặc số lượng), cửa hàng sẽ giao hàng tận nơi miễn phí trong bán kính 10 km. Ngoài bán kính, phí vận chuyển tính theo thực tế.",
  },
  {
    category: "Giao hàng",
    question: "Thời gian giao hàng từ cửa hàng mất bao lâu?",
    answer:
      "Với đơn hàng trong nội thành Bắc Ninh, thời gian giao hàng từ 2–4 giờ. Các tỉnh thành lân cận (Hà Nội, Hải Dương, Hưng Yên...) từ 1–2 ngày. Toàn quốc từ 2–5 ngày làm việc.",
  },
  // Bảo hành & Sửa chữa
  {
    category: "Bảo hành",
    question: "Chính sách bảo hành tại cửa hàng như thế nào?",
    answer:
      "Sản phẩm mua tại Cường Hoa được bảo hành từ 6 đến 12 tháng tùy theo thương hiệu và dòng máy. Bảo hành bao gồm lỗi kỹ thuật do nhà sản xuất. Không bảo hành hư hỏng do va đập, sử dụng sai cách, hay ngập nước.",
  },
  {
    category: "Bảo hành",
    question: "Tôi có thể mang máy cũ đến cửa hàng sửa chữa không?",
    answer:
      "Có. Cường Hoa nhận sửa chữa tất cả các dòng máy 2 thì, không giới hạn thương hiệu và không nhất thiết phải mua tại cửa hàng. Bạn mang máy đến, kỹ thuật viên sẽ kiểm tra miễn phí và báo giá trước khi tiến hành sửa.",
  },
  {
    category: "Bảo hành",
    question: "Thời gian sửa chữa trung bình mất bao lâu?",
    answer:
      "Tùy thuộc vào mức độ hỏng hóc và phụ tùng cần thay. Các lỗi nhỏ như vệ sinh bộ chế hòa khí, thay bugi, căn dây... thường hoàn thành trong 1–2 giờ. Lỗi phức tạp hoặc cần đặt phụ tùng có thể mất 1–3 ngày.",
  },
  {
    category: "Bảo hành",
    question: "Cửa hàng có bán phụ tùng thay thế không?",
    answer:
      "Có. Cường Hoa có sẵn kho phụ tùng chính hãng bao gồm: bugi, bộ chế hòa khí, ống dẫn dầu, lọc gió, dây kéo, nắp xăng, vòng bi, dây cắt cỏ, lưỡi cưa... Bạn có thể mua riêng để tự thay hoặc nhờ kỹ thuật viên.",
  },
  // Đổi trả
  {
    category: "Đổi trả",
    question: "Chính sách đổi trả sản phẩm tại cửa hàng ra sao?",
    answer:
      "Cường Hoa chấp nhận đổi trả trong 7 ngày kể từ ngày mua nếu sản phẩm bị lỗi kỹ thuật do nhà sản xuất. Điều kiện: còn nguyên tem niêm phong, không có dấu hiệu đã sử dụng, kèm hóa đơn mua hàng.",
  },
  {
    category: "Đổi trả",
    question: "Tôi muốn đổi sang sản phẩm khác vì không phù hợp, có được không?",
    answer:
      "Trong 7 ngày đầu, nếu sản phẩm chưa qua sử dụng và còn nguyên hộp, bạn có thể đổi sang sản phẩm khác có giá trị tương đương hoặc cao hơn (bù thêm tiền chênh lệch). Cửa hàng sẽ hỗ trợ tối đa trong khả năng có thể.",
  },
  // Dịch vụ đặc biệt
  {
    category: "Dịch vụ",
    question: "Cửa hàng có nhận thu mua máy cũ không?",
    answer:
      "Có. Cường Hoa nhận định giá và thu mua lại máy 2 thì cũ còn hoạt động. Bạn có thể mang máy đến cửa hàng để được kiểm tra và báo giá miễn phí. Giá thu mua phụ thuộc vào tình trạng thực tế của máy.",
  },
  {
    category: "Dịch vụ",
    question: "Có thể đặt lịch hẹn tư vấn kỹ thuật trước không?",
    answer:
      "Có. Bạn có thể gọi hotline 0392 923 392 để đặt lịch hẹn với kỹ thuật viên theo khung giờ mình muốn, tránh phải chờ đợi khi đến cửa hàng vào giờ cao điểm.",
  },
  {
    category: "Dịch vụ",
    question: "Cửa hàng có dịch vụ sửa chữa, bảo dưỡng tại nhà không?",
    answer:
      "Có. Trong bán kính 15 km từ cửa hàng, Cường Hoa cung cấp dịch vụ kỹ thuật viên đến tận nơi bảo dưỡng hoặc sửa chữa nhanh. Phí dịch vụ thượng môn: 50.000 – 100.000 đồng tùy khoảng cách. Liên hệ trước ít nhất 1 ngày.",
  },
];

const ITEMS_PER_PAGE = 8;

const categories = ["Tất cả", ...Array.from(new Set(faqs.map((f) => f.category)))];

const categoryColors: Record<string, string> = {
  "Tất cả": "#757575",
  "Địa điểm": "#2196f3",
  "Sản phẩm": "#4caf50",
  "Mua hàng": "#f25c05",
  "Giao hàng": "#9c27b0",
  "Bảo hành": "#ffb700",
  "Đổi trả": "#e91e63",
  "Dịch vụ": "#00bcd4",
};

export default function StoreFAQSection() {
  const [expanded, setExpanded] = useState<number | false>(false);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCat = selectedCategory === "Tất cả" || faq.category === selectedCategory;
      const matchSearch =
        !search ||
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentFaqs = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
    setExpanded(false);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    setExpanded(false);
  };

  return (
    <Box sx={{ py: 6 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <HelpOutlineIcon sx={{ color: "#f25c05", fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={800} color="#333">
            Câu hỏi thường gặp
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Giải đáp thắc mắc về hệ thống cửa hàng Cường Hoa
          </Typography>
        </Box>
      </Stack>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Tìm câu hỏi..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        size="small"
        sx={{ mb: 2, maxWidth: 480 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Category filter */}
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3, gap: 1 }}>
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            onClick={() => handleCategoryChange(cat)}
            sx={{
              fontWeight: 600,
              fontSize: "0.8rem",
              bgcolor: selectedCategory === cat ? categoryColors[cat] : "#f5f5f5",
              color: selectedCategory === cat ? "#fff" : "#333",
              border: `1px solid ${selectedCategory === cat ? categoryColors[cat] : "#e0e0e0"}`,
              "&:hover": {
                bgcolor: categoryColors[cat],
                color: "#fff",
                opacity: 0.9,
              },
            }}
          />
        ))}
      </Stack>

      {/* Count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Hiển thị {filtered.length} câu hỏi
        {selectedCategory !== "Tất cả" && ` trong mục "${selectedCategory}"`}
        {search && ` khớp với "${search}"`}
      </Typography>

      {/* FAQ List */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        {currentFaqs.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <HelpOutlineIcon sx={{ color: "#ccc", fontSize: 48 }} />
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Không tìm thấy câu hỏi phù hợp
            </Typography>
          </Box>
        ) : (
          currentFaqs.map((faq, idx) => {
            const globalIdx = (page - 1) * ITEMS_PER_PAGE + idx;
            return (
              <Accordion
                key={globalIdx}
                expanded={expanded === globalIdx}
                onChange={() => setExpanded(expanded === globalIdx ? false : globalIdx)}
                sx={{
                  mb: 1,
                  "&:before": { display: "none" },
                  boxShadow: "none",
                  border: "1px solid",
                  borderColor: expanded === globalIdx ? "#f25c05" : "#f0f0f0",
                  borderRadius: "8px !important",
                  "&:last-child": { mb: 0 },
                  transition: "border-color 0.2s",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: expanded === globalIdx ? "#f25c05" : "inherit" }} />}
                  sx={{ borderRadius: 2 }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Chip
                      label={faq.category}
                      size="small"
                      sx={{
                        bgcolor: categoryColors[faq.category] + "22",
                        color: categoryColors[faq.category],
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        flexShrink: 0,
                      }}
                    />
                    <Typography fontWeight={600} fontSize="0.95rem">
                      {faq.question}
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Typography
                    color="text.secondary"
                    lineHeight={1.8}
                    sx={{ pl: { xs: 0, sm: "68px" } }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })
        )}
      </Paper>

      {/* Pagination */}
      {totalPages > 1 && (
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ mt: 3 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Chip
              key={p}
              label={p}
              onClick={() => { setPage(p); setExpanded(false); }}
              sx={{
                fontWeight: 700,
                minWidth: 36,
                bgcolor: page === p ? "#f25c05" : "#f5f5f5",
                color: page === p ? "#fff" : "#333",
                cursor: "pointer",
                "&:hover": { bgcolor: page === p ? "#e64a19" : "#ffb700", color: "#fff" },
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
