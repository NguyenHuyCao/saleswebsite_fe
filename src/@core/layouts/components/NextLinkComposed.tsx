"use client"; // nếu cần dùng trong client component

import * as React from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { forwardRef } from "react";

export interface NextLinkComposedProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    Omit<NextLinkProps, "href" | "as"> {
  to: NextLinkProps["href"];
  linkAs?: NextLinkProps["as"];
}

const NextLinkComposed = forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
  function NextLinkComposed(props, ref) {
    const { to, linkAs, replace, scroll, shallow, prefetch, locale, ...rest } =
      props;

    return (
      <NextLink
        href={to}
        as={linkAs}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        prefetch={prefetch}
        locale={locale}
        passHref
        ref={ref}
        {...rest}
      />
    );
  }
);

export default NextLinkComposed;
