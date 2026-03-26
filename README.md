# SalesWebsite Frontend (DoLa Tool)

> **Mục đích kép:** Tài liệu này vừa là hướng dẫn kỹ thuật cho developer, vừa là **context prompt** cung cấp đầy đủ thông tin cho AI assistant trong các cuộc hội thoại tương lai về dự án.

---

## 1. Tổng Quan Dự Án

**DoLa Tool** là website thương mại điện tử chuyên bán máy động cơ, máy nông nghiệp và dụng cụ cầm tay tại Việt Nam. Repository này (`saleswebsite_fe`) là phần **Frontend** xây dựng bằng **Next.js 15 / React 19**, kết nối với backend REST API và Socket.IO real-time.

**Sản phẩm kinh doanh:**
- Máy cưa xích (chainsaw) — Husqvarna, Stihl, Oregon
- Máy cắt cỏ / máy cắt bụi (brushcutter) — Honda, Maruyama
- Máy thổi lá (blower), máy bơm nước
- Dụng cụ cầm tay và phụ kiện máy 2 thì / 4 thì

**Backend tương ứng:** `saleswebsite_be` (Spring Boot 3.4.5, port 8080)

---

## 2. Tech Stack

| Hạng mục | Công nghệ | Phiên bản |
|---|---|---|
| Framework | Next.js (App Router) | 15.3.2 |
| UI Library | React | 19.0.0 |
| Language | TypeScript | 5.x |
| UI Components | Material-UI (MUI) | 7.1.0 |
| CSS-in-JS | Emotion | @emotion/react + @emotion/styled |
| State Management | Redux Toolkit + React-Redux | 2.8.2 + 9.2.0 |
| Server State | TanStack React Query | 5.85.5 |
| HTTP Client | Axios | 1.11.0 |
| Real-time | Socket.IO Client | 2.5.0 |
| Forms | React Hook Form | 7.62.0 |
| Validation | Zod | 3.25.76 |
| Animation | Framer Motion | 12.15.0 |
| Charts | ApexCharts + MUI X-Charts | 4.7.0 + 8.5.1 |
| Date/Time | Dayjs + MUI X-Date-Pickers | 1.11.13 |
| Carousel | React Slick | 0.30.3 |
| Lightbox | Yet Another React Lightbox | 3.23.2 |
| File Upload | Rpldy (upload-drop-zone) | 1.10.0 |
| Icons | MUI Icons + Lucide React + MDI | — |
| Progress Bar | NProgress | — |
| Device ID | Fingerprint.js | — |
| JWT | JWT Decode | — |

---

## 3. Cấu Trúc Thư Mục

