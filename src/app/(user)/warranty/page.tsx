import type { Metadata } from "next";
import WarrantyView from "@/features/user/warranty/WarrantyView";
import {
  STORE_FULL_NAME,
  STORE_PHONE_DISPLAY,
} from "@/lib/constants/store";

export const metadata: Metadata = {
  title: "Chính sách bảo hành",
  description: `Tra cứu thông tin bảo hành, gửi yêu cầu bảo hành trực tuyến tại ${STORE_FULL_NAME}. Bảo hành chính hãng 6–36 tháng cho máy cắt cỏ, máy cưa xích, máy phát điện và phụ kiện.`,
  keywords: [
    "bảo hành",
    "tra cứu bảo hành",
    "bảo hành máy cắt cỏ",
    "bảo hành máy cưa xích",
    "bảo hành chính hãng",
    "gửi yêu cầu bảo hành",
    STORE_FULL_NAME,
  ],
  openGraph: {
    title: `Bảo hành chính hãng | ${STORE_FULL_NAME}`,
    description:
      "Tra cứu và gửi yêu cầu bảo hành trực tuyến. Cam kết bảo hành chính hãng 6–36 tháng.",
    type: "website",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Làm thế nào để kiểm tra thời gian bảo hành còn lại?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Bạn có thể tra cứu trực tiếp trên website bằng cách nhập mã đơn hàng vào ô "Tra cứu bảo hành". Hoặc gọi hotline ${STORE_PHONE_DISPLAY} để được hỗ trợ.`,
      },
    },
    {
      "@type": "Question",
      name: "Tôi cần chuẩn bị những gì khi gửi yêu cầu bảo hành?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bạn cần chuẩn bị: Mã đơn hàng, email tài khoản, hình ảnh/video mô tả lỗi (nếu có) và sản phẩm còn nguyên tem bảo hành.",
      },
    },
    {
      "@type": "Question",
      name: "Thời gian xử lý bảo hành là bao lâu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Thời gian xử lý bảo hành thường từ 3–7 ngày làm việc tùy theo mức độ lỗi và tình trạng linh kiện thay thế.",
      },
    },
    {
      "@type": "Question",
      name: "Sản phẩm hết bảo hành có được sửa chữa không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Có, chúng tôi vẫn nhận sửa chữa các sản phẩm hết bảo hành với chi phí hợp lý. Vui lòng liên hệ để được báo giá.",
      },
    },
    {
      "@type": "Question",
      name: "Tôi có thể theo dõi trạng thái yêu cầu bảo hành không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Có. Sau khi gửi yêu cầu bảo hành, bạn có thể xem trạng thái trong mục "Lịch sử yêu cầu bảo hành" trên trang này hoặc nhận thông báo qua email.`,
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <WarrantyView />
    </>
  );
}
