"use client";

import { useState, forwardRef, ChangeEvent } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
// import DatePicker from "react-datepicker";
// import DatePickerWrapper from "@/styles/libs/react-datepicker";

const ImgStyled = styled("img")(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius,
}));

// const CustomInput = forwardRef((props: any, ref) => (
//   <TextField inputRef={ref} label="Ngày sinh" fullWidth {...props} />
// ));

const UserCombinedForm = ({ onNext }: { onNext: () => void }) => {
  const [imgSrc, setImgSrc] = useState("/images/avatars/1.png");
  // const [date, setDate] = useState<Date | null | undefined>(null);

  const onChangeImage = (file: ChangeEvent) => {
    const reader = new FileReader();
    const { files } = file.target as HTMLInputElement;
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string);
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {/* Ảnh đại diện */}
      <Box display="flex" flexDirection="column" gap={4}>
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <ImgStyled src={imgSrc} alt="Profile Pic" />
          <Box>
            <Button
              variant="contained"
              component="label"
              htmlFor="upload-image"
            >
              Tải ảnh lên
              <input
                hidden
                type="file"
                onChange={onChangeImage}
                accept="image/png, image/jpeg"
                id="upload-image"
              />
            </Button>
            <Button
              color="error"
              variant="outlined"
              sx={{ ml: 4.5, mt: { sm: 0, xs: 4 } }}
              onClick={() => setImgSrc("/images/avatars/1.png")}
            >
              Đặt lại
            </Button>
            <Typography variant="body2" sx={{ mt: 5 }}>
              Chỉ hỗ trợ định dạng PNG hoặc JPEG. Dung lượng tối đa 800KB.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Thông tin cá nhân */}
      <Box>
        <Typography variant="h6" mb={3}>
          Thông tin cá nhân
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Họ và tên" defaultValue="John Doe" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              defaultValue="johnDoe@example.com"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Số điện thoại"
              placeholder="(0123) 456-789"
            />
          </Grid>
        </Grid>
        <FormControl sx={{ mt: 4 }}>
          <FormLabel>Giới tính</FormLabel>
          <RadioGroup row defaultValue="male">
            <FormControlLabel value="male" label="Nam" control={<Radio />} />
            <FormControlLabel value="female" label="Nữ" control={<Radio />} />
            <FormControlLabel value="other" label="Khác" control={<Radio />} />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Thiết lập tài khoản */}
      <Box>
        <Typography variant="h6" mb={3}>
          Thiết lập tài khoản
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <TextField sx={{ width: "120px" }} label="Quản trị viên" disabled />
            {/* <FormControl fullWidth>
              <InputLabel>Vai trò</InputLabel>
              <Select label="Vai trò" defaultValue="admin" disabled>
                <MenuItem value="admin">Quản trị viên</MenuItem>
                <MenuItem value="subscriber">Người dùng</MenuItem>
              </Select>
            </FormControl> */}
          </Grid>
          <Grid item xs={12} md={8}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select label="Trạng thái" defaultValue="active">
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Không hoạt động</MenuItem>
                <MenuItem value="pending">Chờ xác nhận</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Nút chuyển bước */}
      <Box>
        <Button variant="contained" onClick={onNext}>
          Tiếp theo
        </Button>
      </Box>
    </Box>
  );
};

export default UserCombinedForm;