```
src/
│
├── @core/                              # Core framework (theme, layout, hooks)
│   ├── components/
│   │   ├── card-statistics/            # Widget thống kê (dùng trong dashboard)
│   │   ├── react-apexcharts/           # Wrapper cho ApexCharts
│   │   └── scroll-to-top/             # Nút scroll to top
│   ├── context/
│   │   └── settingsContext.tsx         # Cài dat theme (light/dark, skin, direction)
│   ├── hooks/                          # Custom hooks dung chung
│   ├── layouts/
│   │   ├── components/vertical/        # Vertical navigation layout
│   │   └── components/footer/         # Footer layout
│   ├── theme/                          # Material-UI theme configuration
│   │   ├── breakpoints/               # Responsive breakpoints
│   │   ├── palette/                   # Color palette (light/dark mode)
│   │   ├── overrides/                 # Component-level theme overrides
│   │   │   └── ThemeComponent.tsx     # Apply overrides cho tat ca MUI components
│   │   ├── typography/                # Font & text styles
│   │   ├── shadows/                   # Elevation & shadow system
│   │   └── spacing/                   # Margin/padding scale
│   ├── styles/                        # Global theme styles
│   └── utils/                         # Core utilities
│
├── app/                                # Next.js App Router
│   ├── layout.tsx                     # Root layout: fonts, providers, metadata
│   ├── providers.tsx                  # Wrap Redux, QueryClient, Theme, Socket, Toast
│   │
│   ├── (user)/                        # Route group: giao dien nguoi dung
│   │   ├── page.tsx                   # Trang chu (/)
│   │   ├── about/                     # Gioi thieu DoLa Tool
│   │   ├── account/                   # Thong tin tai khoan
│   │   ├── brand/                     # Danh sach thuong hieu
│   │   ├── cart/                      # Gio hang
│   │   ├── change-password/           # Doi mat khau
│   │   ├── checkout/                  # Thanh toan / dat hang
│   │   ├── contact/                   # Form lien he
│   │   ├── forgot-password/           # Quen mat khau
│   │   ├── login/                     # Dang nhap
│   │   ├── momo-payment/              # Giao dien thanh toan MoMo
│   │   ├── new/[slug]/                # Chi tiet bai viet / tin tuc
│   │   ├── oauth2/callback/           # Xu ly OAuth2 callback (Google/Facebook)
│   │   ├── order/                     # Lich su don hang
│   │   ├── payment/
│   │   │   ├── pending/               # Dang cho thanh toan
│   │   │   ├── return/momo/           # Return URL MoMo
│   │   │   └── return/vnpay/          # Return URL VNPay
│   │   ├── product/                   # Danh sach san pham
│   │   ├── product/detail/            # Chi tiet san pham
│   │   ├── profile-complete/          # Hoan thien ho so OAuth
│   │   ├── promotion/                 # Trang khuyen mai
│   │   ├── question/                  # Hoi dap (Q&A)
│   │   ├── reset-password/            # Dat lai mat khau
│   │   ├── system/                    # Cai dat he thong
│   │   ├── verify-email/              # Xac thuc email
│   │   ├── warranty/                  # Quan ly bao hanh
│   │   └── wishlist/                  # Danh sach yeu thich
│   │
│   ├── admin/                         # Route group: giao dien quan tri
│   │   ├── page.tsx                   # Dashboard admin
│   │   ├── account-settings/          # Cai dat tai khoan admin
│   │   ├── brands/                    # Quan ly thuong hieu
│   │   ├── categories/                # Quan ly danh muc
│   │   ├── contacts/                  # Quan ly lien he
│   │   ├── events/                    # Quan ly su kien
│   │   ├── orders/                    # Quan ly don hang
│   │   ├── products/                  # Danh sach san pham admin
│   │   ├── products/create/           # Tao san pham moi (4 buoc)
│   │   ├── products/update/           # Cap nhat san pham
│   │   ├── products/view/             # Xem chi tiet san pham
│   │   ├── shippings/                 # Quan ly van chuyen
│   │   ├── users/                     # Quan ly nguoi dung
│   │   └── warranties/                # Quan ly bao hanh
│   │
│   └── api/
│       └── auth/set-cookie/           # API route noi bo: set httpOnly cookie
│
├── components/                        # Shared UI components
│   ├── alert/                         # ContactAlert, OrderAlert, GlobalSnackbar
│   ├── common/                        # FreezeScrollOnReload, ScrollResetOnLoad
│   ├── dashboard/                     # MainCard, SalesChart
│   ├── feedback/                      # AlertSnackbar
│   ├── fixed_elements/                # Widget co dinh tren man hinh
│   │   ├── AiChatWidget.tsx           # Widget AI Chat (floating, bottom-right)
│   │   ├── button_contact/            # Nut lien he nhanh (Zalo/Phone)
│   │   ├── button_scroll_to_top/      # Nut cuon len dau trang
│   │   └── warranty_aquestion/        # Widget hoi bao hanh nhanh
│   ├── layouts/                       # UserLayout wrapper
│   ├── navigation/                    # Vertical navigation components
│   ├── providers/                     # Provider components
│   ├── redux/                         # Redux Provider wrapper
│   ├── theme-registry/                # Emotion cache + theme registry (SSR-safe)
│   └── wrapper/                       # Wrapper components chung
│
├── features/                          # Feature modules (logic + components)
│   ├── admin/
│   │   ├── account/                   # Admin account management
│   │   ├── brands/                    # Brand CRUD UI
│   │   ├── categories/                # Category CRUD UI
│   │   ├── contacts/                  # Contact inquiries management
│   │   ├── events/                    # Events management
│   │   ├── orders/                    # Order management (list, detail, status)
│   │   ├── products/                  # Product management (4-step form)
│   │   ├── shipping/                  # Shipping partner management
│   │   ├── users/                     # User management
│   │   └── warranty/                  # Warranty claim management
│   │
│   └── user/
│       ├── about/                     # About page content
│       ├── account/                   # User account (profile, edit)
│       ├── auth/                      # Login, register, OAuth2, forgot/reset password
│       ├── brand/                     # Brand listing page
│       ├── cart/                      # Cart UI (CartItemList, CartSummary)
│       ├── category/                  # Category browsing
│       ├── checkout/                  # Checkout form (address, payment method)
│       ├── contact/                   # Contact form UI
│       ├── home/                      # Homepage sections
│       ├── news/                      # News list & detail
│       ├── order/                     # Order history, order detail
│       ├── payment/                   # Payment result pages (MoMo, VNPay)
│       ├── product-detail/            # Product detail page
│       ├── products/                  # Product listing with filters
│       ├── promotion/                 # Promotions listing
│       ├── questions/                 # Q&A page
│       ├── system/                    # System settings
│       ├── warranty/                  # Warranty management
│       └── wishlist/                  # Wishlist UI
│
├── lib/
│   ├── api/
│   │   ├── http.ts                    # Axios instance (interceptors, token refresh)
│   │   ├── token.ts                   # localStorage token management
│   │   ├── queryClient.ts             # React Query config (staleTime 60s)
│   │   └── cacheKeys.ts               # Query cache key constants
│   ├── hooks/
│   │   ├── useDebounce.ts             # Debounce hook (300ms)
│   │   └── useSnackbar.ts             # Snackbar hook
│   ├── socket/
│   │   └── SocketContext.tsx          # Socket.IO provider (notification + AI stream)
│   ├── toast/
│   │   └── ToastContext.tsx           # Toast notification context
│   └── utils/
│       ├── api_fetch.ts               # Generic fetch wrapper
│       ├── customHook.ts              # Utility hooks
│       ├── fetcherWithToken.ts        # SWR-compatible fetcher
│       └── ignoreCanceledError.ts     # Handle AbortController errors
│
├── redux/
│   ├── store.ts                       # Redux store (3 slices)
│   ├── slices/
│   │   ├── authSlice.ts               # Auth state: accessToken + user
│   │   ├── searchSlice.ts             # Search: keyword + scrollTrigger
│   │   └── wishlistSlice.ts           # Wishlist async thunk
│   └── selectors/
│       └── wishlistSelectors.ts       # selectWishlistItems, selectIsProductInWishlist
│
├── types/
│   ├── backend.d.ts                   # Global TypeScript types (API responses)
│   └── socket.io-client.d.ts          # Socket.IO type extensions
│
├── constants/
│   └── apiKeys.ts                     # API key constants
│
├── model/                             # Modal components (Brand, Category, Shipping)
├── styles/                            # Global CSS styles
└── configs/
    └── themeConfig.ts                 # App-level theme configuration
```

