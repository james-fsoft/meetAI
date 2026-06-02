# Giai đoạn 2 — Đăng nhập Supabase (hướng dẫn cấu hình)

Code đã xong. Bạn chỉ cần tạo project Supabase và điền 2 key vào `.env.local`.

## 1. Tạo project Supabase (miễn phí)
1. Vào https://supabase.com → đăng nhập → **New project**
2. Đặt tên (vd `meetingai`), chọn region **Singapore**, đặt mật khẩu database (lưu lại)
3. Chờ ~2 phút cho project khởi tạo

## 2. Lấy 2 key
Vào **Project Settings → API**, copy:
- **Project URL** → dán vào `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → dán vào `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Tạo file `.env.local`
Trong thư mục `meetingai-app`, tạo file `.env.local` (copy từ `.env.example`):
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```
(2 dòng này là đủ cho Giai đoạn 2. Các key OpenAI/AssemblyAI/Lemon để các giai đoạn sau.)

## 4. (Tùy chọn) Tắt xác nhận email khi đang test
Mặc định Supabase bắt xác nhận email mới đăng nhập được. Khi đang phát triển:
- **Authentication → Providers → Email** → tắt **"Confirm email"** để đăng ký xong vào luôn.
- Khi lên production thì bật lại cho an toàn.

## 5. Chạy lại
```
npm install      # cài thêm @supabase/supabase-js và @supabase/ssr
npm run dev
```
Mở http://localhost:3000 → sẽ tự chuyển sang **/login**. Đăng ký 1 tài khoản, đăng nhập, vào được app. Góc trên có email + nút Đăng xuất.

## Đã có gì trong code
- `lib/supabase-browser.ts`, `lib/supabase-server.ts` — kết nối Supabase
- `middleware.ts` — chặn truy cập khi chưa đăng nhập (tự đẩy về /login)
- `app/login/page.tsx` — trang đăng nhập / đăng ký
- `app/page.tsx` + `app/MeetingApp.tsx` — lấy user, hiện email + nút đăng xuất
