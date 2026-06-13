// Obtains microphone permission for the extension origin so the offscreen
// document can capture the mic. MUST be triggered by a click (user gesture),
// otherwise Chrome rejects getUserMedia with NotAllowedError.
const ic = document.getElementById("ic");
const t = document.getElementById("t");
const m = document.getElementById("m");
const req = document.getElementById("req");

async function request() {
  ic.textContent = "🎤";
  t.textContent = "Đang yêu cầu quyền micro…";
  m.innerHTML = "Hãy chọn <b>“Cho phép / Allow”</b> ở hộp thoại của trình duyệt (góc trên-trái).";
  try {
    const s = await navigator.mediaDevices.getUserMedia({ audio: true });
    s.getTracks().forEach((x) => x.stop());
    ic.textContent = "✅";
    t.textContent = "Đã cấp quyền micro!";
    m.innerHTML = "Quay lại tab họp/YouTube và bấm <b>Bắt đầu</b> (đã bật mic). Tab này sẽ tự đóng…";
    req.style.display = "none";
    setTimeout(() => window.close(), 2200);
  } catch (e) {
    ic.textContent = "⚠️";
    t.textContent = "Chưa cấp được quyền (" + e.name + ")";
    m.innerHTML =
      (e.name === "NotAllowedError"
        ? "Bạn đã bấm <b>Chặn</b> hoặc bỏ qua hộp thoại. "
        : "") +
      "Bấm <b>Thử lại</b> rồi chọn <b>“Cho phép”</b>. Nếu vẫn lỗi, mở " +
      "<b>chrome://settings/content/microphone</b> và xoá extension khỏi danh sách bị chặn.";
    req.textContent = "Thử lại";
  }
}

// Button (user gesture) only — do NOT auto-request on load.
req.onclick = request;
