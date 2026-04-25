"use client";

import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Tab,
  Tabs,
  Paper,
  Container,
  Pagination,
  Alert,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import BuildIcon from "@mui/icons-material/Build";
import PersonIcon from "@mui/icons-material/Person";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StarIcon from "@mui/icons-material/Star";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { motion, AnimatePresence } from "framer-motion";
import React, { useMemo, useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";

interface FAQ {
  question: string;
  answer: React.ReactNode;
  category: string;
}

const ITEMS_PER_PAGE = 7;

const categoryMeta: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  "Tất cả":    { label: "Tất cả",      icon: <HelpOutlineIcon fontSize="small" />,        color: "#757575" },
  "Đặt hàng":  { label: "Đặt hàng",    icon: <ShoppingCartIcon fontSize="small" />,       color: "#f25c05" },
  "Thanh toán": { label: "Thanh toán",  icon: <PaymentIcon fontSize="small" />,            color: "#4caf50" },
  "Giao hàng": { label: "Giao hàng",   icon: <LocalShippingIcon fontSize="small" />,      color: "#2196f3" },
  "Bảo hành":  { label: "Bảo hành",    icon: <VerifiedIcon fontSize="small" />,           color: "#9c27b0" },
  "Đổi trả":   { label: "Đổi trả",     icon: <AssignmentReturnIcon fontSize="small" />,   color: "#ff9800" },
  "Sản phẩm":  { label: "Sản phẩm",    icon: <BuildIcon fontSize="small" />,              color: "#00bcd4" },
  "Tài khoản": { label: "Tài khoản",   icon: <PersonIcon fontSize="small" />,             color: "#795548" },
  "Khuyến mãi":{ label: "Khuyến mãi",  icon: <LocalOfferIcon fontSize="small" />,         color: "#e91e63" },
  "Đánh giá":  { label: "Đánh giá",    icon: <StarIcon fontSize="small" />,               color: "#ffb700" },
  "Kỹ thuật":  { label: "Kỹ thuật",    icon: <HeadsetMicIcon fontSize="small" />,         color: "#607d8b" },
};

