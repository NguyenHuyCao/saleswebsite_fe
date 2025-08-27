// app/(user)/page.tsx
import HomeView from "@/features/user/home/HomeView";

export default function Page() {
  return <HomeView />; // KHÔNG gọi hàm client ở đây
}