---

## 4. Tat Ca Trang & Routes

### Nguoi Dung (User Routes)

| Route | Mo ta |
|---|---|
| `/` | Trang chu voi day du sections |
| `/about` | Gioi thieu cong ty DoLa Tool |
| `/account` | Thong tin & chinh sua ho so |
| `/brand` | Danh sach thuong hieu |
| `/cart` | Gio hang |
| `/change-password` | Doi mat khau |
| `/checkout` | Dat hang & thanh toan |
| `/contact` | Form lien he |
| `/forgot-password` | Quen mat khau |
| `/login` | Dang nhap (email + OAuth2) |
| `/momo-payment` | Giao dien thanh toan MoMo |
| `/new` | Danh sach bai viet / tin tuc |
| `/new/[slug]` | Chi tiet bai viet |
| `/oauth2/callback` | Xu ly Google/Facebook callback |
| `/order` | Lich su don hang |
| `/payment/pending` | Don hang dang cho thanh toan |
| `/payment/return/momo` | Ket qua thanh toan MoMo |
| `/payment/return/vnpay` | Ket qua thanh toan VNPay |
| `/product` | Danh sach san pham (filter, search) |
| `/product/detail` | Chi tiet san pham |
| `/profile-complete` | Hoan thien ho so sau OAuth |
| `/promotion` | Danh sach khuyen mai |
| `/question` | Hoi dap |
| `/reset-password` | Dat lai mat khau |
| `/system` | Cai dat he thong |
| `/verify-email` | Xac thuc email |
| `/warranty` | Quan ly bao hanh |
| `/wishlist` | Danh sach yeu thich |