const faqList: FAQ[] = [
  // ── ĐẶT HÀNG ───────────────────────────────────────────────────────────────
  {
    category: "Đặt hàng",
    question: "Làm thế nào để đặt hàng trên website?",
    answer: (
      <>
        Chọn sản phẩm → nhấn <b>Thêm vào giỏ</b> → vào <b>Giỏ hàng</b> → chọn sản phẩm cần mua →
        nhấn <b>Đặt hàng</b> → điền thông tin giao hàng → chọn phương thức thanh toán → xác nhận.
        Bạn cũng có thể đặt qua hotline <b>0392 923 392</b> nếu cần hỗ trợ.
      </>
    ),
  },
  {
    category: "Đặt hàng",
    question: "Tôi có thể đặt nhiều sản phẩm trong một đơn hàng không?",
    answer:
      "Có. Bạn có thể thêm bao nhiêu sản phẩm tuỳ ý vào giỏ hàng rồi chọn một phần hoặc tất cả để thanh toán trong cùng một đơn.",
  },
  {
    category: "Đặt hàng",
    question: "Tôi có thể hủy đơn hàng sau khi đặt không?",
    answer: (
      <>
        Đơn hàng có thể hủy khi còn ở trạng thái <b>Chờ xác nhận</b> hoặc <b>Chờ thanh toán</b>.
        Sau khi đơn đã được xác nhận và chuyển sang trạng thái <b>Đang giao</b>, bạn cần liên hệ
        trực tiếp hotline <b>0392 923 392</b> để được hỗ trợ.
      </>
    ),
  },
  {
    category: "Đặt hàng",
    question: "Làm sao để theo dõi trạng thái đơn hàng?",
    answer: (
      <>
        Đăng nhập vào tài khoản → vào <b>Lịch sử đơn hàng</b>. Bạn sẽ thấy trạng thái đơn hàng
        theo các bước: <em>Chờ xác nhận → Chờ thanh toán → Đã xác nhận → Đang giao → Đã giao</em>.
        Ngoài ra, chúng tôi sẽ thông báo qua email và thông báo trong ứng dụng khi trạng thái thay đổi.
      </>
    ),
  },
  {
    category: "Đặt hàng",
    question: "Tôi chưa có tài khoản có đặt hàng được không?",
    answer:
      "Hiện tại website yêu cầu đăng nhập để đặt hàng, giúp bạn theo dõi đơn hàng và bảo hành dễ dàng hơn. Đăng ký chỉ mất 1 phút bằng email hoặc tài khoản Google/Facebook.",
  },
  {
    category: "Đặt hàng",
    question: "Tôi có thể thay đổi địa chỉ sau khi đặt hàng không?",
    answer:
      "Bạn chỉ có thể yêu cầu thay đổi địa chỉ khi đơn hàng chưa được chuyển cho đơn vị vận chuyển. Hãy liên hệ hotline 0392 923 392 càng sớm càng tốt để được hỗ trợ điều chỉnh.",
  },

  // ── THANH TOÁN ──────────────────────────────────────────────────────────────
  {
    category: "Thanh toán",
    question: "Website hỗ trợ những hình thức thanh toán nào?",
    answer: (
      <Stack spacing={0.5}>
        <Typography variant="body2">Cường Hoa hỗ trợ 4 phương thức thanh toán:</Typography>
        <Typography variant="body2">• <b>COD</b> — Thanh toán tiền mặt khi nhận hàng</Typography>
        <Typography variant="body2">• <b>Chuyển khoản ngân hàng</b> — Quét mã QR hoặc chuyển thủ công</Typography>
        <Typography variant="body2">• <b>Ví Momo</b> — Thanh toán qua ứng dụng Momo</Typography>
        <Typography variant="body2">• <b>VNPay</b> — Thanh toán qua cổng VNPay (thẻ ATM, Visa, MasterCard)</Typography>
      </Stack>
    ),
  },
  {
    category: "Thanh toán",
    question: "Thanh toán COD hoạt động như thế nào?",
    answer:
      "Bạn chọn 'Thanh toán khi nhận hàng (COD)' lúc đặt đơn. Khi shipper giao hàng, bạn kiểm tra sản phẩm rồi trả tiền mặt trực tiếp. Phương thức này áp dụng cho tất cả đơn hàng nội địa.",
  },
  {
    category: "Thanh toán",
    question: "Chuyển khoản ngân hàng thì chuyển vào đâu?",
    answer: (
      <>
        Sau khi đặt hàng, hệ thống sẽ hiển thị thông tin tài khoản và mã QR để quét. Vui lòng ghi
        đúng <b>nội dung chuyển khoản</b> theo mã đơn hàng (ví dụ: <em>ORD-20240315-00001</em>)
        để hệ thống tự động xác nhận. Nếu quên nội dung, liên hệ hotline để xác nhận thủ công.
      </>
    ),
  },
  {
    category: "Thanh toán",
    question: "Tôi đã thanh toán nhưng đơn hàng vẫn chưa được xác nhận?",
    answer:
      "Với chuyển khoản ngân hàng, hệ thống thường xác nhận tự động trong vài phút. Nếu sau 30 phút vẫn chưa cập nhật, vui lòng chụp màn hình giao dịch và liên hệ hotline 0392 923 392 hoặc email support@cuonghoa.vn để được xử lý nhanh.",
  },
  {
    category: "Thanh toán",
    question: "Thanh toán qua Momo và VNPay có an toàn không?",
    answer:
      "Hoàn toàn an toàn. Momo và VNPay là các cổng thanh toán được Ngân hàng Nhà nước Việt Nam cấp phép, sử dụng mã hóa SSL tiêu chuẩn. Cường Hoa không lưu trữ thông tin thẻ hay tài khoản ngân hàng của bạn.",
  },
  {
    category: "Thanh toán",
    question: "Tôi có được hoàn tiền nếu thanh toán trực tuyến mà hủy đơn?",
    answer:
      "Có. Nếu đơn hàng đủ điều kiện hủy, tiền sẽ được hoàn trả về nguồn thanh toán ban đầu (ví Momo, tài khoản ngân hàng...) trong vòng 3–7 ngày làm việc tùy ngân hàng/ví điện tử.",
  },

  // ── GIAO HÀNG ───────────────────────────────────────────────────────────────
  {
    category: "Giao hàng",
    question: "Thời gian giao hàng là bao lâu?",
    answer: (
      <Stack spacing={0.5}>
        <Typography variant="body2">• <b>Bắc Ninh và vùng lân cận</b>: 1–2 ngày làm việc</Typography>
        <Typography variant="body2">• <b>Hà Nội, TP.HCM, Đà Nẵng</b>: 2–3 ngày làm việc</Typography>
        <Typography variant="body2">• <b>Tỉnh xa, vùng sâu</b>: 4–7 ngày làm việc</Typography>
        <Typography variant="body2" color="text.secondary">
          Thời gian trên chỉ tính ngày làm việc, không bao gồm ngày lễ, Tết.
        </Typography>
      </Stack>
    ),
  },
  {
    category: "Giao hàng",
    question: "Phí vận chuyển được tính như thế nào?",
    answer:
      "Phí vận chuyển phụ thuộc vào địa chỉ nhận hàng, kích thước và trọng lượng sản phẩm. Phí cụ thể sẽ hiển thị tại bước thanh toán trước khi bạn xác nhận đơn. Đơn hàng trên 3 triệu đồng được miễn phí vận chuyển.",
  },
  {
    category: "Giao hàng",
    question: "Có những phương thức giao hàng nào?",
    answer: (
      <Stack spacing={0.5}>
        <Typography variant="body2">• <b>Giao tận nơi</b> — Shipper giao đến địa chỉ của bạn</Typography>
        <Typography variant="body2">• <b>Gửi nhà xe</b> — Gửi qua nhà xe, nhận tại bến xe gần nhất</Typography>
        <Typography variant="body2">• <b>Đơn vị vận chuyển</b> — Qua GHN, GHTK hoặc đơn vị ủy quyền</Typography>
        <Typography variant="body2">• <b>Nhận tại showroom</b> — Đến tận cửa hàng tại Bắc Ninh nhận hàng</Typography>
      </Stack>
    ),
  },
  {
    category: "Giao hàng",
    question: "Làm sao để theo dõi vận chuyển?",
    answer:
      "Sau khi đơn hàng được giao cho đơn vị vận chuyển, bạn sẽ nhận được mã vận đơn qua thông báo trong tài khoản. Truy cập trang Đơn hàng của tôi để xem trạng thái vận chuyển cập nhật theo thời gian thực từ GHN/GHTK.",
  },
  {
    category: "Giao hàng",
    question: "Hàng bị hư hỏng hoặc thiếu trong quá trình vận chuyển thì xử lý như thế nào?",
    answer:
      "Vui lòng quay video khi mở hàng (unboxing) để làm bằng chứng. Nếu phát hiện hàng hư hỏng hoặc thiếu, liên hệ ngay hotline 0392 923 392 trong vòng 24 giờ kể từ khi nhận hàng. Chúng tôi sẽ xử lý đổi hàng hoặc hoàn tiền trong thời gian sớm nhất.",
  },
  {
    category: "Giao hàng",
    question: "Tôi có thể đến showroom nhận hàng trực tiếp không?",
    answer:
      "Có. Bạn chọn hình thức 'Nhận tại cửa hàng' khi đặt đơn hoặc liên hệ trước qua hotline 0392 923 392. Showroom tại 293 TL293, Nghĩa Phương, Bắc Ninh, mở cửa từ 7:00–18:00 mỗi ngày.",
  },

  // ── BẢO HÀNH ────────────────────────────────────────────────────────────────
  {
    category: "Bảo hành",
    question: "Chính sách bảo hành là bao lâu?",
    answer:
      "Tất cả sản phẩm được bảo hành chính hãng tối đa 12 tháng kể từ ngày giao hàng thực tế (không phải ngày đặt hàng). Thời gian bảo hành cụ thể phụ thuộc vào từng dòng sản phẩm và thương hiệu, được ghi rõ trên trang chi tiết sản phẩm.",
  },
  {
    category: "Bảo hành",
    question: "Bảo hành tính từ ngày nào?",
    answer: (
      <>
        Thời gian bảo hành được tính từ <b>ngày giao hàng thành công</b> (ngày đơn hàng chuyển sang
        trạng thái "Đã giao"), không phải ngày đặt hàng hay ngày thanh toán. Hệ thống tự động ghi
        nhận ngày bắt đầu bảo hành khi đơn hàng hoàn thành.
      </>
    ),
  },
  {
    category: "Bảo hành",
    question: "Quy trình yêu cầu bảo hành như thế nào?",
    answer: (
      <Stack spacing={0.5}>
        <Typography variant="body2">1. Vào trang <b>Bảo hành</b> → nhập mã đơn hàng và tên sản phẩm</Typography>
        <Typography variant="body2">2. Mô tả chi tiết lỗi và đính kèm ảnh/video (tối đa 3 ảnh)</Typography>
        <Typography variant="body2">3. Gửi yêu cầu — hệ thống cấp mã bảo hành (BH-XXXXXXXX-XXXXX)</Typography>
        <Typography variant="body2">4. Đội kỹ thuật xem xét và phản hồi trong 1–2 ngày làm việc</Typography>
        <Typography variant="body2">5. Thực hiện sửa chữa/đổi máy theo kết quả duyệt</Typography>
      </Stack>
    ),
  },
  {
    category: "Bảo hành",
    question: "Những trường hợp nào không được bảo hành?",
    answer: (
      <Stack spacing={0.5}>
        <Typography variant="body2">• Sử dụng sai cách, không đúng hướng dẫn kỹ thuật</Typography>
        <Typography variant="body2">• Hư hỏng do va đập, rơi vỡ, cháy nổ từ bên ngoài</Typography>
        <Typography variant="body2">• Đã tự ý tháo lắp, sửa chữa không qua trung tâm ủy quyền</Typography>
        <Typography variant="body2">• Hết thời hạn bảo hành theo hợp đồng</Typography>
        <Typography variant="body2">• Hư hỏng do thiên tai, hỏa hoạn, ngập nước</Typography>
      </Stack>
    ),
  },
  {
    category: "Bảo hành",
    question: "Làm sao để tra cứu thông tin bảo hành?",
    answer: (
      <>
        Vào trang <b>Bảo hành</b> trên website, nhập mã đơn hàng và tên sản phẩm để tra cứu thông
        tin bảo hành và lịch sử yêu cầu bảo hành của bạn. Bạn cũng có thể xem danh sách toàn bộ
        yêu cầu bảo hành trong phần <b>Tài khoản của tôi</b>.
      </>
    ),
  },
  {
    category: "Bảo hành",
    question: "Bảo hành tại chỗ hay phải mang máy đến?",
    answer:
      "Tùy tính chất lỗi. Đối với lỗi nhỏ, đội kỹ thuật có thể hướng dẫn xử lý từ xa qua điện thoại. Trường hợp cần kiểm tra trực tiếp, bạn mang máy đến showroom tại Bắc Ninh hoặc liên hệ để đội kỹ thuật đến tận nơi (áp dụng khu vực gần).",
  },

  // ── ĐỔI TRẢ ─────────────────────────────────────────────────────────────────
  {
    category: "Đổi trả",
    question: "Chính sách đổi trả như thế nào?",
    answer: (
      <Stack spacing={0.5}>
        <Typography variant="body2">• <b>Đổi hàng lỗi do vận chuyển</b>: trong 24h kể từ khi nhận hàng (cần video unboxing)</Typography>
        <Typography variant="body2">• <b>Lỗi kỹ thuật từ nhà sản xuất</b>: xử lý qua quy trình bảo hành</Typography>
        <Typography variant="body2">• Hàng phải còn nguyên hộp, đầy đủ phụ kiện và hóa đơn</Typography>
        <Typography variant="body2" color="error.main">• Không áp dụng đổi trả với hàng đã sử dụng bình thường và không lỗi</Typography>
      </Stack>
    ),
  },
  {
    category: "Đổi trả",
    question: "Tôi muốn hoàn tiền thì làm thế nào?",
    answer:
      "Gửi yêu cầu hoàn tiền trong phần chi tiết đơn hàng, nêu rõ lý do và số lượng sản phẩm muốn hoàn. Đội hỗ trợ sẽ xem xét và xác nhận trong vòng 1–2 ngày làm việc. Sau khi duyệt, tiền được hoàn về nguồn thanh toán ban đầu.",
  },
  {
    category: "Đổi trả",
    question: "Thời gian hoàn tiền là bao lâu?",
    answer: (
      <Stack spacing={0.5}>
        <Typography variant="body2">• <b>Ví Momo / ZaloPay</b>: 1–3 ngày làm việc</Typography>
        <Typography variant="body2">• <b>VNPay / thẻ ngân hàng</b>: 3–7 ngày làm việc</Typography>
        <Typography variant="body2">• <b>Chuyển khoản ngân hàng</b>: 3–5 ngày làm việc</Typography>
        <Typography variant="body2">• <b>COD</b>: chuyển khoản lại theo thông tin bạn cung cấp trong 3–5 ngày</Typography>
      </Stack>
    ),
  },
  {
    category: "Đổi trả",
    question: "Ai chịu phí vận chuyển khi đổi trả hàng?",
    answer:
      "Nếu lỗi do Cường Hoa hoặc nhà sản xuất, chúng tôi chịu toàn bộ phí vận chuyển đổi trả. Nếu khách hàng đổi trả vì lý do cá nhân (không thích, đặt nhầm), khách chịu phí vận chuyển chiều về.",
  },

  // ── SẢN PHẨM ────────────────────────────────────────────────────────────────
  {
    category: "Sản phẩm",
    question: "Cường Hoa phân phối những thương hiệu máy nào?",
    answer:
      "Cường Hoa là đại lý ủy quyền phân phối các thương hiệu máy 2 thì chính hãng bao gồm: Honda, Husqvarna, STIHL, Maruyama. Tất cả sản phẩm đều có tem chính hãng và hóa đơn đầy đủ.",
  },
  {
    category: "Sản phẩm",
    question: "Cửa hàng có bán những loại máy gì?",
    answer: (
      <Stack spacing={0.5}>
        <Typography variant="body2">• Máy cắt cỏ 2 thì (vai đeo, đẩy tay)</Typography>
        <Typography variant="body2">• Máy cưa xích</Typography>
        <Typography variant="body2">• Máy phun thuốc trừ sâu</Typography>
        <Typography variant="body2">• Máy phát điện</Typography>
        <Typography variant="body2">• Phụ kiện và linh kiện thay thế</Typography>
      </Stack>
    ),
  },
  {
    category: "Sản phẩm",
    question: "Làm sao để chọn máy phù hợp với nhu cầu?",
    answer:
      "Liên hệ hotline 0392 923 392 hoặc gửi form tư vấn trên trang này — đội ngũ kỹ thuật sẽ tư vấn dựa trên: diện tích sử dụng, địa hình, tần suất dùng và ngân sách. Bạn cũng có thể đến showroom để được tư vấn và xem máy chạy thực tế.",
  },
  {
    category: "Sản phẩm",
    question: "Sản phẩm trên web có phải hàng chính hãng không?",
    answer:
      "100% hàng chính hãng. Cường Hoa là đại lý phân phối ủy quyền, nhập hàng trực tiếp từ nhà sản xuất và nhà phân phối chính thức tại Việt Nam. Mỗi sản phẩm đều có tem chống giả, hóa đơn VAT và phiếu bảo hành chính hãng.",
  },
  {
    category: "Sản phẩm",
    question: "Sản phẩm hiển thị trên web nhưng tôi muốn biết còn hàng không?",
    answer:
      "Tình trạng tồn kho được hiển thị trực tiếp trên trang sản phẩm. Nếu nút 'Thêm vào giỏ' bị mờ, sản phẩm đang hết hàng. Bạn có thể liên hệ hotline để hỏi ngày có hàng trở lại hoặc đặt trước.",
  },
  {
    category: "Sản phẩm",
    question: "Tôi có thể xem và dùng thử máy trước khi mua không?",
    answer:
      "Có. Bạn đến showroom 293 TL293, Nghĩa Phương, Bắc Ninh (7:00–18:00, tất cả các ngày) để xem trực tiếp và thử máy với sự hỗ trợ của nhân viên kỹ thuật. Nên gọi trước hotline 0392 923 392 để đặt lịch và đảm bảo có nhân viên tư vấn riêng.",
  },

  // ── TÀI KHOẢN ────────────────────────────────────────────────────────────────
  {
    category: "Tài khoản",
    question: "Tôi có thể đăng nhập bằng Google hoặc Facebook không?",
    answer:
      "Có. Nhấn nút 'Đăng nhập với Google' hoặc 'Đăng nhập với Facebook' trên trang đăng nhập. Lần đầu đăng nhập qua mạng xã hội, bạn sẽ cần hoàn thiện thêm số điện thoại để hoàn tất hồ sơ.",
  },
  {
    category: "Tài khoản",
    question: "Tôi quên mật khẩu thì làm thế nào?",
    answer: (
      <>
        Nhấn <b>Quên mật khẩu</b> trên trang đăng nhập → nhập email đã đăng ký → kiểm tra hộp thư
        để nhận link đặt lại mật khẩu (hiệu lực 15 phút). Nếu không thấy email, kiểm tra thư mục
        Spam hoặc liên hệ hotline.
      </>
    ),
  },
  {
    category: "Tài khoản",
    question: "Mật khẩu phải có yêu cầu gì?",
    answer: (
      <Stack spacing={0.5}>
        <Typography variant="body2">Mật khẩu phải đảm bảo:</Typography>
        <Typography variant="body2">• Tối thiểu <b>8 ký tự</b></Typography>
        <Typography variant="body2">• Ít nhất <b>1 chữ hoa</b> và <b>1 chữ thường</b></Typography>
        <Typography variant="body2">• Ít nhất <b>1 chữ số</b></Typography>
        <Typography variant="body2">• Ít nhất <b>1 ký tự đặc biệt</b> (!@#$%...)</Typography>
      </Stack>
    ),
  },
  {
    category: "Tài khoản",
    question: "Tôi có thể xem lịch sử đơn hàng và bảo hành ở đâu?",
    answer:
      "Đăng nhập → vào trang Tài khoản của tôi. Tại đây bạn có thể xem: lịch sử đơn hàng, trạng thái bảo hành, danh sách yêu thích, và tổng chi tiêu. Mọi thông tin được cập nhật theo thời gian thực.",
  },
  {
    category: "Tài khoản",
    question: "Thông tin cá nhân của tôi có được bảo mật không?",
    answer:
      "Hoàn toàn bảo mật. Cường Hoa cam kết không chia sẻ thông tin cá nhân (tên, email, số điện thoại) cho bên thứ ba. Dữ liệu được mã hóa và lưu trữ an toàn theo tiêu chuẩn bảo mật thông tin.",
  },

  // ── KHUYẾN MÃI ──────────────────────────────────────────────────────────────
  {
    category: "Khuyến mãi",
    question: "Flash sale là gì? Diễn ra như thế nào?",
    answer:
      "Flash sale là chương trình giảm giá sâu trong thời gian ngắn (thường vài giờ đến 1 ngày) cho một số sản phẩm chọn lọc. Flash sale tự động áp dụng — không cần nhập mã — và chỉ áp dụng khi còn hàng và còn thời gian khuyến mãi.",
  },
  {
    category: "Khuyến mãi",
    question: "Làm sao để biết có chương trình khuyến mãi mới?",
    answer:
      "Theo dõi trang Khuyến mãi trên website, hoặc theo dõi Facebook và Zalo OA của Cường Hoa để cập nhật nhanh nhất. Bạn cũng sẽ nhận thông báo qua email nếu đã có tài khoản.",
  },
  {
    category: "Khuyến mãi",
    question: "Voucher có thể kết hợp với flash sale không?",
    answer:
      "Flash sale không kết hợp với các flash sale khác. Tuy nhiên, một số chương trình khuyến mãi thông thường hoặc ưu đãi thành viên có thể kết hợp. Điều kiện kết hợp được ghi rõ trong từng chương trình khuyến mãi.",
  },
  {
    category: "Khuyến mãi",
    question: "Voucher giảm giá có thời hạn sử dụng không?",
    answer:
      "Có. Mỗi voucher đều có ngày hết hạn được hiển thị rõ khi áp dụng vào giỏ hàng. Voucher hết hạn sẽ không được chấp nhận. Kiểm tra ngày hết hạn trước khi sử dụng để tránh bỏ lỡ ưu đãi.",
  },

  // ── ĐÁNH GIÁ ────────────────────────────────────────────────────────────────
  {
    category: "Đánh giá",
    question: "Tôi có thể đánh giá sản phẩm không?",
    answer:
      "Chỉ những khách hàng đã mua và nhận hàng thành công mới có thể đánh giá — giúp đảm bảo đánh giá trung thực. Vào trang chi tiết sản phẩm → phần Đánh giá → điền nhận xét, chấm sao và đính kèm ảnh thực tế (tối đa 3 ảnh).",
  },
  {
    category: "Đánh giá",
    question: "Đánh giá của tôi bao lâu thì hiển thị trên trang?",
    answer:
      "Đánh giá được kiểm duyệt trước khi đăng (thường trong vòng 24 giờ làm việc). Quy trình kiểm duyệt giúp loại bỏ nội dung spam và đảm bảo chất lượng thông tin cho người mua khác.",
  },
  {
    category: "Đánh giá",
    question: "Tôi có thể chỉnh sửa đánh giá đã gửi không?",
    answer:
      "Hiện tại đánh giá sau khi gửi không chỉnh sửa trực tiếp được. Nếu cần điều chỉnh nội dung, vui lòng liên hệ hotline 0392 923 392 hoặc email support@cuonghoa.vn để được hỗ trợ.",
  },

  // ── KỸ THUẬT ────────────────────────────────────────────────────────────────
  {
    category: "Kỹ thuật",
    question: "Có hỗ trợ kỹ thuật sau mua hàng không?",
    answer:
      "Có. Đội ngũ kỹ thuật Cường Hoa hỗ trợ miễn phí suốt vòng đời sản phẩm qua hotline 0392 923 392 (7:00–18:00 hằng ngày). Với các lỗi phức tạp, kỹ thuật viên sẽ đến tận nơi hoặc hẹn mang máy vào cửa hàng.",
  },
  {
    category: "Kỹ thuật",
    question: "Tôi không biết cách sử dụng máy, có được hướng dẫn không?",
    answer:
      "Mỗi sản phẩm đều kèm hướng dẫn sử dụng tiếng Việt. Ngoài ra, đội kỹ thuật tư vấn qua điện thoại hoặc trực tiếp tại showroom. Kênh YouTube của Cường Hoa cũng có video hướng dẫn vận hành từng dòng máy.",
  },
  {
    category: "Kỹ thuật",
    question: "Máy bị hỏng sau thời gian bảo hành thì sửa ở đâu?",
    answer:
      "Sau khi hết bảo hành, bạn vẫn có thể mang máy đến cửa hàng để sửa chữa có tính phí theo bảng giá linh kiện và nhân công. Với các hãng lớn (Honda, STIHL, Husqvarna), chúng tôi cũng kết nối với trung tâm bảo hành ủy quyền trên toàn quốc.",
  },
  {
    category: "Kỹ thuật",
    question: "Mua phụ kiện và linh kiện thay thế ở đâu?",
    answer:
      "Cường Hoa bán đầy đủ phụ kiện và linh kiện thay thế chính hãng: lưỡi cắt, xích cưa, bugi, lọc gió, dây ga... Đặt hàng online trên website hoặc liên hệ trực tiếp để kiểm tra tương thích trước khi mua.",
  },
];

const categories = Object.keys(categoryMeta);

export default function QuickHelpSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return faqList.filter((item) => {
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        (typeof item.answer === "string" && item.answer.toLowerCase().includes(q));
      const matchesCategory =
        category === "Tất cả" || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [keyword, category]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
    setExpandedIndex(null);
  }, [keyword, category]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setExpandedIndex(null);
  };

  return (
    <Box
      component="section"
      id="quick-help"
      sx={{
        bgcolor: "#fff",
        py: { xs: 6, md: 8 },
        scrollMarginTop: "80px",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <Box textAlign="center" mb={5}>
            <Typography
              component="h2"
              variant="h4"
              fontWeight={800}
              color="#333"
              gutterBottom
            >
              Câu hỏi thường gặp
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 560, mx: "auto" }}
            >
              {faqList.length} câu hỏi phổ biến được phân theo từng chủ đề
            </Typography>
          </Box>

          {/* Search */}
          <Box maxWidth={600} mx="auto" mb={3}>
            <TextField
              fullWidth
              size="medium"
              placeholder="Tìm kiếm câu hỏi..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3 },
                },
              }}
            />
          </Box>

          {/* Category Tabs */}
          <Tabs
            value={category}
            onChange={(_, value) => setCategory(value)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              mb: 4,
              borderBottom: "1px solid #f0f0f0",
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                minWidth: "auto",
                fontSize: "0.82rem",
                py: 1.5,
                px: 1.5,
              },
              "& .Mui-selected": { color: "#f25c05" },
              "& .MuiTabs-indicator": { bgcolor: "#f25c05", height: 3 },
            }}
          >
            {categories.map((cat) => {
              const meta = categoryMeta[cat];
              const count =
                cat === "Tất cả"
                  ? faqList.length
                  : faqList.filter((f) => f.category === cat).length;
              return (
                <Tab
                  key={cat}
                  value={cat}
                  label={
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      {meta.icon}
                      <span>{meta.label}</span>
                      <Chip
                        label={count}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.65rem",
                          bgcolor: category === cat ? "#f25c05" : "#f0f0f0",
                          color: category === cat ? "#fff" : "#666",
                          "& .MuiChip-label": { px: 0.75 },
                        }}
                      />
                    </Stack>
                  }
                />
              );
            })}
          </Tabs>

          {/* Result summary */}
          {keyword && (
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Tìm thấy <b>{filtered.length}</b> câu hỏi cho từ khoá &ldquo;<b>{keyword}</b>&rdquo;
              </Typography>
            </Box>
          )}

          {/* FAQ List */}
          <Box maxWidth={860} mx="auto">
            <AnimatePresence mode="wait">
              {paginated.length > 0 ? (
                <motion.div
                  key={`${category}-${page}-${keyword}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  {paginated.map((item, index) => {
                    const globalIndex = (page - 1) * ITEMS_PER_PAGE + index;
                    const catColor = categoryMeta[item.category]?.color ?? "#f25c05";
                    return (
                      <Paper
                        key={item.question}
                        elevation={expandedIndex === globalIndex ? 3 : 1}
                        sx={{
                          mb: 1.5,
                          borderRadius: 3,
                          overflow: "hidden",
                          borderLeft: expandedIndex === globalIndex
                            ? `4px solid ${catColor}`
                            : "4px solid transparent",
                          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                        }}
                      >
                        <Accordion
                          expanded={expandedIndex === globalIndex}
                          onChange={() =>
                            setExpandedIndex(
                              expandedIndex === globalIndex ? null : globalIndex,
                            )
                          }
                          sx={{
                            boxShadow: "none",
                            "&:before": { display: "none" },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={
                              <ExpandMoreIcon
                                sx={{
                                  color: catColor,
                                  transition: "transform 0.2s ease",
                                }}
                              />
                            }
                            sx={{
                              px: { xs: 2, sm: 3 },
                              "& .MuiAccordionSummary-content": {
                                alignItems: "center",
                                gap: 1.5,
                                my: 1.5,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                color: catColor,
                                display: "flex",
                                alignItems: "center",
                                flexShrink: 0,
                              }}
                            >
                              <HelpOutlineIcon sx={{ fontSize: 20 }} />
                            </Box>
                            <Typography fontWeight={600} fontSize="0.93rem" color="#222">
                              {item.question}
                            </Typography>
                            <Chip
                              label={item.category}
                              size="small"
                              sx={{
                                ml: "auto",
                                flexShrink: 0,
                                display: { xs: "none", sm: "flex" },
                                bgcolor: `${catColor}18`,
                                color: catColor,
                                fontWeight: 600,
                                fontSize: "0.7rem",
                              }}
                            />
                          </AccordionSummary>
                          <AccordionDetails
                            sx={{ px: { xs: 2, sm: 3 }, pb: 2.5, pt: 0 }}
                          >
                            <Box
                              sx={{
                                pl: { xs: 0, sm: 4.5 },
                                color: "text.secondary",
                                lineHeight: 1.75,
                                fontSize: "0.92rem",
                              }}
                            >
                              {typeof item.answer === "string" ? (
                                <Typography color="text.secondary" lineHeight={1.75}>
                                  {item.answer}
                                </Typography>
                              ) : (
                                item.answer
                              )}
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Paper>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Alert
                    severity="info"
                    sx={{ borderRadius: 3, maxWidth: 860, mx: "auto" }}
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        href="#contact-form"
                        sx={{ fontWeight: 700 }}
                      >
                        Gửi câu hỏi
                      </Button>
                    }
                  >
                    Không tìm thấy câu hỏi phù hợp. Hãy gửi câu hỏi trực tiếp để được hỗ trợ!
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                  mt: 4,
                  pt: 3,
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center" }}
                >
                  Hiển thị{" "}
                  <Box component="b" sx={{ color: "#f25c05" }}>
                    {(page - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(page * ITEMS_PER_PAGE, filtered.length)}
                  </Box>
                  {" "}trong tổng số{" "}
                  <Box component="b" sx={{ color: "#f25c05" }}>
                    {filtered.length}
                  </Box>
                  {" "}câu hỏi
                </Typography>

                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  // Trên mobile ẩn first/last, dùng sibling=0 để gọn
                  showFirstButton={!isMobile}
                  showLastButton={!isMobile}
                  siblingCount={isMobile ? 0 : isTablet ? 1 : 1}
                  boundaryCount={1}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    "& .MuiPagination-ul": {
                      flexWrap: "nowrap", // không cho wrap nội bộ
                      justifyContent: "center",
                    },
                    "& .MuiPaginationItem-root": {
                      fontWeight: 700,
                      minWidth: isMobile ? 30 : 36,
                      height: isMobile ? 30 : 36,
                      fontSize: isMobile ? "0.8rem" : "0.875rem",
                    },
                    "& .Mui-selected": {
                      bgcolor: "#f25c05 !important",
                      color: "#fff",
                    },
                    "& .MuiPaginationItem-root:hover:not(.Mui-selected)": {
                      bgcolor: "rgba(242,92,5,0.1)",
                    },
                  }}
                />

                {/* Quick jump buttons trên mobile khi nhiều trang */}
                {isMobile && totalPages > 4 && (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 0.5 }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={page === 1}
                      onClick={() => { setPage(1); setExpandedIndex(null); }}
                      sx={{
                        minWidth: 0,
                        px: 1.5,
                        fontSize: "0.75rem",
                        borderColor: "divider",
                        color: "text.secondary",
                        "&:hover": { borderColor: "#f25c05", color: "#f25c05" },
                      }}
                    >
                      Trang đầu
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={page === totalPages}
                      onClick={() => { setPage(totalPages); setExpandedIndex(null); }}
                      sx={{
                        minWidth: 0,
                        px: 1.5,
                        fontSize: "0.75rem",
                        borderColor: "divider",
                        color: "text.secondary",
                        "&:hover": { borderColor: "#f25c05", color: "#f25c05" },
                      }}
                    >
                      Trang cuối
                    </Button>
                  </Stack>
                )}
              </Box>
            )}
          </Box>

          {/* Bottom CTA */}
          <Box
            sx={{
              textAlign: "center",
              mt: 6,
              p: 4,
              bgcolor: "#fff8f0",
              borderRadius: 4,
              maxWidth: 860,
              mx: "auto",
              border: "1px dashed #f25c05",
            }}
          >
            <Typography variant="h6" fontWeight={700} color="#333" gutterBottom>
              Không tìm thấy câu trả lời?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Đội ngũ Cường Hoa luôn sẵn sàng hỗ trợ bạn — hotline{" "}
              <Box
                component="a"
                href="tel:0392923392"
                sx={{
                  color: "#f25c05",
                  fontWeight: 700,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                0392 923 392
              </Box>{" "}
              (7:00–18:00 mỗi ngày)
            </Typography>
            <Button
              variant="contained"
              href="#contact-form"
              sx={{
                bgcolor: "#f25c05",
                color: "#fff",
                fontWeight: 700,
                px: 4,
                borderRadius: 2,
                "&:hover": { bgcolor: "#e64a19" },
              }}
            >
              Gửi câu hỏi cho chúng tôi
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
