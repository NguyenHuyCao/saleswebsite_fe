"use client";

import { forwardRef, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  SxProps,
  Theme,
} from "@mui/material";

const headerSX = {
  p: 2.5,
  "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
};

interface MainCardProps {
  border?: boolean;
  boxShadow?: boolean;
  children: ReactNode;
  subheader?: ReactNode;
  content?: boolean;
  contentSX?: SxProps<Theme>;
  darkTitle?: boolean;
  divider?: boolean;
  elevation?: number;
  secondary?: ReactNode;
  shadow?: string;
  sx?: SxProps<Theme>;
  title?: ReactNode;
  codeHighlight?: boolean;
  codeString?: string;
  modal?: boolean;
  [key: string]: any;
}

const MainCard = forwardRef<HTMLDivElement, MainCardProps>(
  (
    {
      border = true,
      boxShadow,
      children,
      subheader,
      content = true,
      contentSX = {},
      darkTitle,
      divider = true,
      elevation,
      secondary,
      shadow,
      sx = {},
      title,
      codeHighlight = false,
      codeString,
      modal = false,
      ...others
    },
    ref
  ) => {
    return (
      <Card
        elevation={elevation || 0}
        ref={ref}
        sx={(theme) => ({
          position: modal ? "absolute" : "relative",
          border: border ? "1px solid" : "none",
          borderRadius: 1,
          borderColor: theme.palette.grey[800],
          boxShadow:
            boxShadow && !border ? shadow || theme.shadows[1] : "inherit",
          ":hover": {
            boxShadow:
              boxShadow && !border ? shadow || theme.shadows[1] : "inherit",
          },
          ...(modal && {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "calc(100% - 50px)", sm: "auto" },
            maxWidth: 768,
            "& .MuiCardContent-root": {
              overflowY: "auto",
              maxHeight: "calc(100vh - 200px)",
            },
          }),
          ...((typeof sx === "function" ? sx(theme) : sx) as any),
        })}
        {...others}
      >
        {title && !darkTitle && (
          <CardHeader
            sx={headerSX}
            titleTypographyProps={{ variant: "subtitle1" }}
            title={title}
            action={secondary}
            subheader={subheader}
          />
        )}

        {title && divider && <Divider />}

        {content ? (
          <CardContent sx={contentSX}>{children}</CardContent>
        ) : (
          children
        )}
      </Card>
    );
  }
);

MainCard.displayName = "MainCard";
export default MainCard;
