// questions/constants/faqData.ts
import type { FaqCategory } from "../types";

export const faqData: FaqCategory[] = [
  {
    category: "Hỏi đáp về tài khoản",
    icon: "👤",
    questions: [
      {
        q: "Làm thế nào để tôi trở thành thành viên của Cường Hoa?",
        a: "Nhấn 'Đăng ký' trên thanh menu hoặc ở Menu trên điện thoại. Điền thông tin cơ bản và xác nhận email để hoàn tất đăng ký.",
      },
      {
        q: "Tại sao tôi không thể đăng nhập vào tài khoản của tôi?",
        a: "Kiểm tra lại email và mật khẩu. Nếu quên mật khẩu, nhấn 'Quên mật khẩu' để khôi phục. Nếu vẫn không được, vui lòng liên hệ hotline.",
      },
      {
        q: "Tôi có thể sử dụng chung tài khoản với người khác được không?",
        a: "Không nên để đảm bảo bảo mật thông tin cá nhân và lịch sử mua hàng. Mỗi tài khoản chỉ nên sử dụng cho một người.",
      },
      {
        q: "Cường Hoa có chương trình ưu đãi nào hấp dẫn dành cho khách hàng thân thiết?",
        a: "Có! Khách hàng thân thiết sẽ nhận được mã giảm giá đặc biệt, quyền truy cập sớm các chương trình sale, và tích điểm đổi quà.",
      },
    ],
  },
  {
    category: "Hỏi đáp về đặt hàng",
    icon: "📦",
    questions: [
      {
        q: "Tôi có thể đặt hàng bằng những hình thức nào?",
        a: "Bạn có thể đặt hàng qua:\n- Website: Chọn sản phẩm và thanh toán online\n- Hotline: Gọi 1900 6750 để được tư vấn và đặt hàng\n- Trực tiếp: Đến cửa hàng để mua và nhận hàng ngay",
      },
      {
        q: "Tôi muốn xem lại lịch sử đơn hàng đã mua?",
        a: "Đăng nhập vào tài khoản, vào mục 'Đơn hàng của tôi' để xem toàn bộ lịch sử mua hàng, trạng thái đơn hàng và hóa đơn.",
      },
      {
        q: "Tôi muốn đổi/trả hàng thì làm sao?",
        a: "Vui lòng xem chính sách đổi trả chi tiết. Sau đó gửi yêu cầu qua form hoặc gọi hotline để được hướng dẫn cụ thể.",
      },
    ],
  },
  {
    category: "Hỏi đáp về cửa hàng",
    icon: "🏪",
    questions: [
      {
        q: "Tôi có thể đến cửa hàng Cường Hoa ở đâu?",
        a: "Địa chỉ: 293 TL293, Nghĩa Phương, Lục Nam, Bắc Giang.\nXem bản đồ chi tiết tại trang 'Hệ thống cửa hàng'.",
      },
      {
        q: "Cửa hàng mở cửa lúc nào?",
        a: "Thứ 2 – Thứ 7: 8:00 – 17:30\nChủ nhật: 9:00 – 12:00\nCác ngày lễ: Nghỉ theo quy định",
      },
    ],
  },
  {
    category: "Hỏi đáp về thanh toán",
    icon: "💳",
    questions: [
      {
        q: "Cường Hoa chấp nhận những hình thức thanh toán nào?",
        a: "Chúng tôi chấp nhận:\n- Tiền mặt khi nhận hàng (COD)\n- Chuyển khoản ngân hàng\n- Thẻ tín dụng Visa, MasterCard\n- Ví điện tử Momo, ZaloPay, VNPay",
      },
      {
        q: "Tôi có thể trả góp sản phẩm không?",
        a: "Có, chúng tôi hỗ trợ trả góp qua thẻ tín dụng và các công ty tài chính với lãi suất 0% cho một số sản phẩm chọn lọc.",
      },
    ],
  },
  {
    category: "Hỏi đáp về bảo hành",
    icon: "🔧",
    questions: [
      {
        q: "Thời gian bảo hành sản phẩm là bao lâu?",
        a: "Tùy theo từng sản phẩm, thời gian bảo hành dao động từ 6 tháng đến 36 tháng. Chi tiết được ghi rõ trên sản phẩm và hóa đơn.",
      },
      {
        q: "Làm thế nào để bảo hành sản phẩm?",
        a: "Mang sản phẩm kèm hóa đơn đến cửa hàng gần nhất. Nhân viên sẽ kiểm tra và xử lý bảo hành trong thời gian sớm nhất.",
      },
    ],
  },
];
