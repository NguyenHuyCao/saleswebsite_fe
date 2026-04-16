"use client";

import type { StoreOrder } from "../../types";

// ── Cấu hình cửa hàng – chỉnh lại theo thực tế ──────────────────────────────
const STORE_NAME    = "Cửa hàng";
const STORE_ADDRESS = "";
const STORE_PHONE   = "";
const RETURN_POLICY = "Hàng đã mua không đổi trả sau 7 ngày.";

const PM_VN: Record<string, string> = {
  CASH: "Tiền mặt",
  TRANSFER: "Chuyển khoản",
  CARD: "Quẹt thẻ",
};

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

interface Props {
  order: StoreOrder;
}

/** Hidden div – dùng để đọc innerHTML khi in hóa đơn. */
export default function InvoiceTemplate({ order }: Props) {
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : new Date().toLocaleString("vi-VN");

  return (
    <div id="invoice-print-area" style={{ display: "none" }}>
      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 2 }}>{STORE_NAME}</div>
        {STORE_ADDRESS && <div style={{ fontSize: 12 }}>{STORE_ADDRESS}</div>}
        {STORE_PHONE   && <div style={{ fontSize: 12 }}>ĐT: {STORE_PHONE}</div>}
      </div>

      <div style={{ textAlign: "center", fontSize: 16, fontWeight: "bold", marginBottom: 6 }}>
        HÓA ĐƠN BÁN HÀNG
      </div>

      <div style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000", padding: "6px 0", marginBottom: 8, fontSize: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span><strong>Mã đơn:</strong></span><span>{order.orderCode}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span><strong>Ngày:</strong></span><span>{date}</span>
        </div>
        {order.createdBy && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span><strong>Nhân viên:</strong></span><span>{order.createdBy}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span><strong>Kho:</strong></span><span>{order.warehouseName}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span><strong>T.Toán:</strong></span><span>{PM_VN[order.paymentMethod] ?? order.paymentMethod}</span>
        </div>
        {order.customerName && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span><strong>Khách:</strong></span><span>{order.customerName}</span>
          </div>
        )}
        {order.customerPhone && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span><strong>SĐT:</strong></span><span>{order.customerPhone}</span>
          </div>
        )}
      </div>

      {/* ── Items table ── */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 8 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left",  padding: "3px 2px", borderBottom: "1px solid #666" }}>Sản phẩm</th>
            <th style={{ textAlign: "center", padding: "3px 2px", borderBottom: "1px solid #666" }}>SL</th>
            <th style={{ textAlign: "right",  padding: "3px 2px", borderBottom: "1px solid #666" }}>Đơn giá</th>
            <th style={{ textAlign: "right",  padding: "3px 2px", borderBottom: "1px solid #666" }}>T.Tiền</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i}>
              <td style={{ padding: "3px 2px", borderBottom: "1px solid #eee", verticalAlign: "top" }}>
                <div>{item.productNameSnap}</div>
                {item.variantSnap && (
                  <div style={{ fontSize: 10, color: "#666" }}>{item.variantSnap}</div>
                )}
                {item.discountAmount > 0 && (
                  <div style={{ fontSize: 10, color: "#c00" }}>Giảm: {fmt(item.discountAmount)}</div>
                )}
              </td>
              <td style={{ textAlign: "center", padding: "3px 2px", borderBottom: "1px solid #eee" }}>
                {item.quantity}
              </td>
              <td style={{ textAlign: "right", padding: "3px 2px", borderBottom: "1px solid #eee" }}>
                {fmt(item.unitPrice)}
              </td>
              <td style={{ textAlign: "right", padding: "3px 2px", borderBottom: "1px solid #eee" }}>
                {fmt(item.totalPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Summary ── */}
      <div style={{ borderTop: "1px dashed #000", paddingTop: 6, fontSize: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
          <span>Tạm tính:</span><span>{fmt(order.subtotal)}</span>
        </div>
        {order.discountAmount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <span>Giảm giá:</span><span>-{fmt(order.discountAmount)}</span>
          </div>
        )}
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontWeight: "bold", fontSize: 14,
          borderTop: "2px solid #000", marginTop: 4, paddingTop: 4, marginBottom: 4,
        }}>
          <span>TỔNG THANH TOÁN:</span><span>{fmt(order.totalAmount)}</span>
        </div>
        {order.paymentMethod === "CASH" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span>Tiền nhận:</span><span>{fmt(order.amountPaid)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Tiền thừa:</span><span style={{ fontWeight: "bold" }}>{fmt(order.amountChange)}</span>
            </div>
          </>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, borderTop: "1px dashed #000", paddingTop: 10 }}>
        <div style={{ fontWeight: "bold", marginBottom: 4 }}>Cảm ơn quý khách đã mua hàng!</div>
        <div>{RETURN_POLICY}</div>
      </div>
    </div>
  );
}
