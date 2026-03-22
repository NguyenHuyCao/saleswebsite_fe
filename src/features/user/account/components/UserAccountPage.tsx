"use client";

import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Fade,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Avatar,
  Stack,
  Chip,
  Divider,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Gender, UserProfile } from "../types";
import { useUpdateUser, useUserProfile, useUserStats } from "../queries";
import { useMeQuery } from "@/features/user/auth/queries";
import { useToast } from "@/lib/toast/ToastContext";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Cake,
  Wc,
  Edit,
  Save,
  VpnKey,
  History,
  ShoppingBag,
  Favorite,
} from "@mui/icons-material";
import Image from "next/image";

const GENDERS: Gender[] = ["Nam", "Nữ", "Khác"];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserAccountPage() {
  const { showToast } = useToast();
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Lấy userId từ /auth/account — đảm bảo luôn có data kể cả sau OAuth login
  const { data: me } = useMeQuery();
  const userId = me?.id ?? undefined;

  const { data, isLoading } = useUserProfile(userId);
  const { data: userStats } = useUserStats(userId ?? undefined);
  const { mutateAsync: mutateUpdate, isPending } = useUpdateUser(
    userId ?? undefined,
  );

  const [formData, setFormData] = useState<UserProfile>({
    id: 0,
    username: "",
    email: "",
    phone: "",
    address: "",
    gender: "Nam",
    birthDate: "",
    avatar: "",
    createdAt: "",
  });

  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const updateData: any = {
        username: formData.username,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
      };

      if (formData.birthDate) {
        updateData.birthDate = formData.birthDate;
      }

      await mutateUpdate(updateData);

      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...localUser, ...formData }),
      );

      showToast("Thông tin tài khoản đã được cập nhật.", "success", "Cập nhật thành công");
      setEditing(false);
    } catch (err: any) {
      showToast(err?.message || "Lỗi kết nối máy chủ!", "error");
    }
  };

  const loading = isLoading || !userId;

  return (
    <Box ref={formRef} px={{ xs: 2, sm: 4 }} py={4}>
      <Grid container spacing={4}>
        {/* Left Column - Profile Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Fade in timeout={600}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              elevation={4}
              sx={{ p: 3, borderRadius: 3, textAlign: "center" }}
            >
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={avatarPreview || formData.avatar}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 2,
                    border: "3px solid #ffb700",
                    cursor: "pointer",
                  }}
                  onClick={handleAvatarClick}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <Tooltip title="Đổi ảnh đại diện">
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "#ffb700",
                      "&:hover": { bgcolor: "#ffa000" },
                    }}
                    onClick={handleAvatarClick}
                  >
                    <Edit sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>

              <Typography variant="h5" fontWeight={700} gutterBottom>
                {formData.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <Email sx={{ fontSize: 16, mr: 0.5 }} />
                {formData.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Cake sx={{ fontSize: 16, mr: 0.5 }} />
                {formData.birthDate
                  ? new Date(formData.birthDate).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Stats Cards */}
              <Stack spacing={2}>
                <Card variant="outlined">
                  <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ShoppingBag sx={{ color: "#f25c05" }} />
                        <Typography>Tổng đơn hàng</Typography>
                      </Stack>
                      <Typography fontWeight={700} color="#f25c05">
                        {userStats?.totalOrders || 0}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Favorite sx={{ color: "#f25c05" }} />
                        <Typography>Yêu thích</Typography>
                      </Stack>
                      <Typography fontWeight={700} color="#f25c05">
                        {userStats?.wishlistCount || 0}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <History sx={{ color: "#f25c05" }} />
                        <Typography>Tham gia</Typography>
                      </Stack>
                      <Typography fontWeight={700} color="#f25c05">
                        {formData.createdAt
                          ? new Date(formData.createdAt).toLocaleDateString(
                              "vi-VN",
                            )
                          : "N/A"}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Paper>
          </Fade>
        </Grid>

        {/* Right Column - Tabs */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Fade in timeout={600}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              elevation={4}
              sx={{ p: 3, borderRadius: 3 }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  mb: 2,
                  "& .MuiTab-root": { fontWeight: 600 },
                  "& .Mui-selected": { color: "#f25c05" },
                  "& .MuiTabs-indicator": { bgcolor: "#f25c05" },
                }}
              >
                <Tab label="Thông tin cá nhân" />
                <Tab label="Đổi mật khẩu" />
                <Tab label="Địa chỉ giao hàng" />
              </Tabs>

              {/* Tab 1: Personal Info */}
              <TabPanel value={tabValue} index={0}>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 3 }}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      Thông tin cá nhân
                    </Typography>
                    <Button
                      variant={editing ? "contained" : "outlined"}
                      startIcon={<Edit />}
                      onClick={() => setEditing(!editing)}
                      sx={{
                        borderColor: "#ffb700",
                        color: editing ? "#fff" : "#f25c05",
                        bgcolor: editing ? "#f25c05" : "transparent",
                      }}
                    >
                      {editing ? "Hủy" : "Chỉnh sửa"}
                    </Button>
                  </Stack>

                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Họ và tên"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          required
                          disabled={!editing || loading || isPending}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          value={formData.email}
                          disabled
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Số điện thoại"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          disabled={!editing || loading || isPending}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Địa chỉ"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          multiline
                          rows={2}
                          required
                          disabled={!editing || loading || isPending}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationOn />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Ngày sinh"
                          name="birthDate"
                          type="date"
                          value={formData.birthDate || ""}
                          onChange={handleChange}
                          disabled={!editing || loading || isPending}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Cake />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                          component="fieldset"
                          disabled={!editing || loading || isPending}
                        >
                          <FormLabel component="legend">Giới tính</FormLabel>
                          <RadioGroup
                            row
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                          >
                            {GENDERS.map((g) => (
                              <FormControlLabel
                                key={g}
                                value={g}
                                control={<Radio />}
                                label={g}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </Grid>

                      {editing && (
                        <Grid size={{ xs: 12 }}>
                          <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={loading || isPending}
                            startIcon={<Save />}
                            sx={{
                              bgcolor: "#ffb700",
                              color: "#000",
                              fontWeight: 600,
                              textTransform: "none",
                              py: 1.5,
                              "&:hover": { bgcolor: "#e09e00" },
                            }}
                          >
                            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </form>
                </Box>
              </TabPanel>

              {/* Tab 2: Change Password */}
              <TabPanel value={tabValue} index={1}>
                <Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                    Đổi mật khẩu
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Mật khẩu hiện tại"
                        type="password"
                        name="currentPassword"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <VpnKey />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Mật khẩu mới"
                        type="password"
                        name="newPassword"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Xác nhận mật khẩu"
                        type="password"
                        name="confirmPassword"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          bgcolor: "#ffb700",
                          color: "#000",
                          fontWeight: 600,
                          py: 1.5,
                        }}
                      >
                        Cập nhật mật khẩu
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>

              {/* Tab 3: Shipping Address */}
              <TabPanel value={tabValue} index={2}>
                <Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                    Sổ địa chỉ
                  </Typography>
                  <Typography color="text.secondary">
                    Tính năng đang phát triển...
                  </Typography>
                </Box>
              </TabPanel>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
}
