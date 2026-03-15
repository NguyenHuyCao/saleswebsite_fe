// src/features/new/data.ts
import type { NewsPost } from "./types";

export const newsPosts: NewsPost[] = [
  {
    id: 1,
    title: "Khám phá các công cụ để tăng năng suất của bạn vào năm 2023",
    slug: "cong-cu-nang-suat-2023",
    excerpt:
      "Năm mới đang đến gần và đây là thời điểm lý tưởng để cải thiện hiệu suất làm việc của bạn trong lĩnh vực cơ khí...",
    content: `
      <h2>Nâng cao hiệu suất với công cụ phù hợp</h2>
      <p>Trong ngành cơ khí, việc lựa chọn công cụ phù hợp đóng vai trò quyết định đến hiệu suất công việc. Dưới đây là những công cụ không thể thiếu trong năm 2023:</p>
      
      <h3>1. Máy khoan pin không chổi than</h3>
      <p>Công nghệ không chổi than giúp máy hoạt động bền bỉ hơn, tiết kiệm pin và tăng tuổi thọ. Các dòng máy của Makita, DeWalt đều đã áp dụng công nghệ này.</p>
      
      <img src="/images/new/may-khoan-pin.jpg" alt="Máy khoan pin" />
      
      <h3>2. Máy cắt cỏ chạy xăng</h3>
      <p>Với những khu vườn rộng, máy cắt cỏ chạy xăng vẫn là lựa chọn hàng đầu nhờ công suất lớn và không phụ thuộc vào pin.</p>
      
      <blockquote>
        "Đầu tư công cụ chất lượng là đầu tư cho tương lai"
      </blockquote>
      
      <p>Hãy liên hệ với chúng tôi để được tư vấn chi tiết!</p>
    `,
    date: "23/08/2023",
    image:
      "/images/news/6670636fbeca91b81a58a6f9_Deere-company-tractor-banner.jpg",
    category: "Công nghệ mới",
    author: "Nguyễn Văn A",
    authorAvatar: "/images/customer/customer5.jpeg",
    views: 1234,
    comments: 56,
    tags: ["công cụ", "năng suất", "máy khoan"],
  },
  {
    id: 2,
    title: "TOP 5 máy mài pin nhỏ, hãy xem ngay!",
    slug: "top-5-may-mai-pin-nho",
    excerpt:
      "Công nghệ ngày càng phát triển đã tạo ra những dụng cụ cơ khí tiện ích, nhỏ gọn nhưng mạnh mẽ...",
    content: `
      <h2>Top 5 máy mài pin nhỏ được ưa chuộng nhất</h2>
      <p>Máy mài pin nhỏ đang trở thành xu hướng nhờ tính linh hoạt và dễ sử dụng. Dưới đây là top 5 sản phẩm đáng mua nhất:</p>
      
      <h3>1. Makita DGA452</h3>
      <p>Máy mài góc 100mm với công nghệ pin 18V, tốc độ không tải 8.500 vòng/phút.</p>
      
      <h3>2. DeWalt DCG412</h3>
      <p>Máy mài góc 115mm, pin 18V XR, thời gian sạc nhanh.</p>
      
      <h3>3. Bosch GWS 18V-50</h3>
      <p>Thiết kế nhỏ gọn, dễ cầm nắm, phù hợp với công việc sửa chữa tại nhà.</p>
    `,
    date: "23/08/2023",
    image:
      "/images/news/6670636fbeca91b81a58a6f9_Deere-company-tractor-banner.jpg",
    category: "Đánh giá sản phẩm",
    author: "Trần Thị B",
    authorAvatar: "/images/customer/customer4.jpeg",
    views: 856,
    comments: 23,
    tags: ["máy mài", "top 5", "pin"],
  },
  {
    id: 3,
    title: "Đã thử nghiệm gói dụng cụ điện mới năm 2023! Kiểm tra kết quả",
    slug: "thu-nghiem-goi-dung-cu-dien-2023",
    excerpt:
      "Hòa vào xu hướng công nghiệp 4.0, các công ty dụng cụ cơ khí đã cho ra mắt nhiều sản phẩm cải tiến...",
    content: `
      <h2>Kết quả thử nghiệm gói dụng cụ điện 2023</h2>
      <p>Chúng tôi đã tiến hành thử nghiệm 5 bộ dụng cụ điện mới nhất trên thị trường. Dưới đây là kết quả chi tiết:</p>
      
      <ul>
        <li><strong>Makita LXT Series:</strong> Hiệu suất 9/10, độ bền 9.5/10</li>
        <li><strong>DeWALT XR Series:</strong> Hiệu suất 9.5/10, độ bền 9/10</li>
        <li><strong>Bosch Professional:</strong> Hiệu suất 8.5/10, độ bền 9/10</li>
      </ul>
      
      <p>Nhìn chung, các sản phẩm đều có chất lượng tốt và đáp ứng được nhu cầu công việc.</p>
    `,
    date: "22/08/2023",
    image: "/images/news/cat-gx35-500x667-1.jpg",
    category: "Thử nghiệm",
    author: "Lê Văn C",
    authorAvatar: "/images/customer/customer3.jpeg",
    views: 567,
    comments: 12,
    tags: ["thử nghiệm", "dụng cụ điện", "đánh giá"],
  },
  {
    id: 4,
    title: "Chuyên gia thấu hiểu 5 lời khuyên quan trọng trước khi mua dụng cụ",
    slug: "5-loi-khuyen-truoc-khi-mua-dung-cu",
    excerpt:
      "Dụng cụ cầm tay là những dụng cụ không thể thiếu trong việc thực hiện các công việc cơ khí...",
    content: `
      <h2>5 lời khuyên từ chuyên gia</h2>
      <p>Trước khi quyết định mua dụng cụ cơ khí, hãy tham khảo những lời khuyên sau:</p>
      
      <h3>1. Xác định nhu cầu sử dụng</h3>
      <p>Bạn cần mua để làm việc gì? Tần suất sử dụng ra sao? Điều này giúp chọn đúng loại máy phù hợp.</p>
      
      <h3>2. Chọn thương hiệu uy tín</h3>
      <p>Makita, DeWalt, Bosch, Stihl là những thương hiệu đáng tin cậy.</p>
      
      <h3>3. Kiểm tra chế độ bảo hành</h3>
      <p>Nên chọn sản phẩm có bảo hành ít nhất 12 tháng.</p>
      
      <h3>4. So sánh giá cả</h3>
      <p>Tham khảo nhiều nơi để có giá tốt nhất.</p>
      
      <h3>5. Đọc đánh giá từ người dùng</h3>
      <p>Kinh nghiệm thực tế sẽ giúp bạn có quyết định đúng đắn.</p>
    `,
    date: "21/08/2023",
    image: "/images/news/images.jpeg",
    category: "Kinh nghiệm",
    author: "Phạm Thị D",
    authorAvatar: "/images/customer/customer2.jpeg",
    views: 345,
    comments: 8,
    tags: ["kinh nghiệm", "mua hàng", "tư vấn"],
  },
  {
    id: 5,
    title: "Xem bộ sưu tập phụ kiện công cụ mới – khuyến mãi hấp dẫn",
    slug: "phu-kien-cong-cu-khuyen-mai",
    excerpt:
      "Bộ sưu tập phụ kiện mới với nhiều ưu đãi hấp dẫn, giảm giá lên đến 30%...",
    content: `
      <h2>Ưu đãi đặc biệt cho phụ kiện công cụ</h2>
      <p>Tháng này, chúng tôi có chương trình khuyến mãi đặc biệt cho các phụ kiện công cụ:</p>
      
      <ul>
        <li>Mũi khoan các loại: giảm 20%</li>
        <li>Lưỡi cưa: giảm 15% khi mua từ 3 sản phẩm</li>
        <li>Pin máy khoan: giảm 25%</li>
        <li>Phụ kiện đa năng: giảm 30% cho đơn hàng đầu tiên</li>
      </ul>
      
      <p>Nhanh tay đặt hàng để không bỏ lỡ cơ hội!</p>
    `,
    date: "20/08/2023",
    image: "/images/news/z2818887202266_c1eb1e8b1e19c647d4fb8dc49f910cac.jpg",
    category: "Khuyến mãi",
    author: "Admin",
    authorAvatar: "/images/customer/customer1.jpeg",
    views: 234,
    comments: 5,
    tags: ["khuyến mãi", "phụ kiện", "giảm giá"],
  },
];

export const categories = [
  { name: "Công nghệ mới", path: "/new?category=cong-nghe-moi" },
  { name: "Đánh giá sản phẩm", path: "/new?category=danh-gia" },
  { name: "Thử nghiệm", path: "/new?category=thu-nghiem" },
  { name: "Kinh nghiệm", path: "/new?category=kinh-nghiem" },
  { name: "Khuyến mãi", path: "/new?category=khuyen-mai" },
];