### Quan Tri (Admin Routes)

| Route | Mo ta |
|---|---|
| `/admin` | Dashboard: thong ke tong quan |
| `/admin/account-settings` | Cai dat tai khoan admin |
| `/admin/brands` | CRUD thuong hieu |
| `/admin/categories` | CRUD danh muc |
| `/admin/contacts` | Xem & xu ly lien he tu khach |
| `/admin/events` | Quan ly su kien |
| `/admin/orders` | Quan ly don hang, cap nhat trang thai |
| `/admin/products` | Danh sach san pham |
| `/admin/products/create` | Tao san pham moi (4-step wizard) |
| `/admin/products/update` | Cap nhat san pham |
| `/admin/products/view` | Xem chi tiet san pham |
| `/admin/shippings` | Quan ly doi tac van chuyen |
| `/admin/users` | Quan ly nguoi dung |
| `/admin/warranties` | Xem & xu ly yeu cau bao hanh |

---

## 5. State Management

### Redux Toolkit

**3 Slices:**

**`authSlice.ts`**
```typescript
State:   { accessToken: string | null, user: User | null }
Actions: setCredentials({ accessToken, user })  // sau khi login/refresh
         logout()                               // xoa token + user
```

**`searchSlice.ts`**
```typescript
State:   { keyword: string, scrollTrigger: boolean }
Actions: setKeyword(keyword)     // cap nhat tu khoa tim kiem
         clearKeyword()          // xoa tu khoa
         setScrollTrigger()      // trigger scroll den ket qua
```

**`wishlistSlice.ts`**
```typescript
State:   { result: WishListItem[], meta: PaginationMeta, loading, error }
Thunks:  fetchWishlist()         // async: GET /api/v1/wishlists voi token
Actions: clearWishlist()         // xoa khi logout
```

**Selectors:**
- `selectWishlistItems()` — Danh sach san pham yeu thich
- `selectIsProductInWishlist(productId)` — Kiem tra san pham co trong wishlist
- `selectWishlistMeta()` — Pagination metadata

### TanStack React Query

- `staleTime`: 60,000ms | `retry`: max 2, khong retry 401
- `refetchOnWindowFocus`: false
- DevTools: co trong development

Dung cho: product list, product detail, orders, promotions, reviews, brands, categories.

### React Contexts

| Context | Cung cap |
|---|---|
| `SettingsContext` | Theme mode (light/dark), skin, direction |
| `SocketContext` | notifications, unreadCount, markRead(), AI streaming events |
| `ToastContext` | showToast(type, message) — success/error/warning/info |

---

## 6. HTTP Client & API Integration

### Axios Instance (`src/lib/api/http.ts`)

```
Base URL:    NEXT_PUBLIC_BACKEND_URL   // http://localhost:8080
Timeout:     15,000ms
Credentials: withCredentials: true    // gui cookie tu dong
Headers:     Content-Type: application/json
             Accept-Language: vi
             X-Request-ID: <uuid>     // trace moi request
```

**Request Interceptor:** Tu dong gan `Authorization: Bearer <token>` tu localStorage.

**Response Interceptor:**
- Unwrap envelope: `{ status, message, data }` → tra ve `data` truc tiep
- **401 handling:** Queue pending requests → goi `POST /auth/refresh` (dung cookie) → retry queue
- Neu refresh that bai → dispatch `logout()` → redirect `/login`
- **429 / 503:** Hien thi thong bao rate limit

**API methods:**
```typescript
api.get<T>(url, config?)
api.post<T, D>(url, data, config?)
api.put<T, D>(url, data, config?)
api.patch<T, D>(url, data, config?)
api.delete<T>(url, config?)
```

---

