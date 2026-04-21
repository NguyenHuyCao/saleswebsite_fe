// app/product/detail/page.tsx
import type { Metadata } from "next";
import ProductDetailView from "@/features/user/product-detail/ProductDetailView";
import { getProductDetailBySlug } from "@/features/user/product-detail/api";

interface Props {
  searchParams: Promise<{ name?: string; slug?: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cuonghoa.vn";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const slug = params.name || params.slug;
  if (!slug) return { title: "Sản phẩm | Cường Hoa" };

  try {
    const { product, category } = await getProductDetailBySlug(slug);
    if (!product) return { title: "Sản phẩm | Cường Hoa" };

    const description =
      product.description ||
      `Mua ${product.name} chính hãng tại Cường Hoa. ${product.warrantyMonths ? `Bảo hành ${product.warrantyMonths} tháng. ` : ""}Giao hàng toàn quốc.`;

    const ogImages = [
      product.imageAvt,
      product.imageDetail1,
      product.imageDetail2,
    ]
      .filter(Boolean)
      .slice(0, 1)
      .map((img) => ({
        url: img!.startsWith("http") ? img! : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/${img}`,
        width: 800,
        height: 800,
        alt: product.name,
      }));

    return {
      metadataBase: new URL(SITE_URL),
      title: `${product.name} | Cường Hoa`,
      description,
      keywords: [
        product.name,
        category?.name ?? "máy công cụ",
        product.origin || "",
        "Cường Hoa",
        "máy 2 thì",
      ].filter(Boolean),
      alternates: { canonical: `/product/detail?name=${slug}` },
      robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
      },
      openGraph: {
        title: product.name,
        description,
        type: "website",
        url: `/product/detail?name=${slug}`,
        siteName: "Cường Hoa",
        locale: "vi_VN",
        images: ogImages.length > 0 ? ogImages : [{ url: `${SITE_URL}/images/banner/banner-ab.jpg`, width: 1200, height: 630, alt: product.name }],
      },
      twitter: {
        card: "summary_large_image",
        site: "@cuonghoa",
        title: product.name,
        description,
        images: ogImages.length > 0 ? [ogImages[0].url] : [`${SITE_URL}/images/banner/banner-ab.jpg`],
      },
    };
  } catch {
    return { title: "Sản phẩm | Cường Hoa" };
  }
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const slug = params.name || params.slug;
  return <ProductDetailView slug={slug} />;
}
