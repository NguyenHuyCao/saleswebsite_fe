"use client";

import {
  Box,
  IconButton,
  TextField,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setKeyword, setScrollTrigger } from "@/redux/slices/searchSlice";
import Menu from "mdi-material-ui/Menu";
import Magnify from "mdi-material-ui/Magnify";
import { AppState } from "@/redux/store";

interface Props {
  hidden: boolean;
  toggleNavVisibility: () => void;
}

const AdminSearchInput = ({ hidden, toggleNavVisibility }: Props) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const hiddenSm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const keyword = useSelector((state: AppState) => state.search.keyword);
  const [searchValue, setSearchValue] = useState(keyword);

  // Reset ô tìm kiếm khi đổi route
  useEffect(() => {
    setSearchValue("");
    dispatch(setKeyword(""));
  }, [pathname, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);

    if (newValue.trim() === "") {
      dispatch(setKeyword("")); // xoá filter
      dispatch(setScrollTrigger(true)); // nếu cần cuộn lại hoặc reset
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      dispatch(setKeyword(searchValue));
      dispatch(setScrollTrigger(true));
    }
  };

  return (
    <Box
      className="actions-left"
      sx={{ mr: 2, display: "flex", alignItems: "center" }}
    >
      {hidden ? (
        <IconButton
          color="inherit"
          onClick={toggleNavVisibility}
          sx={{ ml: -2.75, ...(hiddenSm ? {} : { mr: 3.5 }) }}
        >
          <Menu />
        </IconButton>
      ) : null}
      <TextField
        size="small"
        value={searchValue}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        placeholder="Tìm kiếm..."
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Magnify fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default AdminSearchInput;