## 7. Authentication Flow

### Email/Password Login
```
POST /auth/login → { accessToken, user }
→ Luu accessToken: localStorage + Redux
→ Refresh token: httpOnly cookie (BE set tu dong)
→ Redirect trang chu
```

### OAuth2 (Google / Facebook)
```
Click "Dang nhap Google"
→ Redirect /oauth2/authorization/google (BE)
→ Google xac thuc → callback /oauth2/callback/google
→ OAuth2CallbackView: lay token tu URL params → luu vao Redux
→ Neu chua du thong tin → redirect /profile-complete
→ Nguoc lai → trang chu
```

### Auto Token Refresh
```
Request → 401
→ Axios interceptor queue request
→ POST /auth/refresh (dung httpOnly cookie)
→ Nhan accessToken moi → retry tat ca queued requests
→ Neu refresh fail → logout() → /login
```

### TypeScript Types
```typescript
User {
  id: number
  username: string
  email: string
  phone?: string
  address?: string
  gender?: string
  picture?: string
  provider: "LOCAL" | "GOOGLE" | "FACEBOOK"
  emailVerified: boolean
  profileComplete: boolean
}
```

---

## 8. Homepage Sections

Trang chu chia thanh cac sections theo thu tu:

| Section | Component | Mo ta |
|---|---|---|
| Hero Banner | `BannerFeature` | Banner chinh voi CTA |
| Flash Sale | `FlashSaleShowcase` | San pham flash sale + countdown timer |
| Thuong hieu | `FeaturedBrandsSlider` | Slider logo hang (Husqvarna, Stihl, Honda...) |
| San pham moi | `NewProductSection` | Grid san pham moi nhat |
| Kien thuc | `KnowledgeShareSection` | Bai viet huong dan su dung may |
| Cong cu khac | `OtherToolsSection` | Danh muc san pham khac |
| Banner KM | `PromotionBanners` | Banner khuyen mai |
| Khach hang | `CustomerFeedbackSection` | Danh gia tu khach hang |
| Voucher | `VoucherCards` | The ma giam gia |
| Tin tuc | `NewsSection` | Bai viet / blog moi nhat |
| May 2 thi | `TwoStrokePromoBanner` | Banner gioi thieu dong may 2 thi |
| Ve DoLa | `AboutDolaToolSection` | Gioi thieu thuong hieu DoLa Tool |
| Danh muc | `CategoryWithProducts` | San pham theo tung danh muc |
| Danh muc list | `CategoryListings` | Tat ca danh muc |

---

## 9. AI Chat Widget

**File:** `src/components/fixed_elements/AiChatWidget.tsx`

Widget chat noi o goc phai man hinh, hien thi tren tat ca trang (ke ca chua login).

**Chuc nang:**
- Tu van chon may phu hop nhu cau
- Tra cuu thong tin san pham, gia ca
- Ho tro chinh sach bao hanh, doi tra
- Huong dan ky thuat (pha nhot 2 thi, bao duong...)
- Goi y san pham + link truc tiep

**Quick Reply mac dinh:**
- "Tu van may cua xich phu hop"
- "Chinh sach bao hanh nhu the nao?"
- "May cat co Honda gia bao nhieu?"
- "So sanh Husqvarna va Stihl"
- "Cach pha nhot 2 thi dung ti le"

**Ky thuat:**
- Session ID luu localStorage (dung ca khi chua login)
- AI response stream tung token qua Socket.IO event `chat:delta`
- Nut "Dung" khi AI dang tra loi
- Trich xuat link san pham tu response → hien thi dang chip
- Phat hien escalation (can ho tro con nguoi)
- Luu lich su session vao DB (qua backend)

**API su dung:**
- `POST /api/v1/ai/chat` → `{ sessionId, status: "processing" }`
- Socket events: `chat:delta` (token streaming), `chat:done`
- `GET /api/v1/ai/sessions/{sessionId}/messages` → lich su chat

---

## 10. Real-time Socket.IO

**Config** (`src/lib/socket/SocketContext.tsx`):
```
URL:        NEXT_PUBLIC_SOCKET_URL     // http://localhost:9092
Path:       /ws
Transports: ['websocket', 'polling']  // WebSocket uu tien
Version:    socket.io-client 2.5.0    // Tuong thich netty-socketio v2
```

