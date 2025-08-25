export type NewsPost = {
  title: string;
  date: string;
  image: string;
  slug: string;
};

export const newsPosts: NewsPost[] = [
  {
    title: "Khám phá các công cụ để tăng năng suất của bạn vào năm 2023",
    date: "23/08/2023",
    image: "/images/news/images (1).jpeg",
    slug: "cong-cu-nang-suat-2023",
  },
  {
    title: "TOP 5 máy mài pin nhỏ, hãy xem ngay!",
    date: "23/08/2023",
    image: "/images/news/images (2).jpeg",
    slug: "top-5-may-mai-pin-nho",
  },
  {
    title: "Đã thử nghiệm gói dụng cụ điện mới năm 2023! Kiểm tra kết quả",
    date: "23/08/2023",
    image: "/images/news/cat-gx35-500x667-1.jpg",
    slug: "thu-nghiem-goi-dung-cu-dien-2023",
  },
  {
    title: "Chuyên gia thấu hiểu 5 lời khuyên quan trọng trước khi mua dụng cụ",
    date: "23/08/2023",
    image: "/images/news/images.jpeg",
    slug: "5-loi-khuyen-truoc-khi-mua-dung-cu",
  },
  {
    title: "Xem bộ sưu tập phụ kiện công cụ mới – khuyến mãi hấp dẫn",
    date: "23/08/2023",
    image: "/images/news/z2818887202266_c1eb1e8b1e19c647d4fb8dc49f910cac.jpg",
    slug: "phu-kien-cong-cu-khuyen-mai",
  },
];

export const categories = [
  { name: "Trang chủ", path: "/" },
  { name: "Giới thiệu", path: "/about" },
  { name: "Thương hiệu", path: "/brand" },
  { name: "Sản phẩm", path: "/product" },
  { name: "Sản phẩm khuyến mãi", path: "/promotion" },
  { name: "Tin tức", path: "/new" },
  { name: "Liên hệ", path: "/contact" },
  { name: "Hệ thống cửa hàng", path: "/system" },
  { name: "Câu hỏi thường gặp", path: "/question" },
  { name: "Chế độ bảo hành", path: "/warranty" },
];
