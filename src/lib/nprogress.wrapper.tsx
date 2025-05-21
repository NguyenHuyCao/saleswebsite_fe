"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function NprogressWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ProgressBar
          height="2px"
          color="#fffd00"
          options={{ showSpinner: false }}
          shallowRouting
        />
      </body>
    </html>
  );
}