**Notification events:**

| Event | Huong | Mo ta |
|---|---|---|
| `notification:bootstrap` | Server → Client | Batch thong bao cu khi moi connect |
| `notification` | Server → Client | Thong bao moi real-time |
| `notifications:mark_read` | Client ↔ Server | Danh dau 1 thong bao da doc |
| `notifications:mark_all` | Client ↔ Server | Danh dau tat ca da doc |

**AI streaming events:**

| Event | Mo ta |
|---|---|
| `chat:delta` | Tung token AI response |
| `chat:done` | Ket thuc streaming |

**Context API:**
```typescript
{
  notifications: NotificationItem[]
  unreadCount: number
  connected: boolean
  markRead(id: number): void      // Optimistic update
  markAllRead(): void
  refresh(): void                  // Force refetch tu HTTP
}
```

---

## 11. UI & Theme

### Material-UI (MUI) 7.1.0

Tat ca UI components dung MUI. Custom theme day du tai `src/@core/theme/`:
- **Palette:** Custom primary/secondary, light/dark mode
- **Typography:** Font families, responsive sizes
- **Component Overrides:** Buttons, inputs, cards, tables, dialogs, pagination

### Fixed Elements (Luon hien thi)

| Component | Vi tri | Chuc nang |
|---|---|---|
| `AiChatWidget` | Bottom-right | AI chat assistant |
| `button_contact` | Fixed sidebar | Nut lien he nhanh (Zalo/Phone) |
| `button_scroll_to_top` | Bottom-right | Cuon len dau trang |
| `warranty_aquestion` | Fixed sidebar | Hoi nhanh ve bao hanh |

---

## 12. Tinh Nang San Pham

### Danh sach san pham (`/product`)
- Filter: danh muc, thuong hieu, khoang gia, tu khoa (debounced 300ms)
- Pagination
- Badge: Moi, Het hang
- Wishlist toggle tren card
- Sort options

### Chi tiet san pham (`/product/detail`)
- Gallery anh + lightbox (Yet Another React Lightbox)
- Thong so ky thuat day du:
  - Loai dong co: 2-thi / 4-thi
  - Cong suat (HP/kW), nhien lieu, dung tich binh xang
  - Khoi luong, kich thuoc, xuat xu
  - Thoi gian bao hanh (thang)
- Gia (goc + sau khuyen mai)
- Them vao gio / wishlist
- Danh gia khach hang (stars + text)
- San pham lien quan

### Tao san pham Admin (4-Step Wizard)
- **Buoc 1:** Ten, mo ta, gia, gia goc, danh muc, thuong hieu
- **Buoc 2:** Thong so ky thuat (cong suat, nhien lieu, dong co, trong luong...)
- **Buoc 3:** Ton kho, so thang bao hanh
- **Buoc 4:** Upload anh (avatar + 3 anh chi tiet) → Cloudinary

---

## 13. Luong Mua Hang

```
1. Duyet san pham (/product)
2. Xem chi tiet (/product/detail)
3. Them vao gio → /carts/count cap nhat badge header
4. Gio hang (/cart) → chinh sua so luong, xoa item
5. Dat hang (/checkout)
   - Nhap dia chi giao hang (Vietnam address picker)
   - Chon phuong thuc: MoMo / VNPay / COD
   - Ap ma khuyen mai → GET /promotions/validate
6a. MoMo/VNPay:
    POST /payments/{orderId}/momo
    → Redirect toi cong thanh toan
    → Return URL → /payment/return/momo
    → Hien thi ket qua
6b. COD:
    Don hang tao voi status PENDING
    → Notification real-time cho admin
7. Xem lich su don hang (/order)
   - Filter theo trang thai
   - Chi tiet don, tracking van chuyen
```

---

## 14. Dashboard Admin

### Widgets thong ke:
- Tong quan: doanh thu, don hang, khach hang, san pham
- Best-selling products (top N)
- Weekly revenue comparison (bieu do cot)
- Monthly brand sales report
- Profit summary, total refunds
- Visitor stats / traffic analytics

