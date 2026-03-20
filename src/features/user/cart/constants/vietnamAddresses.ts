// cart/constants/vietnamAddresses.ts
// Danh sách 63 tỉnh/thành và các quận/huyện chính

export interface District {
  name: string;
}

export interface Province {
  name: string;
  districts: string[];
}

export const vietnamProvinces: Province[] = [
  {
    name: "Hà Nội",
    districts: [
      "Ba Đình", "Hoàn Kiếm", "Tây Hồ", "Long Biên", "Cầu Giấy",
      "Đống Đa", "Hai Bà Trưng", "Hoàng Mai", "Thanh Xuân", "Sóc Sơn",
      "Đông Anh", "Gia Lâm", "Nam Từ Liêm", "Thanh Trì", "Bắc Từ Liêm",
      "Mê Linh", "Hà Đông", "Sơn Tây", "Ba Vì", "Phúc Thọ", "Đan Phượng",
      "Hoài Đức", "Quốc Oai", "Thạch Thất", "Chương Mỹ", "Thanh Oai",
      "Thường Tín", "Phú Xuyên", "Ứng Hòa", "Mỹ Đức",
    ],
  },
  {
    name: "Hồ Chí Minh",
    districts: [
      "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6",
      "Quận 7", "Quận 8", "Quận 10", "Quận 11", "Quận 12",
      "Bình Thạnh", "Gò Vấp", "Phú Nhuận", "Tân Bình", "Tân Phú",
      "Thủ Đức (TP)", "Bình Chánh", "Cần Giờ", "Củ Chi", "Hóc Môn", "Nhà Bè",
    ],
  },
  {
    name: "Đà Nẵng",
    districts: [
      "Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn",
      "Liên Chiểu", "Cẩm Lệ", "Hòa Vang", "Hoàng Sa",
    ],
  },
  {
    name: "Hải Phòng",
    districts: [
      "Hồng Bàng", "Ngô Quyền", "Lê Chân", "Hải An", "Kiến An",
      "Đồ Sơn", "Dương Kinh", "Thuỷ Nguyên", "An Dương", "An Lão",
      "Kiến Thuỵ", "Tiên Lãng", "Vĩnh Bảo", "Cát Hải", "Bạch Long Vĩ",
    ],
  },
  {
    name: "Cần Thơ",
    districts: [
      "Ninh Kiều", "Ô Môn", "Bình Thuỷ", "Cái Răng", "Thốt Nốt",
      "Vĩnh Thạnh", "Cờ Đỏ", "Phong Điền", "Thới Lai",
    ],
  },
  {
    name: "An Giang",
    districts: [
      "Long Xuyên", "Châu Đốc", "An Phú", "Tân Châu", "Phú Tân",
      "Châu Phú", "Tịnh Biên", "Tri Tôn", "Châu Thành", "Chợ Mới", "Thoại Sơn",
    ],
  },
  {
    name: "Bà Rịa - Vũng Tàu",
    districts: [
      "Vũng Tàu", "Bà Rịa", "Châu Đức", "Xuyên Mộc", "Long Điền",
      "Đất Đỏ", "Phú Mỹ", "Côn Đảo",
    ],
  },
  {
    name: "Bắc Giang",
    districts: [
      "Bắc Giang", "Yên Thế", "Tân Yên", "Lạng Giang", "Lục Nam",
      "Lục Ngạn", "Sơn Động", "Yên Dũng", "Việt Yên", "Hiệp Hòa",
    ],
  },
  {
    name: "Bắc Kạn",
    districts: [
      "Bắc Kạn", "Pác Nặm", "Ba Bể", "Ngân Sơn", "Bạch Thông",
      "Chợ Đồn", "Na Rì", "Chợ Mới",
    ],
  },
  {
    name: "Bạc Liêu",
    districts: [
      "Bạc Liêu", "Hồng Dân", "Phước Long", "Vĩnh Lợi",
      "Giá Rai", "Đông Hải", "Hoà Bình",
    ],
  },
  {
    name: "Bắc Ninh",
    districts: [
      "Bắc Ninh", "Yên Phong", "Quế Võ", "Tiên Du", "Từ Sơn",
      "Thuận Thành", "Gia Bình", "Lương Tài",
    ],
  },
  {
    name: "Bến Tre",
    districts: [
      "Bến Tre", "Châu Thành", "Chợ Lách", "Mỏ Cày Nam", "Mỏ Cày Bắc",
      "Giồng Trôm", "Bình Đại", "Ba Tri", "Thạnh Phú",
    ],
  },
  {
    name: "Bình Định",
    districts: [
      "Quy Nhơn", "An Lão", "Hoài Ân", "Hoài Nhơn", "Phù Mỹ",
      "Vĩnh Thạnh", "Tây Sơn", "Phù Cát", "An Nhơn", "Tuy Phước", "Vân Canh",
    ],
  },
  {
    name: "Bình Dương",
    districts: [
      "Thủ Dầu Một", "Bến Cát", "Tân Uyên", "Dĩ An", "Thuận An",
      "Phú Giáo", "Bắc Tân Uyên", "Dầu Tiếng",
    ],
  },
  {
    name: "Bình Phước",
    districts: [
      "Đồng Xoài", "Bình Long", "Phước Long", "Chơn Thành", "Đồng Phú",
      "Hớn Quản", "Lộc Ninh", "Bù Đốp", "Bù Gia Mập", "Bù Đăng",
      "Phú Riềng",
    ],
  },
  {
    name: "Bình Thuận",
    districts: [
      "Phan Thiết", "La Gi", "Tuy Phong", "Bắc Bình", "Hàm Thuận Bắc",
      "Hàm Thuận Nam", "Tánh Linh", "Đức Linh", "Hàm Tân", "Phú Quý",
    ],
  },
  {
    name: "Cà Mau",
    districts: [
      "Cà Mau", "U Minh", "Thới Bình", "Trần Văn Thời", "Cái Nước",
      "Đầm Dơi", "Năm Căn", "Phú Tân", "Ngọc Hiển",
    ],
  },
  {
    name: "Cao Bằng",
    districts: [
      "Cao Bằng", "Bảo Lâm", "Bảo Lạc", "Hà Quảng", "Trà Lĩnh",
      "Trùng Khánh", "Hạ Lang", "Quảng Hòa", "Phục Hòa", "Hòa An",
      "Nguyên Bình", "Thạch An",
    ],
  },
  {
    name: "Đắk Lắk",
    districts: [
      "Buôn Ma Thuột", "Buôn Hồ", "Ea H'Leo", "Ea Súp", "Krông Năng",
      "Krông Buk", "Buôn Đôn", "Cư M'gar", "Ea Kar", "M'Đrắk",
      "Krông Bông", "Krông Pắc", "Krông Ana", "Lắk",
    ],
  },
  {
    name: "Đắk Nông",
    districts: [
      "Gia Nghĩa", "Đắk Mil", "Krông Nô", "Đắk Song", "Đắk R'Lấp",
      "Đắk Glong", "Cư Jút", "Tuy Đức",
    ],
  },
  {
    name: "Điện Biên",
    districts: [
      "Điện Biên Phủ", "Mường Lay", "Điện Biên", "Điện Biên Đông",
      "Mường Ảng", "Mường Nhé", "Nậm Pồ", "Tủa Chùa", "Tuần Giáo",
    ],
  },
  {
    name: "Đồng Nai",
    districts: [
      "Biên Hòa", "Long Khánh", "Tân Phú", "Vĩnh Cửu", "Định Quán",
      "Trảng Bom", "Thống Nhất", "Cẩm Mỹ", "Long Thành", "Xuân Lộc",
      "Nhơn Trạch",
    ],
  },
  {
    name: "Đồng Tháp",
    districts: [
      "Cao Lãnh", "Sa Đéc", "Hồng Ngự", "Tân Hồng", "Tam Nông",
      "Tháp Mười", "Cao Lãnh (H)", "Thanh Bình", "Lấp Vò", "Lai Vung",
      "Châu Thành",
    ],
  },
  {
    name: "Gia Lai",
    districts: [
      "Pleiku", "An Khê", "Ayun Pa", "KBang", "Đăk Đoa",
      "Chư Păh", "Ia Grai", "Mang Yang", "Kông Chro", "Đức Cơ",
      "Chư Prông", "Chư Sê", "Đăk Pơ", "Ia Pa", "Krông Pa",
      "Phú Thiện", "Chư Pưh",
    ],
  },
  {
    name: "Hà Giang",
    districts: [
      "Hà Giang", "Đồng Văn", "Mèo Vạc", "Yên Minh", "Quản Bạ",
      "Vị Xuyên", "Bắc Mê", "Hoàng Su Phì", "Xín Mần", "Bắc Quang",
      "Quang Bình",
    ],
  },
  {
    name: "Hà Nam",
    districts: [
      "Phủ Lý", "Duy Tiên", "Kim Bảng", "Thanh Liêm", "Bình Lục", "Lý Nhân",
    ],
  },
  {
    name: "Hà Tĩnh",
    districts: [
      "Hà Tĩnh", "Hồng Lĩnh", "Hương Sơn", "Đức Thọ", "Vũ Quang",
      "Nghi Xuân", "Can Lộc", "Hương Khê", "Thạch Hà", "Cẩm Xuyên",
      "Kỳ Anh", "Lộc Hà", "Kỳ Anh (TX)",
    ],
  },
  {
    name: "Hải Dương",
    districts: [
      "Hải Dương", "Chí Linh", "Nam Sách", "Kinh Môn", "Kim Thành",
      "Thanh Hà", "Cẩm Giàng", "Bình Giang", "Gia Lộc", "Tứ Kỳ",
      "Ninh Giang", "Thanh Miện",
    ],
  },
  {
    name: "Hậu Giang",
    districts: [
      "Vị Thanh", "Ngã Bảy", "Châu Thành A", "Châu Thành", "Phụng Hiệp",
      "Vị Thuỷ", "Long Mỹ",
    ],
  },
  {
    name: "Hòa Bình",
    districts: [
      "Hòa Bình", "Đà Bắc", "Mai Châu", "Lương Sơn", "Kim Bôi",
      "Cao Phong", "Tân Lạc", "Lạc Sơn", "Yên Thủy", "Lạc Thủy",
    ],
  },
  {
    name: "Hưng Yên",
    districts: [
      "Hưng Yên", "Mỹ Hào", "Ân Thi", "Khoái Châu", "Kim Động",
      "Tiên Lữ", "Phù Cừ", "Văn Giang", "Văn Lâm", "Yên Mỹ",
    ],
  },
  {
    name: "Khánh Hòa",
    districts: [
      "Nha Trang", "Cam Ranh", "Ninh Hòa", "Vạn Ninh", "Diên Khánh",
      "Khánh Vĩnh", "Khánh Sơn", "Trường Sa",
    ],
  },
  {
    name: "Kiên Giang",
    districts: [
      "Rạch Giá", "Hà Tiên", "Kiên Lương", "Hòn Đất", "Tân Hiệp",
      "Châu Thành", "Giồng Riềng", "Gò Quao", "An Biên", "An Minh",
      "Vĩnh Thuận", "U Minh Thượng", "Giang Thành", "Phú Quốc",
    ],
  },
  {
    name: "Kon Tum",
    districts: [
      "Kon Tum", "Đắk Glei", "Ngọc Hồi", "Đắk Tô", "Kon Plông",
      "Kon Rẫy", "Đắk Hà", "Sa Thầy", "Tu Mơ Rông", "Ia H'Drai",
    ],
  },
  {
    name: "Lai Châu",
    districts: [
      "Lai Châu", "Tam Đường", "Mường Tè", "Sìn Hồ", "Phong Thổ",
      "Than Uyên", "Tân Uyên", "Nậm Nhùn",
    ],
  },
  {
    name: "Lâm Đồng",
    districts: [
      "Đà Lạt", "Bảo Lộc", "Đam Rông", "Lạc Dương", "Lâm Hà",
      "Đơn Dương", "Đức Trọng", "Di Linh", "Bảo Lâm", "Đạ Huoai",
      "Đạ Tẻh", "Cát Tiên",
    ],
  },
  {
    name: "Lạng Sơn",
    districts: [
      "Lạng Sơn", "Tràng Định", "Bình Gia", "Văn Lãng", "Cao Lộc",
      "Văn Quan", "Bắc Sơn", "Hữu Lũng", "Chi Lăng", "Lộc Bình", "Đình Lập",
    ],
  },
  {
    name: "Lào Cai",
    districts: [
      "Lào Cai", "Sa Pa", "Bát Xát", "Mường Khương", "Si Ma Cai",
      "Bắc Hà", "Bảo Thắng", "Bảo Yên", "Văn Bàn",
    ],
  },
  {
    name: "Long An",
    districts: [
      "Tân An", "Kiến Tường", "Tân Hưng", "Vĩnh Hưng", "Mộc Hóa",
      "Tân Thạnh", "Thạnh Hóa", "Đức Huệ", "Đức Hòa", "Bến Lức",
      "Thủ Thừa", "Tân Trụ", "Cần Đước", "Cần Giuộc", "Châu Thành",
    ],
  },
  {
    name: "Nam Định",
    districts: [
      "Nam Định", "Mỹ Lộc", "Vụ Bản", "Ý Yên", "Nghĩa Hưng",
      "Nam Trực", "Trực Ninh", "Xuân Trường", "Giao Thủy", "Hải Hậu",
    ],
  },
  {
    name: "Nghệ An",
    districts: [
      "Vinh", "Cửa Lò", "Thái Hòa", "Hoàng Mai", "Quỳnh Lưu",
      "Diễn Châu", "Yên Thành", "Đô Lương", "Thanh Chương", "Nghi Lộc",
      "Hưng Nguyên", "Quỳ Hợp", "Nghĩa Đàn", "Tân Kỳ", "Anh Sơn",
      "Con Cuông", "Quỳ Châu", "Quế Phong", "Kỳ Sơn", "Tương Dương",
    ],
  },
  {
    name: "Ninh Bình",
    districts: [
      "Ninh Bình", "Tam Điệp", "Nho Quan", "Gia Viễn", "Hoa Lư",
      "Yên Khánh", "Kim Sơn", "Yên Mô",
    ],
  },
  {
    name: "Ninh Thuận",
    districts: [
      "Phan Rang - Tháp Chàm", "Bác Ái", "Ninh Sơn", "Ninh Hải",
      "Ninh Phước", "Thuận Bắc", "Thuận Nam",
    ],
  },
  {
    name: "Phú Thọ",
    districts: [
      "Việt Trì", "Phú Thọ", "Đoan Hùng", "Hạ Hòa", "Thanh Ba",
      "Phù Ninh", "Yên Lập", "Cẩm Khê", "Tam Nông", "Lâm Thao",
      "Thanh Sơn", "Thanh Thủy", "Tân Sơn",
    ],
  },
  {
    name: "Phú Yên",
    districts: [
      "Tuy Hòa", "Sông Cầu", "Đồng Xuân", "Tuy An", "Sơn Hòa",
      "Sông Hinh", "Tây Hòa", "Phú Hòa", "Đông Hòa",
    ],
  },
  {
    name: "Quảng Bình",
    districts: [
      "Đồng Hới", "Minh Hóa", "Tuyên Hóa", "Quảng Trạch", "Bố Trạch",
      "Quảng Ninh", "Lệ Thủy", "Ba Đồn",
    ],
  },
  {
    name: "Quảng Nam",
    districts: [
      "Tam Kỳ", "Hội An", "Đông Giang", "Tây Giang", "Đại Lộc",
      "Điện Bàn", "Duy Xuyên", "Quế Sơn", "Nam Giang", "Phước Sơn",
      "Hiệp Đức", "Thăng Bình", "Tiên Phước", "Bắc Trà My", "Nam Trà My",
      "Núi Thành", "Phú Ninh", "Nông Sơn",
    ],
  },
  {
    name: "Quảng Ngãi",
    districts: [
      "Quảng Ngãi", "Bình Sơn", "Trà Bồng", "Sơn Tịnh", "Tư Nghĩa",
      "Sơn Hà", "Sơn Tây", "Minh Long", "Nghĩa Hành", "Mộ Đức",
      "Đức Phổ", "Ba Tơ", "Lý Sơn",
    ],
  },
  {
    name: "Quảng Ninh",
    districts: [
      "Hạ Long", "Cẩm Phả", "Uông Bí", "Móng Cái", "Đông Triều",
      "Quảng Yên", "Bình Liêu", "Tiên Yên", "Đầm Hà", "Hải Hà",
      "Vân Đồn", "Ba Chẽ", "Cô Tô",
    ],
  },
  {
    name: "Quảng Trị",
    districts: [
      "Đông Hà", "Quảng Trị", "Vĩnh Linh", "Hướng Hóa", "Gio Linh",
      "Đa Krông", "Cam Lộ", "Triệu Phong", "Hải Lăng", "Cồn Cỏ",
    ],
  },
  {
    name: "Sóc Trăng",
    districts: [
      "Sóc Trăng", "Châu Thành", "Kế Sách", "Mỹ Tú", "Cù Lao Dung",
      "Long Phú", "Mỹ Xuyên", "Ngã Năm", "Thạnh Trị", "Vĩnh Châu",
      "Trần Đề",
    ],
  },
  {
    name: "Sơn La",
    districts: [
      "Sơn La", "Quỳnh Nhai", "Thuận Châu", "Mường La", "Bắc Yên",
      "Phù Yên", "Mộc Châu", "Yên Châu", "Mường Khương (SL)", "Mai Sơn",
      "Sông Mã", "Sốp Cộp", "Vân Hồ",
    ],
  },
  {
    name: "Tây Ninh",
    districts: [
      "Tây Ninh", "Tân Biên", "Tân Châu", "Dương Minh Châu", "Châu Thành",
      "Hòa Thành", "Gò Dầu", "Bến Cầu", "Trảng Bàng",
    ],
  },
  {
    name: "Thái Bình",
    districts: [
      "Thái Bình", "Quỳnh Phụ", "Hưng Hà", "Đông Hưng", "Thái Thụy",
      "Tiền Hải", "Kiến Xương", "Vũ Thư",
    ],
  },
  {
    name: "Thái Nguyên",
    districts: [
      "Thái Nguyên", "Sông Công", "Phổ Yên", "Phú Bình", "Đồng Hỷ",
      "Võ Nhai", "Định Hóa", "Đại Từ", "Phú Lương",
    ],
  },
  {
    name: "Thanh Hóa",
    districts: [
      "Thanh Hóa", "Bỉm Sơn", "Sầm Sơn", "Mường Lát", "Quan Hóa",
      "Bá Thước", "Quan Sơn", "Lang Chánh", "Ngọc Lặc", "Cẩm Thủy",
      "Thạch Thành", "Hà Trung", "Vĩnh Lộc", "Yên Định", "Thọ Xuân",
      "Thường Xuân", "Triệu Sơn", "Thiệu Hóa", "Hoằng Hóa", "Hậu Lộc",
      "Nga Sơn", "Nông Cống", "Đông Sơn", "Quảng Xương", "Tĩnh Gia",
    ],
  },
  {
    name: "Thừa Thiên Huế",
    districts: [
      "Huế", "Phong Điền", "Quảng Điền", "Phú Vang", "Hương Thủy",
      "Hương Trà", "Phú Lộc", "Nam Đông", "A Lưới",
    ],
  },
  {
    name: "Tiền Giang",
    districts: [
      "Mỹ Tho", "Gò Công", "Cai Lậy", "Tân Phước", "Cái Bè",
      "Cai Lậy (H)", "Châu Thành", "Chợ Gạo", "Gò Công Tây",
      "Gò Công Đông", "Tân Phú Đông",
    ],
  },
  {
    name: "Trà Vinh",
    districts: [
      "Trà Vinh", "Càng Long", "Cầu Kè", "Tiểu Cần", "Châu Thành",
      "Cầu Ngang", "Trà Cú", "Duyên Hải",
    ],
  },
  {
    name: "Tuyên Quang",
    districts: [
      "Tuyên Quang", "Na Hang", "Chiêm Hóa", "Hàm Yên", "Yên Sơn",
      "Sơn Dương", "Lâm Bình",
    ],
  },
  {
    name: "Vĩnh Long",
    districts: [
      "Vĩnh Long", "Long Hồ", "Mang Thít", "Vũng Liêm", "Tam Bình",
      "Bình Tân", "Trà Ôn", "Bình Minh",
    ],
  },
  {
    name: "Vĩnh Phúc",
    districts: [
      "Vĩnh Yên", "Phúc Yên", "Lập Thạch", "Tam Dương", "Tam Đảo",
      "Bình Xuyên", "Sông Lô", "Yên Lạc", "Vĩnh Tường",
    ],
  },
  {
    name: "Yên Bái",
    districts: [
      "Yên Bái", "Nghĩa Lộ", "Lục Yên", "Văn Yên", "Mù Cang Chải",
      "Trấn Yên", "Trạm Tấu", "Văn Chấn", "Yên Bình",
    ],
  },
];

/** Lấy danh sách tên tỉnh thành */
export const provinceNames = vietnamProvinces.map((p) => p.name);

/** Lấy quận/huyện theo tên tỉnh */
export function getDistricts(provinceName: string): string[] {
  return (
    vietnamProvinces.find((p) => p.name === provinceName)?.districts ?? []
  );
}
