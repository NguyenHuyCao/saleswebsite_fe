import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  keyword: string;
  scrollTrigger: boolean;
}

const initialState: SearchState = {
  keyword: "",
  scrollTrigger: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setKeyword(state, action: PayloadAction<string>) {
      state.keyword = action.payload;
    },
    clearKeyword(state) {
      state.keyword = "";
    },
    setScrollTrigger(state, action) {
      state.scrollTrigger = action.payload;
    },
  },
});

export const { setKeyword, setScrollTrigger, clearKeyword } =
  searchSlice.actions;
export default searchSlice.reducer;
