// system/queries.ts
export const googleDirectionsUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

/** Embed url tạo từ lat/lng (dùng mẫu đã chạy ổn trước đó) */
export const googleEmbedUrl = (lat: number, lng: number) =>
  // Bạn có thể thay bằng Maps Embed API có key nếu muốn.
  `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.690859217451!2d106.48710087520563!3d21.274048180378595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313563aab2f52ee1%3A0x1f80e44dc4bbf9b5!2zQ8av4bucTkcgSE9BIFPhu6xBIEPGr0EgTOG7kEM!5e0!3m2!1svi!2s!4v1748514000000`;
