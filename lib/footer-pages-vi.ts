import type { PageDef } from "./footer-pages";

/** Vietnamese source content for the footer pages (unchanged from the original page). */
export const PAGES_VI: Record<string, PageDef> = {
  features: {
    eyebrow: "SẢN PHẨM · TÍNH NĂNG",
    title: "Mọi thứ cần để hiểu trọn một cuộc họp",
    lead:
      "Flash Meet kết hợp phụ đề dịch trực tiếp, tách người nói và AI sau cuộc họp trong một luồng làm việc duy nhất — từ lúc bắt đầu nói đến khi có biên bản.",
    actions: [
      { label: "Mở Flash Meet", href: "/?app=1", primary: true },
      { label: "Xem bảng giá", href: "/pricing" },
    ],
    sections: [
      {
        title: "Trong cuộc họp",
        cards: [
          {
            title: "Dịch trực tiếp song ngữ",
            text: "Hiển thị lời nói và bản dịch gần như theo thời gian thực để mọi người theo kịp cuộc trao đổi đa ngôn ngữ.",
          },
          {
            title: "Tách người nói",
            text: "Phân biệt người nói để transcript dễ đọc hơn và giảm nhầm lẫn ai đã nói điều gì.",
          },
          {
            title: "Micro + âm thanh máy tính",
            text: "Dịch cuộc họp tại chỗ hoặc âm thanh từ tab/trình duyệt; tiện ích Chrome giúp dùng thuận tiện với Google Meet, Zoom, Teams và video.",
            href: "/extension",
            cta: "Xem tiện ích",
          },
        ],
      },
      {
        title: "Sau cuộc họp",
        cards: [
          {
            title: "Tóm tắt AI",
            text: "Tự tổng hợp nội dung chính, quyết định, rủi ro và những điều cần theo dõi từ transcript.",
          },
          {
            title: "Action items",
            text: "Tách các việc cần làm thành danh sách rõ ràng để đội nhóm tiếp tục công việc ngay sau khi họp.",
          },
          {
            title: "Lịch sử & lịch họp",
            text: "Cuộc họp đã lưu có thể được xem lại trong khu vực lịch sử/lịch họp của tài khoản.",
            href: "/dashboard",
            cta: "Mở lịch họp",
          },
        ],
      },
      {
        title: "Trình chiếu & hội nghị",
        cards: [
          {
            title: "Conference Mode",
            text: "Đưa phụ đề dịch lên màn chiếu, dùng dạng dải ngang hoặc khung dọc và tùy biến cách hiển thị cho hội nghị.",
            href: "/conference-mode",
            cta: "Mở Conference Mode",
          },
          {
            title: "Khung phụ đề nổi",
            text: "Hiển thị phụ đề trong cửa sổ riêng để vừa trình chiếu nội dung chính vừa cho người xem đọc bản dịch.",
          },
          {
            title: "QR cho người xem",
            text: "Người tham dự có thể mở bản dịch trên điện thoại khi người trình bày chia sẻ mã tham gia.",
          },
        ],
      },
    ],
  },

  "use-cases": {
    eyebrow: "SẢN PHẨM · USE CASE",
    title: "Một công cụ, nhiều tình huống giao tiếp đa ngôn ngữ",
    lead:
      "Flash Meet phù hợp khi vấn đề chính không phải là thiếu một nền tảng họp mới, mà là mọi người cần hiểu nhau nhanh hơn trên công cụ đang dùng.",
    actions: [
      { label: "Dùng thử ngay", href: "/?app=1", primary: true },
      { label: "Xem tính năng", href: "/features" },
    ],
    sections: [
      {
        title: "Công việc hàng ngày",
        cards: [
          {
            title: "Họp Việt – Hàn – Anh",
            text: "Theo dõi phụ đề song ngữ trong cuộc họp dự án, trao đổi khách hàng hoặc họp nội bộ có nhiều ngôn ngữ.",
          },
          {
            title: "Sales & chăm sóc khách hàng",
            text: "Giảm thời gian phải dừng lại giải thích, đồng thời giữ lại transcript và tóm tắt để follow-up chính xác hơn.",
          },
          {
            title: "Project sync & bàn giao",
            text: "Giúp PM, kỹ thuật và khách hàng cùng nhìn thấy nội dung chính, quyết định và action items sau buổi họp.",
          },
        ],
      },
      {
        title: "Nội dung & sự kiện",
        cards: [
          {
            title: "Hội nghị / thuyết trình",
            text: "Đặt bản dịch trực tiếp trên màn chiếu hoặc cửa sổ phụ đề riêng, phù hợp cho phòng họp và sân khấu.",
            href: "/conference-mode",
            cta: "Xem Conference Mode",
          },
          {
            title: "Webinar & training",
            text: "Dịch âm thanh từ trình duyệt để theo dõi webinar, khóa học, video đào tạo hoặc nội dung chuyên môn.",
            href: "/extension",
            cta: "Cài tiện ích",
          },
          {
            title: "Video nước ngoài",
            text: "Tạo phụ đề dịch trực tiếp cho nội dung trên trình duyệt mà không cần chờ file phụ đề có sẵn.",
          },
        ],
      },
    ],
  },

  apps: {
    eyebrow: "SẢN PHẨM · ỨNG DỤNG",
    title: "Chọn cách dùng Flash Meet phù hợp với tình huống của bạn",
    lead:
      "Bạn có thể dùng trực tiếp trên web, cài tiện ích trình duyệt hoặc mở Conference Mode cho màn chiếu và hội nghị.",
    sections: [
      {
        title: "Các cách sử dụng",
        cards: [
          {
            title: "Flash Meet Web",
            text: "Bắt đầu một phiên dịch trực tiếp ngay trên trình duyệt, không cần cài phần mềm desktop.",
            href: "/?app=1",
            cta: "Mở ứng dụng",
            badge: "WEB",
          },
          {
            title: "Browser Extension",
            text: "Dịch âm thanh của Google Meet, Zoom, Teams, YouTube và các nội dung chạy trong trình duyệt.",
            href: "/extension",
            cta: "Xem tiện ích",
            badge: "CHROME",
          },
          {
            title: "Conference Mode",
            text: "Thiết kế cho trình chiếu: phụ đề lớn, nhiều chế độ bố cục và đường dẫn/QR cho người xem.",
            href: "/conference-mode",
            cta: "Mở chế độ hội nghị",
            badge: "STAGE",
          },
          {
            title: "Meeting Calendar",
            text: "Xem lại các cuộc họp đã lưu, transcript và kết quả sau cuộc họp trong tài khoản.",
            href: "/dashboard",
            cta: "Mở lịch họp",
            badge: "HISTORY",
          },
        ],
      },
    ],
  },

  roadmap: {
    eyebrow: "SẢN PHẨM · LỘ TRÌNH",
    title: "Flash Meet đang phát triển theo hướng nào?",
    lead:
      "Ưu tiên của sản phẩm là làm cho giao tiếp đa ngôn ngữ ít gián đoạn hơn: dịch tốt hơn trong lúc nói, ghi nhận chính xác hơn sau cuộc họp và dễ triển khai hơn cho đội nhóm.",
    sections: [
      {
        title: "Đã có",
        cards: [
          {
            title: "Dịch trực tiếp & phụ đề song ngữ",
            text: "Dùng trên web và qua tiện ích trình duyệt cho nhiều tình huống họp/video.",
          },
          {
            title: "Tóm tắt AI & action items",
            text: "Biến transcript thành nội dung dễ follow-up sau cuộc họp.",
          },
          {
            title: "Conference Mode",
            text: "Nhiều kiểu hiển thị cho màn chiếu, phụ đề nổi và người xem trên điện thoại.",
          },
        ],
      },
      {
        title: "Hướng ưu tiên tiếp theo",
        cards: [
          {
            title: "Chất lượng ngôn ngữ",
            text: "Tiếp tục cải thiện độ ổn định của nhận dạng, dịch và cách xử lý thuật ngữ chuyên ngành.",
          },
          {
            title: "Workflow cho đội nhóm",
            text: "Làm cho việc chia sẻ, review, tìm lại và dùng lại nội dung cuộc họp thuận tiện hơn.",
          },
          {
            title: "Tích hợp & xuất dữ liệu",
            text: "Mở rộng các luồng kết nối để kết quả cuộc họp đi thẳng vào công việc tiếp theo thay vì dừng ở bản tóm tắt.",
          },
        ],
      },
    ],
    note:
      "Roadmap thể hiện định hướng sản phẩm, không phải cam kết ngày phát hành. Thứ tự và phạm vi có thể thay đổi theo phản hồi người dùng và yêu cầu kỹ thuật.",
  },

  guide: {
    eyebrow: "TÀI NGUYÊN · HƯỚNG DẪN",
    title: "Bắt đầu với Flash Meet trong vài phút",
    lead:
      "Luồng cơ bản rất ngắn: chọn ngôn ngữ, chọn nguồn âm thanh, bắt đầu dịch và lưu lại kết quả khi kết thúc.",
    actions: [
      { label: "Mở Flash Meet", href: "/?app=1", primary: true },
      { label: "Hướng dẫn tiện ích", href: "/extension" },
    ],
    sections: [
      {
        title: "4 bước cơ bản",
        cards: [
          {
            badge: "01",
            title: "Mở ứng dụng",
            text: "Vào Flash Meet trên trình duyệt. Bạn có thể bắt đầu ở chế độ web hoặc dùng tiện ích nếu cần dịch âm thanh từ một tab.",
          },
          {
            badge: "02",
            title: "Chọn ngôn ngữ",
            text: "Chọn ngôn ngữ người nói và ngôn ngữ bạn muốn đọc. Với Conference Mode, bạn cũng chọn số ngôn ngữ hiển thị.",
          },
          {
            badge: "03",
            title: "Chọn nguồn âm thanh & bắt đầu",
            text: "Dùng microphone cho cuộc nói chuyện tại chỗ; với video/cuộc họp trên trình duyệt, dùng tiện ích hoặc chia sẻ âm thanh máy tính khi được hỗ trợ.",
          },
          {
            badge: "04",
            title: "Kết thúc & xem kết quả",
            text: "Dừng phiên để xem transcript, tóm tắt và action items; nếu đã đăng nhập, các nội dung phù hợp có thể được lưu vào lịch sử.",
          },
        ],
      },
      {
        title: "Bạn đang muốn làm gì?",
        cards: [
          {
            title: "Dịch Google Meet / Zoom / Teams",
            text: "Cài tiện ích để lấy âm thanh tab và hiển thị phụ đề ngay trên trình duyệt.",
            href: "/extension",
            cta: "Xem cách cài",
          },
          {
            title: "Chiếu bản dịch cho cả phòng",
            text: "Dùng Conference Mode để bố trí phụ đề trên màn chiếu và cho người xem quét QR.",
            href: "/conference-mode",
            cta: "Mở Conference Mode",
          },
          {
            title: "Quản lý gói & số phút",
            text: "Xem các gói Free, Pro, Business và Enterprise cùng hạn mức tương ứng.",
            href: "/pricing",
            cta: "Xem bảng giá",
          },
        ],
      },
    ],
  },

  faq: {
    eyebrow: "TÀI NGUYÊN · FAQ",
    title: "Câu hỏi thường gặp",
    lead:
      "Các câu trả lời ngắn gọn về cách Flash Meet hoạt động, ngôn ngữ, dữ liệu và việc dùng trong cuộc họp trực tuyến.",
    sections: [
      {
        title: "Sử dụng",
        cards: [
          {
            title: "Flash Meet có dùng với Google Meet, Zoom và Teams không?",
            text: "Có. Tiện ích trình duyệt được thiết kế để hỗ trợ cuộc họp và nội dung web như Google Meet, Zoom, Microsoft Teams và YouTube.",
          },
          {
            title: "Có phải cài ứng dụng desktop không?",
            text: "Không bắt buộc. Flash Meet có thể chạy trên web; với âm thanh tab và overlay trực tiếp trên trang, bạn có thể dùng tiện ích trình duyệt.",
          },
          {
            title: "Có hỗ trợ tiếng Việt, Anh và Hàn không?",
            text: "Có, đây là những ngôn ngữ trọng tâm của sản phẩm; hệ thống cũng hỗ trợ thêm nhiều ngôn ngữ tùy chế độ.",
          },
          {
            title: "Có tự tóm tắt sau cuộc họp không?",
            text: "Có. Khi có transcript, Flash Meet có thể tạo tóm tắt, quyết định và action items bằng AI.",
          },
          {
            title: "Có dùng cho hội nghị / màn chiếu được không?",
            text: "Có. Conference Mode có các bố cục phụ đề cho màn chiếu, cửa sổ nổi và người xem qua QR/link.",
            href: "/conference-mode",
            cta: "Xem Conference Mode",
          },
          {
            title: "Có bản miễn phí không?",
            text: "Có. Trang bảng giá hiển thị hạn mức hiện tại của Free và các gói trả phí.",
            href: "/pricing",
            cta: "Xem bảng giá",
          },
        ],
      },
      {
        title: "Dữ liệu & quyền riêng tư",
        cards: [
          {
            title: "Tôi có cần xin phép trước khi ghi âm không?",
            text: "Bạn chịu trách nhiệm tuân thủ quy định ghi âm và quyền riêng tư tại nơi mình sử dụng dịch vụ; hãy thông báo và xin sự đồng ý khi pháp luật yêu cầu.",
            href: "/terms",
            cta: "Xem điều khoản",
          },
          {
            title: "Flash Meet xử lý dữ liệu thế nào?",
            text: "Chính sách bảo mật mô tả loại dữ liệu được xử lý, nhà cung cấp liên quan, thời gian lưu và quyền của người dùng.",
            href: "/privacy",
            cta: "Xem chính sách bảo mật",
          },
        ],
      },
    ],
  },

  docs: {
    eyebrow: "TÀI NGUYÊN · TÀI LIỆU",
    title: "Trung tâm tài liệu Flash Meet",
    lead:
      "Đi thẳng tới đúng tài liệu bạn cần: bắt đầu sử dụng, tiện ích trình duyệt, hội nghị, bảng giá và các chính sách.",
    sections: [
      {
        title: "Tài liệu sản phẩm",
        cards: [
          {
            title: "Bắt đầu nhanh",
            text: "Luồng 4 bước từ mở ứng dụng đến xem kết quả sau cuộc họp.",
            href: "/guide",
            cta: "Đọc hướng dẫn",
          },
          {
            title: "Tiện ích trình duyệt",
            text: "Cách cài đặt và dùng Flash Meet với Google Meet, Zoom, Teams và YouTube.",
            href: "/extension",
            cta: "Mở tài liệu",
          },
          {
            title: "Conference Mode",
            text: "Chế độ trình chiếu phụ đề cho hội nghị, phòng họp và màn hình lớn.",
            href: "/conference-mode",
            cta: "Mở chế độ",
          },
          {
            title: "FAQ",
            text: "Những câu hỏi thường gặp về ngôn ngữ, thiết bị, dữ liệu và cách sử dụng.",
            href: "/faq",
            cta: "Xem FAQ",
          },
        ],
      },
      {
        title: "Tài khoản & chính sách",
        cards: [
          {
            title: "Bảng giá",
            text: "Hạn mức và quyền lợi theo từng gói.",
            href: "/pricing",
            cta: "Xem bảng giá",
          },
          {
            title: "Chính sách bảo mật",
            text: "Thông tin về dữ liệu và quyền riêng tư.",
            href: "/privacy",
            cta: "Đọc chính sách",
          },
          {
            title: "Điều khoản sử dụng",
            text: "Điều kiện sử dụng, trách nhiệm ghi âm và giới hạn dịch vụ.",
            href: "/terms",
            cta: "Đọc điều khoản",
          },
        ],
      },
    ],
  },

  videos: {
    eyebrow: "TÀI NGUYÊN · VIDEO",
    title: "Video hướng dẫn Flash Meet",
    lead:
      "Thư viện video hướng dẫn đang được bổ sung. Trong lúc đó, các luồng quan trọng đều có hướng dẫn dạng chữ để bạn có thể làm ngay.",
    sections: [
      {
        title: "Nội dung hướng dẫn",
        cards: [
          {
            title: "Bắt đầu một phiên dịch",
            text: "Cách chọn ngôn ngữ, nguồn âm thanh và bắt đầu phiên trên Flash Meet.",
            href: "/guide",
            cta: "Xem hướng dẫn",
          },
          {
            title: "Dịch Google Meet / Zoom / video",
            text: "Cách cài và dùng tiện ích để dịch âm thanh của tab trình duyệt.",
            href: "/extension",
            cta: "Xem tiện ích",
          },
          {
            title: "Trình chiếu với Conference Mode",
            text: "Cách đưa phụ đề lên màn chiếu, chọn bố cục và chia sẻ QR cho người xem.",
            href: "/conference-mode",
            cta: "Mở Conference Mode",
          },
        ],
      },
    ],
    note:
      "Khi có video hướng dẫn chính thức, trang này sẽ là nơi tập hợp các video mới nhất thay vì dùng các liên kết không được xác minh.",
  },

  about: {
    eyebrow: "CÔNG TY · VỀ CHÚNG TÔI",
    title: "Flash Meet giúp các cuộc trò chuyện đa ngôn ngữ bớt khoảng cách",
    lead:
      "Flash Meet là một giải pháp của TransFlash, tập trung vào dịch trực tiếp và AI cho cuộc họp, hội nghị và nội dung nói.",
    sections: [
      {
        title: "Chúng tôi đang giải quyết điều gì?",
        cards: [
          {
            title: "Hiểu nhau trong lúc đang nói",
            text: "Ngôn ngữ không nên khiến cuộc họp bị ngắt quãng liên tục để hỏi lại hoặc chờ bản dịch sau đó.",
          },
          {
            title: "Không mất thông tin sau cuộc họp",
            text: "Transcript, tóm tắt, quyết định và action items giúp kiến thức không biến mất khi cuộc gọi kết thúc.",
          },
          {
            title: "Dùng trên công cụ sẵn có",
            text: "Mục tiêu là bổ sung khả năng dịch và AI vào workflow hiện tại, thay vì buộc người dùng thay toàn bộ cách họ họp.",
          },
        ],
      },
      {
        title: "Nguyên tắc sản phẩm",
        bullets: [
          "Dễ bắt đầu: ưu tiên trải nghiệm web và trình duyệt.",
          "Rõ ràng: phụ đề và tóm tắt phải giúp người dùng hiểu nhanh hơn, không tạo thêm nhiễu.",
          "Tôn trọng dữ liệu: quyền riêng tư và sự đồng ý khi ghi âm là một phần của cách sử dụng sản phẩm.",
          "Đa ngôn ngữ thực tế: tập trung vào các tình huống giao tiếp thật trong công việc.",
        ],
      },
    ],
  },

  careers: {
    eyebrow: "CÔNG TY · TUYỂN DỤNG",
    title: "Cùng xây công cụ giúp mọi người hiểu nhau tốt hơn",
    lead:
      "Flash Meet là sản phẩm giao thoa giữa speech AI, dịch thuật, trải nghiệm cuộc họp và workflow doanh nghiệp.",
    actions: [
      {
        label: "Gửi hồ sơ",
        href: "mailto:support@transflash.app?subject=%5BCareer%5D%20Flash%20Meet",
        primary: true,
      },
      { label: "Tìm hiểu sản phẩm", href: "/features" },
    ],
    sections: [
      {
        title: "Những năng lực phù hợp",
        cards: [
          {
            title: "Engineering / AI",
            text: "Realtime audio, speech-to-text, translation, web performance, reliability và tích hợp AI.",
          },
          {
            title: "Product / Design",
            text: "Thiết kế trải nghiệm ít ma sát cho họp trực tiếp, họp online và màn hình hội nghị.",
          },
          {
            title: "Growth / Partnerships",
            text: "Đưa sản phẩm tới các đội nhóm và doanh nghiệp có nhu cầu giao tiếp đa ngôn ngữ thực tế.",
          },
        ],
      },
    ],
    note:
      "Vị trí tuyển dụng cụ thể được mở theo nhu cầu từng thời điểm. Bạn có thể gửi hồ sơ hoặc giới thiệu bản thân qua support@transflash.app với tiêu đề [Career] Flash Meet.",
  },

  contact: {
    eyebrow: "CÔNG TY · LIÊN HỆ",
    title: "Liên hệ Flash Meet",
    lead:
      "Hãy gửi đúng chủ đề để đội ngũ có thể xử lý nhanh hơn: hỗ trợ sản phẩm, thanh toán, hợp tác doanh nghiệp hoặc vấn đề về dữ liệu.",
    actions: [
      {
        label: "Email support@transflash.app",
        href: "mailto:support@transflash.app",
        primary: true,
      },
      { label: "Xem FAQ", href: "/faq" },
    ],
    sections: [
      {
        title: "Bạn cần hỗ trợ gì?",
        cards: [
          {
            title: "Hỗ trợ sản phẩm",
            text: "Lỗi dịch, microphone, tiện ích, Conference Mode hoặc vấn đề khi sử dụng.",
            href: "mailto:support@transflash.app?subject=%5BSupport%5D%20Flash%20Meet",
            cta: "Gửi email",
          },
          {
            title: "Gói dịch vụ & thanh toán",
            text: "Câu hỏi về Free, Pro, Business, Enterprise, hạn mức hoặc nâng/hạ gói.",
            href: "mailto:support@transflash.app?subject=%5BBilling%5D%20Flash%20Meet",
            cta: "Liên hệ",
          },
          {
            title: "Doanh nghiệp & hợp tác",
            text: "Triển khai cho team, sự kiện, hội nghị hoặc nhu cầu hợp tác sản phẩm.",
            href: "mailto:support@transflash.app?subject=%5BBusiness%5D%20Flash%20Meet",
            cta: "Trao đổi",
          },
          {
            title: "Quyền riêng tư",
            text: "Yêu cầu liên quan đến dữ liệu cá nhân, quyền truy cập hoặc xóa dữ liệu.",
            href: "mailto:support@transflash.app?subject=%5BPrivacy%5D%20Flash%20Meet",
            cta: "Gửi yêu cầu",
          },
        ],
      },
    ],
  },
};
