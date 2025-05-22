"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function NprogressWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ProgressBar
        height="2px"
        color="#FFFFFF"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
