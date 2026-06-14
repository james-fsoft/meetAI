# TransFlash — Mô hình chi phí & lợi nhuận (hướng dẫn)

## Cách dùng file `unit-economics.csv`
1. Mở **Google Sheets** → File → **Import** → Upload `unit-economics.csv` → chọn **"Replace spreadsheet"**, bật **"Convert text to numbers, dates, and formulas"**.
2. Các cột **Doanh thu / COGS / Phí / Lợi nhuận / Biên %** tự tính bằng công thức.
3. Chỉ cần đổi 2 thứ để chạy kịch bản: cột **"Số user"** (D) và các ô **GIẢ ĐỊNH** (tỷ giá, giá Soniox, tỷ lệ dùng).

> ⚠️ File dùng cho **Google Sheets**. Nếu mở bằng Excel, công thức có thể hiện dạng text — khi đó nhập tay công thức theo phần dưới.

---

## Công thức cốt lõi
- **Doanh thu** = Giá/tháng × Số user
- **COGS (chi phí dịch)** = (Quota phút ÷ 60) × **Tỷ lệ dùng** × Giá Soniox $/giờ × Tỷ giá × Số user
- **Phí thanh toán** = Doanh thu × 7%
- **Lợi nhuận** = Doanh thu − COGS − Phí thanh toán
- **Biên %** = Lợi nhuận ÷ Doanh thu

Mấu chốt: COGS tính theo **phút thực dùng** (× tỷ lệ dùng 45%), không phải toàn bộ quota — vì đa số user không xài hết.

---

## Snapshot ví dụ (100 Free + 20 Pro + 5 Business, dùng 45% quota)

| Gói | Giá/th | User | Doanh thu | COGS | Phí TT | Lợi nhuận | Biên |
|---|---|---|---|---|---|---|---|
| Free | 0 | 100 | 0đ | ~571.000đ | 0 | −571.000đ | — |
| Pro | 199k | 20 | 3.980.000đ | ~457.000đ | 279.000đ | **~3.244.000đ** | ~82% |
| Business | 599k | 5 | 2.995.000đ | ~457.000đ | 210.000đ | **~2.328.000đ** | ~78% |
| **Tổng** | | **125** | **6.975.000đ** | **~1.485.000đ** | **489.000đ** | **~5.001.000đ** | **~72%** |

→ Với tệp nhỏ này: **lãi ~5 triệu/tháng**, biên gộp ~72% (đã gánh cả chi phí 100 user Free).

*(COGS Free cao vì 100 user × 30 phút — đây là chi phí thu hút khách. Khi tỷ lệ Free→Pro tăng, mỗi Free user là một khách tiềm năng.)*

---

## Điểm hòa vốn
- Chi phí cố định ước tính giai đoạn đầu: Vercel + Supabase + domain ≈ **$20–45/tháng** (~0.5–1.1 triệu đ).
- 1 user **Pro** lãi ròng ~**162.000đ/tháng**; 1 user **Business** lãi ~**466.000đ/tháng**.
- → **Hòa vốn chỉ cần ~3–7 user Pro** hoặc ~2–3 Business. Rất dễ đạt.

---

## Cảnh báo chi phí (theo dõi định kỳ)
1. **Chế độ "hội nghị 2 đích"** (nếu bật) = 2 stream Soniox → nhân đôi COGS dòng đó. Phải trừ quota gấp đôi.
2. **Soniox: trả trước, TẮT auto-pay** → không bao giờ bị hóa đơn bất ngờ.
3. **Free abuse**: đã có cap 30p/tháng + khách vãng lai 3p. Theo dõi cột COGS Free; nếu phình to → siết cap hoặc thêm xác thực.
4. Khi scale lớn (>vài trăm user) → đàm phán giá Soniox theo volume + cân nhắc Supabase/Vercel gói trả phí.

---

## Đòn bẩy tăng lợi nhuận (ưu tiên)
1. **Tăng chuyển đổi Free→Pro** (mỗi Pro = +162k lãi) — quan trọng nhất.
2. **Đẩy gói năm** (đã thêm vào pricing): thu tiền trước 12 tháng, giảm churn.
3. **Bán Business cho công ty Hàn** (5 ghế/đơn) — doanh thu/đơn cao nhất.
4. **Giới thiệu bạn bè** (đã thêm): CAC gần 0, mỗi lượt mời tốn ~vài nghìn đồng tiền phút tặng nhưng mang về user thật.
