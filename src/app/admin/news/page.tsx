import { Metadata } from "next";
import NewsManagementView from "@/features/admin/news/components/NewsManagementView";

export const metadata: Metadata = {
  title: "Quản lý tin tức",
};

export default function Page() {
  return <NewsManagementView />;
}
