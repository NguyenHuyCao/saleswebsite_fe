// system/queries.ts
export const googleDirectionsUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

// Main store static embed URL (confirmed working, no API key required)
const MAIN_STORE_EMBED =
  `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.690859217451!2d106.48710087520563!3d21.274048180378595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313563aab2f52ee1%3A0x1f80e44dc4bbf9b5!2zQ8av4bucTkcgSE9BIFPhu6xBIEPGr0EgTOG7kEM!5e0!3m2!1svi!2s!4v1748514000000`;

const MAIN_STORE_LAT = 21.274;
const MAIN_STORE_LNG = 106.4871;
const COORD_TOLERANCE = 0.001;

/** Returns a working embed URL for the given coords.
 *  Uses the verified static URL for the main store, generic q= embed for others. */
export const googleEmbedUrl = (lat: number, lng: number): string => {
  const isMainStore =
    Math.abs(lat - MAIN_STORE_LAT) < COORD_TOLERANCE &&
    Math.abs(lng - MAIN_STORE_LNG) < COORD_TOLERANCE;
  if (isMainStore) return MAIN_STORE_EMBED;
  return `https://maps.google.com/maps?q=${lat},${lng}&hl=vi&z=15&output=embed`;
};