### Charts:
- **ApexCharts:** Line chart doanh thu, Bar chart theo thuong hieu
- **MUI X-Charts:** Pie chart danh muc, Area chart traffic

---

## 15. Environment Configuration

### Development (`.env.local`)
```env
BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_BE_URL=http://localhost:8080
NEXT_PUBLIC_SOCKET_URL=http://localhost:9092
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<key>
NEXT_PUBLIC_GOOGLE_MAPS_ID=<id>
```

### Production (`.env`)
```env
BACKEND_URL=https://saleswebsite-be.onrender.com
NEXT_PUBLIC_BACKEND_URL=https://saleswebsite-be.onrender.com
```

### Scripts
```bash
npm run dev      # Dev server tren port 8767
npm run build    # Build production
npm run start    # Production server tren port 8767
npm run lint     # ESLint check
```

---

## 16. Khoi Chay Du An

### Prerequisites
- Node.js 20+
- Backend dang chay tai `localhost:8080`
- Socket.IO server tai `localhost:9092`

### Cai dat & chay
```bash
npm install

# Tao file .env.local
cp .env.example .env.local
# Chinh sua NEXT_PUBLIC_BACKEND_URL, NEXT_PUBLIC_SOCKET_URL

npm run dev
# → http://localhost:8767
```

### Ports
| Port | Service |
|---|---|
| `8767` | Next.js Frontend |
| `8080` | Spring Boot Backend API |
| `9092` | Socket.IO Server |

---

## 17. TypeScript Types Quan Trong

```typescript
// Auth
User { id, username, email, phone, address, gender, picture,
       provider: "LOCAL"|"GOOGLE"|"FACEBOOK", emailVerified, profileComplete }

// Product
Product { id, name, slug, description, price, pricePerUnit, stockQuantity,
          power, fuelType, engineType, weight, dimensions, tankCapacity,
          origin, warrantyMonths, rating, imageAvt, imageDetail1..3,
          brand: Brand, category: ProductCategory, active }

// Order
Order { id, status: "PENDING"|"PROCESSING"|"SHIPPED"|"DELIVERED"|"CANCELLED",
        totalAmount, shippingAmount, shippingAddress, paymentMethod,
        trackingNumber, user, payment, orderDetails }

// Notification
NotificationItem { id, type, title, content, link?, read, createdAt, metadataJson? }

// API Response envelope
ApiResponse<T> { status: number, message?: string, data: T }

// Pagination
PaginationMeta { page, pageSize, totalPages, totalElements }
```

---

## 18. Patterns & Best Practices

| Pattern | Ap dung |
|---|---|
| Feature-based structure | features/user/, features/admin/ — moi tinh nang doc lap |
| Server/Client Components | Next.js App Router: Server Component mac dinh, "use client" khi can |
| Optimistic updates | Wishlist toggle, notification mark read |
| Axios interceptor queue | Tranh nhieu request refresh token dong thoi |
| React Query + Redux | Query cho server state, Redux cho client state (auth, search, wishlist) |
| Zod schema validation | Validate tat ca form truoc khi submit |
| Debounced search | 300ms delay cho product search |
| Framer Motion | Animate page transitions, widget open/close |
| Emotion cache | SSR-safe CSS-in-JS voi Next.js |

---

## 19. Lien Ket Voi Backend

Backend repository: `saleswebsite_be` (Spring Boot 3.4.5, Java 21)

| Giao tiep | Chi tiet |
|---|---|
| REST API | `http://localhost:8080/api/v1/**` |
| Socket.IO | `http://localhost:9092` (path: `/ws`, protocol v2) |
| OAuth2 redirect | BE redirect ve `http://localhost:8767` sau khi xac thuc |
| File/Image | Cloudinary CDN URLs (luu trong DB) |
| Auth token | Access token: localStorage, Refresh token: httpOnly cookie (BE set) |
| CORS | BE whitelist: `localhost:8767`, `localhost:3000` |

---

*Tai lieu nay duoc tao de phuc vu developer doc hieu du an va cung cap day du context cho AI assistant trong cac cuoc hoi thoai ve SalesWebsite Frontend (DoLa Tool).*
