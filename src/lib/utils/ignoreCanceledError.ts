export const ignoreCanceledError = (err: unknown): boolean => {
  if (
    err instanceof Error &&
    (err.name === "CanceledError" || err.message === "canceled")
  ) {
    return true; // Đã bỏ qua
  }
  return false; // Lỗi thật
};

export const logIfNotCanceled = (err: unknown, message: string) => {
  if (!ignoreCanceledError(err)) {
    console.error(message, err);
  }
};
