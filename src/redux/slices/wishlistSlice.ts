import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  totalStock: number;
  power: string;
  fuelType: string;
  imageAvt: string;
  imageDetail1: string | null;
  imageDetail2: string | null;
  imageDetail3: string | null;
  engineType: string;
  weight: number;
  dimensions: string;
  description: string;
  tankCapacity: number;
  origin: string;
  warrantyMonths: number;
  slug: string;
  active: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  brandName: string;
  categoryName: string;
  rating: number;
  pricePerUnit: number;
  wishListUser: boolean;
}

export interface WishlistMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

interface WishlistState {
  result: WishlistProduct[];
  meta: WishlistMeta | null;
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  result: [],
  meta: null,
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Không có token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wish_list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Lỗi khi gọi API danh sách yêu thích");

      const data = await res.json();
      return {
        result: data.data.result as WishlistProduct[],
        meta: data.data.meta as WishlistMeta,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.result = [];
      state.meta = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWishlist.fulfilled,
        (
          state,
          action: PayloadAction<{
            result: WishlistProduct[];
            meta: WishlistMeta;
          }>
        ) => {
          state.result = action.payload.result;
          state.meta = action.payload.meta;
          state.loading = false;
        }
      )
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
