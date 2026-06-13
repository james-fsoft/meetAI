// Opened in a tab to obtain microphone permission for the extension origin.
// Once granted, the offscreen document can capture the mic without prompting.
navigator.mediaDevices.getUserMedia({ audio: true })
  .then((s) => {
    s.getTracks().forEach((t) => t.stop());
    document.getElementById("ic").textContent = "✅";
    document.getElementById("t").textContent = "Đã cấp quyền micro";
    document.getElementById("m").innerHTML = "Bạn có thể đóng tab này và bắt đầu dịch (đã bật mic).";
    setTimeout(() => window.close(), 1500);
  })
  .catch((e) => {
    document.getElementById("ic").textContent = "⚠️";
    document.getElementById("t").textContent = "Chưa cấp được quyền";
    document.getElementById("m").innerHTML = "Lỗi: " + e.message + "<br>Hãy bấm <b>“Cho phép”</b> rồi tải lại trang này.";
  });
