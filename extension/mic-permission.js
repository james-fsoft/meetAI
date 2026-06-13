// Obtains microphone permission for the extension origin so the offscreen
// document can capture the mic. Once granted it persists for the extension.
const ic = document.getElementById("ic");
const t = document.getElementById("t");
const m = document.getElementById("m");
const req = document.getElementById("req");

async function request() {
  ic.textContent = "🎤";
  t.textContent = "Đang yêu cầu quyền micro…";
  m.innerHTML = "Hãy chọn <b>“Cho phép / Allow”</b> ở hộp thoại của trình duyệt.";
  try {
    const s = await navigator.mediaDevices.getUserMedia({ audio: true });
    s.getTracks().forEach((x) => x.stop());
    ic.textContent = "✅";
    t.textContent = "Đã cấp quyền micro!";
    m.innerHTML = "Quay lại tab họp/YouTube và bấm <b>Bắt đầu</b> (đã bật mic). Tab này tự đóng…";
    req.style.display = "none";
    setTimeout(() => window.close(), 2000);
  } catch (e) {
    ic.textContent = "⚠️";
    t.textContent = "Chưa cấp được quyền (" + e.name + ")";
    m.innerHTML =
      "Nếu hộp thoại không hiện hoặc bạn lỡ bấm <b>Chặn</b>: mở <b>chrome://settings/content/microphone</b>, " +
      "xoá mục extension khỏi danh sách <b>“Không được phép”</b>, rồi bấm <b>Thử lại</b>.";
    req.textContent = "Thử lại";
  }
}

req.onclick = request;
// auto-attempt on load (the button is the reliable fallback)
request();
