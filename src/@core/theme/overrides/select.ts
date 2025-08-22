// chọn đúng đường dẫn bạn đang dùng
import { Theme } from "@mui/material/styles";

const Select = (theme: Theme) => ({
  MuiSelect: {
    styleOverrides: {
      select: {
        minWidth: "6rem !important",
        "&.MuiTablePagination-select": { minWidth: "1rem !important" },
      },
    },
  },
});

export default Select;
