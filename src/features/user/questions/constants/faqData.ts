// questions/constants/faqData.ts
import type { FaqCategory } from "../types";

export const faqData: FaqCategory[] = [
  {
    category: "Tài khoản",
    icon: "👤",
    questions: [
      {
        q: "Làm thế nào để tôi trở thành thành viên của Cường Hoa?",
        a: "Nhấn 'Đăng ký' trên thanh menu hoặc ở Menu trên điện thoại. Điền thông tin cơ bản (tên, email, mật khẩu) và xác nhận email để hoàn tất đăng ký.",
      },
      {
        q: "Tại sao tôi không thể đăng nhập vào tài khoản?",
        a: "Kiểm tra lại email và mật khẩu. Nếu quên mật khẩu, nhấn 'Quên mật khẩu' để khôi phục qua email. Nếu vẫn không được, vui lòng liên hệ hotline 0392 923 392.",
      },
      {
        q: "Tôi có thể sử dụng chung tài khoản với người khác không?",
        a: "Không nên, để đảm bảo bảo mật thông tin cá nhân và lịch sử mua hàng. Mỗi tài khoản chỉ nên sử dụng cho một người.",
      },
      {
        q: "Cường Hoa có chương trình ưu đãi cho khách hàng thân thiết không?",
        a: "Có! Khách hàng thân thiết sẽ nhận được mã giảm giá đặc biệt, quyền truy cập sớm các chương trình sale, và tích điểm đổi quà hấp dẫn.",
      },
      {
        q: "Tôi muốn thay đổi thông tin cá nhân (email, số điện thoại) thì làm thế nào?",
        a: "Đăng nhập vào tài khoản, vào mục 'Hồ sơ của tôi', chọn 'Chỉnh sửa thông tin' và cập nhật thông tin cần thay đổi. Một số thay đổi có thể cần xác thực qua email.",
      },
      {
        q: "Tôi muốn xóa tài khoản, có thể làm được không?",
        a: "Bạn có thể gửi yêu cầu xóa tài khoản qua email support@cuonghoa.vn hoặc liên hệ hotline. Lưu ý: dữ liệu đơn hàng sẽ được giữ lại theo quy định để xuất hóa đơn khi cần.",
      },
    ],
  },
  {
    category: "Đặt hàng",
    icon: "📦",
    questions: [
      {
        q: "Tôi có thể đặt hàng bằng những hình thức nào?",
        a: "Bạn có thể đặt hàng qua:\n• Website: Chọn sản phẩm và thanh toán online\n• Hotline: Gọi 0392 923 392 để được tư vấn và đặt hàng\n• Trực tiếp: Đến cửa hàng 293 TL293, Nghĩa Phương, Bắc Ninh để mua và nhận hàng ngay",
      },
      {
        q: "Tôi muốn xem lịch sử đơn hàng đã mua?",
        a: "Đăng nhập vào tài khoản, vào mục 'Đơn hàng của tôi' để xem toàn bộ lịch sử mua hàng, trạng thái đơn hàng và hóa đơn điện tử.",
      },
      {
        q: "Tôi muốn hủy đơn hàng thì làm thế nào?",
        a: "Bạn có thể hủy đơn hàng trước khi đơn hàng được xác nhận vận chuyển bằng cách vào 'Đơn hàng của tôi' → chọn đơn → nhấn 'Hủy đơn'. Sau khi đơn đã được vận chuyển, cần liên hệ hotline để được hỗ trợ.",
      },
      {
        q: "Tôi muốn đổi/trả hàng thì làm sao?",
        a: "Vui lòng xem chính sách đổi trả chi tiết tại trang Bảo hành. Sau đó gửi yêu cầu qua form liên hệ hoặc gọi hotline 0392 923 392 để được hướng dẫn cụ thể.",
      },
      {
        q: "Tôi đặt hàng xong nhưng không nhận được email xác nhận?",
        a: "Kiểm tra thư mục Spam/Junk trong hòm thư. Nếu vẫn không thấy sau 15 phút, hãy liên hệ hotline 0392 923 392 với mã đơn hàng để được kiểm tra.",
      },
      {
        q: "Có thể đặt hàng số lượng lớn với giá sỉ không?",
        a: "Có, Cường Hoa hỗ trợ bán sỉ cho đại lý và khách hàng mua số lượng lớn. Vui lòng liên hệ trực tiếp qua hotline 0392 923 392 hoặc email để được báo giá tốt nhất.",
      },
      {
        q: "Tôi có thể theo dõi trạng thái đơn hàng ở đâu?",
        a: "Bạn có thể theo dõi đơn hàng tại mục 'Đơn hàng của tôi' sau khi đăng nhập. Ngoài ra, hệ thống sẽ gửi email/SMS thông báo khi đơn hàng có trạng thái mới.",
      },
      {
        q: "Tôi có thể thay đổi địa chỉ giao hàng sau khi đặt không?",
        a: "Chỉ có thể thay đổi địa chỉ khi đơn hàng chưa được xác nhận vận chuyển. Liên hệ hotline 0392 923 392 càng sớm càng tốt để được hỗ trợ.",
      },
    ],
  },
  {
    category: "Sản phẩm",
    icon: "🔧",
    questions: [
      {
        q: "Cường Hoa chuyên bán những loại máy móc nào?",
        a: "Cường Hoa chuyên cung cấp các dòng máy động cơ 2 thì chính hãng: máy cắt cỏ, máy cưa xích, máy thổi lá, máy xới đất mini, máy bơm nước, và các phụ kiện, linh kiện đi kèm.",
      },
      {
        q: "Sản phẩm tại Cường Hoa có phải hàng chính hãng không?",
        a: "Có, 100% sản phẩm tại Cường Hoa là hàng chính hãng, có tem nhà sản xuất, hóa đơn VAT đầy đủ và được bảo hành chính thức. Chúng tôi cam kết không bán hàng nhái, hàng kém chất lượng.",
      },
      {
        q: "Làm sao tôi biết máy nào phù hợp với nhu cầu của mình?",
        a: "Bạn có thể:\n• Sử dụng bộ lọc trên trang sản phẩm (theo thương hiệu, công suất, giá...)\n• Gọi hotline 0392 923 392 để được tư vấn trực tiếp\n• Đến showroom để được demo sản phẩm thực tế",
      },
      {
        q: "Cường Hoa có bán phụ tùng thay thế không?",
        a: "Có, Cường Hoa có sẵn kho phụ tùng chính hãng: bugi, bộ chế hòa khí, dây cắt cỏ, lưỡi cưa, lọc gió, ống dẫn dầu, vòng bi... Bạn có thể mua trực tiếp tại cửa hàng hoặc đặt online.",
      },
      {
        q: "Sản phẩm trên website có khớp với sản phẩm thực tế không?",
        a: "Có, hình ảnh và thông số kỹ thuật trên website được cập nhật sát với sản phẩm thực. Tuy nhiên màu sắc có thể chênh lệch nhẹ do thiết bị màn hình. Bạn có thể đến showroom để xem trực tiếp.",
      },
      {
        q: "Máy 2 thì có khó sử dụng không? Cần kỹ năng gì?",
        a: "Máy 2 thì có thao tác cơ bản khá đơn giản. Khi mua hàng, nhân viên kỹ thuật sẽ hướng dẫn cách sử dụng, bảo dưỡng và các lưu ý an toàn. Cường Hoa cũng có video hướng dẫn trên kênh YouTube.",
      },
      {
        q: "Tôi muốn so sánh các dòng máy để chọn mua, có tài liệu nào không?",
        a: "Bạn có thể xem bảng so sánh thông số kỹ thuật ngay trên trang sản phẩm. Ngoài ra, gọi hotline để được tư vấn chuyên sâu và so sánh các dòng máy phù hợp nhất với công việc của bạn.",
      },
      {
        q: "Cường Hoa có nhận thu mua máy cũ không?",
        a: "Có, Cường Hoa nhận định giá và thu mua lại máy 2 thì cũ còn hoạt động. Mang máy đến cửa hàng hoặc gửi ảnh qua Zalo/Facebook để được báo giá miễn phí.",
      },
      {
        q: "Sản phẩm hết hàng, tôi muốn đặt trước có được không?",
        a: "Có, bạn có thể gọi hotline 0392 923 392 để đặt trước sản phẩm đang hết hàng. Chúng tôi sẽ thông báo ngay khi có hàng về và ưu tiên giao cho bạn.",
      },
      {
        q: "Tôi muốn xem sản phẩm thực tế trước khi mua online có được không?",
        a: "Có. Bạn có thể đến showroom tại 293 TL293, Nghĩa Phương, Bắc Ninh để xem và trải nghiệm sản phẩm trực tiếp trước khi quyết định mua online hay tại cửa hàng.",
      },
    ],
  },
  {
    category: "Giao hàng",
    icon: "🚚",
    questions: [
      {
        q: "Cường Hoa giao hàng đến những khu vực nào?",
        a: "Cường Hoa giao hàng toàn quốc qua đơn vị vận chuyển đối tác. Với đơn hàng trong bán kính 10 km từ cửa hàng (Bắc Ninh), chúng tôi có thể giao bằng xe của cửa hàng miễn phí.",
      },
      {
        q: "Thời gian giao hàng mất bao lâu?",
        a: "• Nội thành Bắc Ninh: 2–4 giờ\n• Tỉnh thành lân cận (Hà Nội, Hải Dương...): 1–2 ngày\n• Toàn quốc: 2–5 ngày làm việc\nThời gian có thể thay đổi vào dịp lễ, Tết.",
      },
      {
        q: "Phí vận chuyển được tính như thế nào?",
        a: "Miễn phí vận chuyển cho đơn hàng từ 1.000.000đ trở lên trong khu vực nội thành Bắc Ninh. Các khu vực khác, phí ship được tính dựa trên khoảng cách và trọng lượng hàng, hiển thị rõ khi đặt hàng.",
      },
      {
        q: "Tôi có thể chọn ngày/giờ giao hàng không?",
        a: "Có, khi đặt hàng bạn có thể ghi chú ngày giờ mong muốn nhận hàng trong phần ghi chú đơn hàng. Chúng tôi sẽ cố gắng sắp xếp theo yêu cầu.",
      },
      {
        q: "Đơn hàng của tôi bị giao chậm, phải làm gì?",
        a: "Kiểm tra trạng thái đơn hàng trong mục 'Đơn hàng của tôi'. Nếu đã quá thời gian dự kiến, liên hệ hotline 0392 923 392 kèm mã đơn hàng để được tra cứu và hỗ trợ.",
      },
      {
        q: "Tôi nhận được hàng bị hỏng/không đúng, phải làm gì?",
        a: "Chụp ảnh/video sản phẩm ngay khi nhận hàng và liên hệ hotline 0392 923 392 hoặc email support@cuonghoa.vn trong vòng 24 giờ. Cường Hoa sẽ xử lý đổi trả hoặc bồi thường theo chính sách.",
      },
      {
        q: "Có thể kiểm tra hàng trước khi nhận không?",
        a: "Có, bạn hoàn toàn có thể yêu cầu kiểm tra hàng trước khi ký nhận. Nếu phát hiện hàng bị hỏng hoặc không đúng, bạn có quyền từ chối nhận và thông báo cho chúng tôi.",
      },
      {
        q: "Tôi mua tại cửa hàng có được giao về nhà không?",
        a: "Có. Nếu bạn mua trực tiếp tại cửa hàng nhưng không muốn mang về ngay (do kích thước lớn hoặc nhiều sản phẩm), chúng tôi sẽ giao hàng miễn phí trong bán kính 10 km.",
      },
    ],
  },
  {
    category: "Thanh toán",
    icon: "💳",
    questions: [
      {
        q: "Cường Hoa chấp nhận những hình thức thanh toán nào?",
        a: "Chúng tôi chấp nhận:\n• Tiền mặt (COD) khi nhận hàng\n• Chuyển khoản ngân hàng\n• Thẻ tín dụng/ghi nợ Visa, Mastercard\n• Ví điện tử: MoMo, ZaloPay, VNPay\n• Trả góp qua thẻ tín dụng (0% lãi suất)",
      },
      {
        q: "Tôi có thể trả góp sản phẩm không?",
        a: "Có, Cường Hoa hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng các ngân hàng: VPBank, Techcombank, MB Bank, BIDV... Ngoài ra còn có hình thức trả góp qua công ty tài chính với điều kiện đơn giản.",
      },
      {
        q: "Tôi thanh toán chuyển khoản, gửi bill xác nhận ở đâu?",
        a: "Sau khi chuyển khoản, gửi ảnh bill xác nhận qua:\n• Zalo: 0392 923 392\n• Email: support@cuonghoa.vn\n• Tin nhắn Facebook\nĐơn hàng sẽ được xử lý ngay sau khi xác nhận thanh toán.",
      },
      {
        q: "Hóa đơn VAT được cấp như thế nào?",
        a: "Cường Hoa xuất hóa đơn VAT điện tử cho tất cả các đơn hàng. Hóa đơn sẽ được gửi về email của bạn trong vòng 24–48 giờ sau khi giao hàng thành công. Nếu cần hóa đơn giấy, vui lòng yêu cầu khi đặt hàng.",
      },
      {
        q: "Tôi thanh toán online nhưng tiền bị trừ mà không thấy đơn hàng?",
        a: "Đây thường là lỗi kết nối ngân hàng tạm thời. Tiền sẽ được hoàn lại trong 3–7 ngày làm việc. Vui lòng liên hệ hotline 0392 923 392 kèm mã giao dịch để được hỗ trợ nhanh hơn.",
      },
      {
        q: "Tôi có thể thanh toán khi đến nhận hàng tại cửa hàng không?",
        a: "Có, bạn hoàn toàn có thể thanh toán trực tiếp tại cửa hàng bằng tiền mặt, chuyển khoản hoặc quẹt thẻ. Nếu đặt hàng online và chọn nhận tại cửa hàng, thanh toán khi nhận.",
      },
    ],
  },
  {
    category: "Bảo hành",
    icon: "🛡️",
    questions: [
      {
        q: "Thời gian bảo hành sản phẩm là bao lâu?",
        a: "Tùy theo từng sản phẩm và thương hiệu, thời gian bảo hành dao động từ 6 tháng đến 36 tháng. Thông tin bảo hành chi tiết được ghi rõ trên tem sản phẩm và hóa đơn.",
      },
      {
        q: "Làm thế nào để yêu cầu bảo hành sản phẩm?",
        a: "Mang sản phẩm kèm hóa đơn mua hàng đến cửa hàng Cường Hoa. Nhân viên kỹ thuật sẽ kiểm tra và xử lý bảo hành trong thời gian sớm nhất. Hoặc liên hệ hotline để được tư vấn hình thức gửi bảo hành từ xa.",
      },
      {
        q: "Những trường hợp nào không được bảo hành?",
        a: "Bảo hành không áp dụng cho:\n• Hư hỏng do va đập, té ngã, tai nạn\n• Sử dụng sai cách hoặc không đúng hướng dẫn\n• Ngập nước, cháy nổ do điều kiện bên ngoài\n• Tự ý sửa chữa hoặc thay linh kiện không chính hãng\n• Tem bảo hành bị rách, xóa, sửa",
      },
      {
        q: "Tôi có thể bảo hành sản phẩm mua ở nơi khác tại Cường Hoa không?",
        a: "Cường Hoa nhận sửa chữa tất cả dòng máy 2 thì không phân biệt nơi mua. Tuy nhiên bảo hành chính hãng chỉ áp dụng cho sản phẩm mua tại Cường Hoa. Sản phẩm mua nơi khác sẽ được sửa chữa với phí dịch vụ thực tế.",
      },
      {
        q: "Tôi muốn bảo dưỡng định kỳ máy, có dịch vụ không?",
        a: "Có. Cường Hoa cung cấp dịch vụ bảo dưỡng định kỳ: vệ sinh bộ chế hòa khí, thay dầu nhớt, kiểm tra bugi, lọc gió... Giá dịch vụ hợp lý, đặt lịch qua hotline 0392 923 392.",
      },
      {
        q: "Cường Hoa có dịch vụ sửa chữa tại nhà không?",
        a: "Có. Trong bán kính 15 km từ cửa hàng, Cường Hoa cử kỹ thuật viên đến tận nơi sửa chữa hoặc bảo dưỡng. Phí thượng môn từ 50.000–100.000đ tùy khoảng cách. Đặt lịch trước ít nhất 1 ngày.",
      },
      {
        q: "Thời gian sửa chữa/bảo hành mất bao lâu?",
        a: "• Lỗi nhỏ (vệ sinh, thay bugi, căn dây...): 1–2 giờ\n• Lỗi trung bình (thay bộ chế hòa khí, piston...): 1–3 ngày\n• Lỗi phức tạp cần đặt phụ tùng: 3–7 ngày\nChúng tôi sẽ thông báo tiến độ và thời gian dự kiến hoàn thành khi nhận máy.",
      },
      {
        q: "Làm sao tôi biết sản phẩm mình đang trong thời hạn bảo hành?",
        a: "Bạn có thể kiểm tra thời hạn bảo hành tại trang 'Bảo hành của tôi' sau khi đăng nhập, hoặc tra cứu theo số serial trên tem sản phẩm. Ngoài ra, liên hệ hotline để được kiểm tra.",
      },
    ],
  },
  {
    category: "Cửa hàng",
    icon: "🏪",
    questions: [
      {
        q: "Cửa hàng Cường Hoa nằm ở đâu?",
        a: "Địa chỉ: 293 TL293, Nghĩa Phương, Lương Tài, Bắc Ninh, Việt Nam.\nBạn có thể xem bản đồ chi tiết và chỉ đường tại trang 'Hệ thống cửa hàng'.",
      },
      {
        q: "Cửa hàng mở cửa lúc nào?",
        a: "Thứ 2 – Thứ 7: 7:00 – 18:00\nChủ nhật: 7:00 – 17:00\nCửa hàng hoạt động cả ngày lễ (trừ Tết Nguyên Đán).",
      },
      {
        q: "Tôi có thể đến xem và thử sản phẩm trước khi mua không?",
        a: "Hoàn toàn có thể. Showroom Cường Hoa trưng bày đầy đủ các dòng máy 2 thì. Nhân viên kỹ thuật sẽ demo và tư vấn miễn phí để bạn cảm nhận sản phẩm thực tế trước khi quyết định mua.",
      },
      {
        q: "Cửa hàng có bãi đỗ xe không?",
        a: "Có, cửa hàng có bãi đỗ xe rộng rãi miễn phí cho cả ô tô và xe máy trong suốt thời gian bạn ghé thăm.",
      },
      {
        q: "Tôi có thể đặt lịch hẹn tư vấn trước khi đến cửa hàng không?",
        a: "Có. Gọi hotline 0392 923 392 để đặt lịch hẹn với kỹ thuật viên theo khung giờ bạn muốn, tránh chờ đợi vào giờ cao điểm.",
      },
      {
        q: "Mua hàng tại cửa hàng có rẻ hơn mua online không?",
        a: "Giá tại cửa hàng và online là tương đương. Tuy nhiên khi đến trực tiếp, bạn có thể thương lượng để được tặng kèm phụ kiện (dây cắt, nhớt, kính bảo hộ...) và nhận ưu đãi đặc biệt khi mua combo nhiều sản phẩm.",
      },
    ],
  },
];
