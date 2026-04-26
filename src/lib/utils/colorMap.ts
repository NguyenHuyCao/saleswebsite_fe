// Shared color utility — dùng cho cả admin (Step5Variants) và user (ProductDetails, ProductQuickActionDialog)

export const PRESET_SIZES = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
  '36', '37', '38', '39', '40', '41', '42', '43', '44', '45',
];

export const PRESET_COLORS: { name: string; hex: string }[] = [
  { name: 'Đen',        hex: '#212121' },
  { name: 'Trắng',      hex: '#f5f5f5' },
  { name: 'Đỏ',         hex: '#e53935' },
  { name: 'Xanh dương', hex: '#1e88e5' },
  { name: 'Xanh lá',    hex: '#43a047' },
  { name: 'Vàng',       hex: '#fdd835' },
  { name: 'Hồng',       hex: '#e91e63' },
  { name: 'Tím',        hex: '#8e24aa' },
  { name: 'Cam',        hex: '#fb8c00' },
  { name: 'Xám',        hex: '#757575' },
  { name: 'Nâu',        hex: '#6d4c41' },
  { name: 'Be',         hex: '#efebe9' },
  { name: 'Xanh Navy',  hex: '#1a237e' },
  { name: 'Rêu',        hex: '#558b2f' },
  { name: 'Xanh Ngọc',  hex: '#00897b' },
  { name: 'Đỏ Đô',      hex: '#880e4f' },
];

const COLOR_HEX_MAP: Record<string, string> = {
  ...Object.fromEntries(PRESET_COLORS.map((c) => [c.name.toLowerCase(), c.hex])),
  // Aliases
  'den': '#212121', 'black': '#212121',
  'trang': '#f5f5f5', 'white': '#f5f5f5',
  'do': '#e53935', 'red': '#e53935', 'đỏ đô': '#880e4f',
  'xanh': '#1e88e5', 'blue': '#1e88e5', 'xanh lam': '#1e88e5',
  'green': '#43a047', 'xanh la': '#43a047',
  'yellow': '#fdd835', 'vang': '#fdd835',
  'pink': '#e91e63', 'hong': '#e91e63',
  'purple': '#8e24aa', 'tim': '#8e24aa',
  'orange': '#fb8c00', 'cam': '#fb8c00',
  'gray': '#757575', 'grey': '#757575', 'xam': '#757575',
  'brown': '#6d4c41', 'nau': '#6d4c41',
  'navy': '#1a237e', 'xanh navy': '#1a237e',
  'teal': '#00897b', 'xanh ngoc': '#00897b',
  'reu': '#558b2f',
};

/** Lấy hex từ tên màu (case-insensitive). Trả null nếu không có trong map. */
export function getColorHex(name: string | null | undefined): string | null {
  if (!name) return null;
  return COLOR_HEX_MAP[name.toLowerCase().trim()] ?? null;
}

/** Trả true nếu màu nền quá sáng (cần border để phân biệt). */
export function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 200;
}
