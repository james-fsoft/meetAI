import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Card = {
  title: string;
  text: string;
  href?: string;
  cta?: string;
  badge?: string;
};

type Section = {
  title: string;
  intro?: string;
  cards?: Card[];
  bullets?: string[];
};

type PageDef = {
  eyebrow: string;
  title: string;
  lead: string;
  actions?: { label: string; href: string; primary?: boolean }[];
  sections: Section[];
  note?: string;
};

const PAGES: Record<string, PageDef> = {
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

const ALIASES: Record<string, string> = {
  "use-case": "use-cases",
  applications: "apps",
  application: "apps",
  help: "guide",
  documentation: "docs",
  video: "videos",
  "about-us": "about",
  career: "careers",
};

const FOOTER = {
  product: [
    ["Tính năng", "/features"],
    ["Use case", "/use-cases"],
    ["Bảng giá", "/pricing"],
    ["Ứng dụng", "/apps"],
    ["Lộ trình phát triển", "/roadmap"],
  ],
  resources: [
    ["Blog", "/blog"],
    ["Hướng dẫn sử dụng", "/guide"],
    ["Câu hỏi thường gặp", "/faq"],
    ["Tài liệu", "/docs"],
    ["Video", "/videos"],
  ],
  company: [
    ["Về chúng tôi", "/about"],
    ["Tuyển dụng", "/careers"],
    ["Liên hệ", "/contact"],
    ["Chính sách bảo mật", "/privacy"],
    ["Điều khoản sử dụng", "/terms"],
  ],
} as const;

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="fp-logo">
      <svg viewBox="0 0 100 100" width={compact ? 27 : 31} height={compact ? 27 : 31} aria-hidden="true">
        <path
          d="M22 8 H78 a16 16 0 0 1 16 16 V60 a16 16 0 0 1 -16 16 H50 l-20 18 v-18 H22 a16 16 0 0 1 -16 -16 V24 A16 16 0 0 1 22 8 Z"
          fill="#1f6bff"
        />
        <g fill="#fff">
          <rect x="26" y="38" width="7.5" height="12" rx="3.75" />
          <rect x="39" y="29" width="7.5" height="30" rx="3.75" />
          <rect x="52" y="22" width="7.5" height="44" rx="3.75" />
          <rect x="65" y="32" width="7.5" height="24" rx="3.75" />
        </g>
      </svg>
      <span>Flash Meet</span>
    </span>
  );
}

function Footer() {
  return (
    <footer className="fp-footer">
      <div className="fp-footer-grid">
        <div className="fp-brand-col">
          <a href="/" className="fp-footer-brand" aria-label="Flash Meet">
            <Logo />
          </a>
          <p>Hiểu nhau, gần nhau hơn.</p>
          <div className="fp-social" aria-label="Mạng xã hội">
            <span title="LinkedIn">in</span>
            <span title="YouTube">▶</span>
            <span title="Facebook">f</span>
            <span title="X">𝕏</span>
          </div>
          <small>© 2026 Flash Meet. All rights reserved.</small>
        </div>

        <FooterColumn title="Sản phẩm" links={FOOTER.product} />
        <FooterColumn title="Tài nguyên" links={FOOTER.resources} />
        <FooterColumn title="Công ty" links={FOOTER.company} />

        <div className="fp-news">
          <h3>Nhận tin tức mới nhất</h3>
          <form
            action="mailto:support@transflash.app"
            method="post"
            encType="text/plain"
          >
            <div className="fp-news-row">
              <input type="email" name="email" placeholder="Nhập email của bạn" required />
              <button type="submit" aria-label="Đăng ký nhận tin">→</button>
            </div>
            <label>
              <input type="checkbox" name="consent" value="yes" required />
              <span>Tôi đồng ý nhận thông tin từ Flash Meet.</span>
            </label>
          </form>
          <div className="fp-lang">◎&nbsp; Tiếng Việt&nbsp;⌄</div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly (readonly [string, string])[];
}) {
  return (
    <div className="fp-footer-col">
      <h3>{title}</h3>
      <nav aria-label={title}>
        {links.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const key = ALIASES[params.slug] || params.slug;
  const page = PAGES[key];
  if (!page) return {};
  return {
    title: page.title,
    description: page.lead,
    alternates: { canonical: "/" + key },
    openGraph: {
      title: page.title + " — Flash Meet",
      description: page.lead,
      url: "https://meet.transflash.app/" + key,
      type: "website",
    },
  };
}

export default function FooterPage({
  params,
}: {
  params: { slug: string };
}) {
  const key = ALIASES[params.slug] || params.slug;
  const page = PAGES[key];
  if (!page) notFound();

  return (
    <div className="fp-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="fp-header">
        <a href="/" className="fp-head-brand" aria-label="Flash Meet home">
          <Logo compact />
        </a>
        <nav className="fp-head-nav" aria-label="Điều hướng">
          <a href="/features">Tính năng</a>
          <a href="/use-cases">Use case</a>
          <a href="/pricing">Bảng giá</a>
          <a href="/docs">Tài liệu</a>
        </nav>
        <a className="fp-open" href="/?app=1">
          Mở ứng dụng
        </a>
      </header>

      <main>
        <section className="fp-hero">
          <div className="fp-hero-inner">
            <div className="fp-eyebrow">{page.eyebrow}</div>
            <h1>{page.title}</h1>
            <p>{page.lead}</p>
            {page.actions && (
              <div className="fp-actions">
                {page.actions.map((action) => (
                  <a
                    key={action.href + action.label}
                    href={action.href}
                    className={action.primary ? "fp-btn fp-btn-primary" : "fp-btn"}
                  >
                    {action.label}
                    <span aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="fp-main">
          {page.sections.map((section) => (
            <section className="fp-section" key={section.title}>
              <div className="fp-section-head">
                <h2>{section.title}</h2>
                {section.intro && <p>{section.intro}</p>}
              </div>

              {section.cards && (
                <div className="fp-card-grid">
                  {section.cards.map((card) => (
                    <article className="fp-card" key={card.title}>
                      {card.badge && <div className="fp-badge">{card.badge}</div>}
                      <h3>{card.title}</h3>
                      <p>{card.text}</p>
                      {card.href && (
                        <a href={card.href} className="fp-card-link">
                          {card.cta || "Tìm hiểu thêm"} <span aria-hidden="true">→</span>
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              )}

              {section.bullets && (
                <div className="fp-bullets">
                  {section.bullets.map((item) => (
                    <div key={item} className="fp-bullet">
                      <span aria-hidden="true">✓</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          {page.note && <aside className="fp-note">{page.note}</aside>}

          <section className="fp-bottom-cta">
            <div>
              <span>FLASH MEET</span>
              <h2>Sẵn sàng để thử trong một cuộc họp thật?</h2>
              <p>Mở Flash Meet ngay trên trình duyệt hoặc xem hướng dẫn nếu bạn muốn bắt đầu từng bước.</p>
            </div>
            <div className="fp-bottom-actions">
              <a href="/?app=1" className="fp-btn fp-btn-primary">Mở Flash Meet →</a>
              <a href="/guide" className="fp-btn">Hướng dẫn sử dụng</a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const CSS = `
:root{--fp-ink:#0b1631;--fp-muted:#64708a;--fp-blue:#1468ff;--fp-line:#e5eaf3;--fp-soft:#f6f9fd}
.fp-page{min-height:100vh;background:#fff;color:var(--fp-ink);font-family:'Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;letter-spacing:-.015em}
.fp-page *{box-sizing:border-box}
.fp-header{height:68px;display:flex;align-items:center;gap:28px;padding:0 32px;border-bottom:1px solid #edf0f5;background:rgba(255,255,255,.94);backdrop-filter:blur(12px);position:sticky;top:0;z-index:20}
.fp-head-brand,.fp-footer-brand{text-decoration:none;color:inherit}
.fp-logo{display:inline-flex;align-items:center;gap:9px;font-size:18px;font-weight:900;letter-spacing:-.035em;white-space:nowrap}
.fp-head-nav{display:flex;align-items:center;gap:23px;margin-left:auto}
.fp-head-nav a{font-size:13px;font-weight:700;color:#63708a;text-decoration:none;transition:.16s}
.fp-head-nav a:hover{color:var(--fp-blue)}
.fp-open{font-size:13px;font-weight:800;color:#fff;background:var(--fp-blue);text-decoration:none;padding:10px 16px;border-radius:10px;box-shadow:0 8px 20px -12px rgba(20,104,255,.8)}
.fp-hero{position:relative;overflow:hidden;border-bottom:1px solid #eef2f7;background:
radial-gradient(700px 360px at 18% 0%,rgba(20,104,255,.105),transparent 62%),
radial-gradient(620px 300px at 86% 10%,rgba(80,180,255,.09),transparent 62%),
linear-gradient(180deg,#fbfdff,#fff)}
.fp-hero-inner{max-width:1120px;margin:0 auto;padding:82px 28px 76px}
.fp-eyebrow{font-size:12px;font-weight:900;letter-spacing:.12em;color:var(--fp-blue);margin-bottom:18px}
.fp-hero h1{max-width:820px;font-size:clamp(38px,5.1vw,66px);line-height:1.035;letter-spacing:-.052em;margin:0;font-weight:900}
.fp-hero p{max-width:760px;margin:22px 0 0;color:#596781;font-size:18px;line-height:1.7}
.fp-actions{display:flex;flex-wrap:wrap;gap:11px;margin-top:30px}
.fp-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:44px;padding:0 18px;border:1px solid #dfe5ef;border-radius:11px;background:#fff;color:#17213b;text-decoration:none;font-size:13.5px;font-weight:800;transition:.16s}
.fp-btn:hover{border-color:#b9cbed;transform:translateY(-1px);box-shadow:0 10px 22px -18px rgba(20,41,90,.55)}
.fp-btn-primary{background:linear-gradient(135deg,#1769ff,#3d83ff);border-color:transparent;color:#fff;box-shadow:0 12px 25px -15px rgba(20,104,255,.9)}
.fp-main{max-width:1120px;margin:0 auto;padding:62px 28px 76px}
.fp-section{margin-bottom:66px}
.fp-section-head{margin-bottom:22px;max-width:760px}
.fp-section-head h2{font-size:27px;line-height:1.2;letter-spacing:-.035em;margin:0;font-weight:900}
.fp-section-head p{font-size:15px;color:var(--fp-muted);line-height:1.65;margin:10px 0 0}
.fp-card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.fp-card{min-height:185px;border:1px solid var(--fp-line);border-radius:18px;padding:22px;background:linear-gradient(180deg,#fff,#fbfdff);box-shadow:0 16px 34px -32px rgba(20,41,90,.6);transition:.18s}
.fp-card:hover{border-color:#cbd8ec;transform:translateY(-2px);box-shadow:0 22px 42px -31px rgba(20,70,160,.42)}
.fp-badge{display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:25px;padding:0 9px;border-radius:20px;background:#eef4ff;color:#1c62d5;font-size:10.5px;font-weight:900;letter-spacing:.06em;margin-bottom:13px}
.fp-card h3{font-size:17px;line-height:1.3;margin:0 0 9px;letter-spacing:-.02em;font-weight:850}
.fp-card p{font-size:14px;color:#66728a;line-height:1.65;margin:0}
.fp-card-link{display:inline-flex;gap:7px;margin-top:16px;color:#1769ff;text-decoration:none;font-size:13px;font-weight:800}
.fp-bullets{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.fp-bullet{display:flex;align-items:flex-start;gap:11px;padding:15px 17px;border:1px solid var(--fp-line);border-radius:14px;background:#fbfdff}
.fp-bullet>span{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;flex:0 0 24px;background:#eaf2ff;color:#1769ff;font-size:12px;font-weight:900}
.fp-bullet p{font-size:14px;color:#596781;line-height:1.55;margin:1px 0 0}
.fp-note{margin:8px 0 58px;padding:18px 20px;border:1px solid #dce8fb;border-radius:14px;background:#f6f9ff;color:#52627f;font-size:13.5px;line-height:1.65}
.fp-bottom-cta{display:flex;align-items:center;justify-content:space-between;gap:30px;padding:32px 34px;border-radius:22px;background:#0d1830;color:#fff;box-shadow:0 22px 50px -35px rgba(5,17,45,.75)}
.fp-bottom-cta>div:first-child{max-width:690px}
.fp-bottom-cta span{font-size:10.5px;font-weight:900;letter-spacing:.14em;color:#83b0ff}
.fp-bottom-cta h2{font-size:25px;line-height:1.25;letter-spacing:-.035em;margin:7px 0 7px}
.fp-bottom-cta p{font-size:13.5px;line-height:1.6;color:#aab7ce;margin:0}
.fp-bottom-actions{display:flex;flex-direction:column;gap:9px;flex:0 0 auto}
.fp-bottom-cta .fp-btn:not(.fp-btn-primary){background:transparent;border-color:#34445f;color:#dce6f7}
.fp-footer{border-top:1px solid #e7ebf2;background:#f8fbff;padding:40px 32px 28px}
.fp-footer-grid{max-width:1370px;margin:0 auto;display:grid;grid-template-columns:1.35fr .88fr 1fr 1.08fr 1.65fr;gap:34px;align-items:start}
.fp-brand-col p{font-size:13px;color:#68758e;margin:8px 0 16px}
.fp-social{display:flex;align-items:center;gap:19px;margin:8px 0 22px;color:#1f2c47}
.fp-social span{display:inline-flex;align-items:center;justify-content:center;height:24px;min-width:20px;font-size:14px;font-weight:900}
.fp-brand-col small{font-size:11.5px;color:#75819a}
.fp-footer-col h3,.fp-news h3{font-size:13px;color:#10192d;margin:0 0 10px;font-weight:900}
.fp-footer-col nav{display:flex;flex-direction:column;gap:7px}
.fp-footer-col a{font-size:12.5px;color:#68758e;text-decoration:none;line-height:1.25}
.fp-footer-col a:hover{color:#1769ff}
.fp-news{min-width:0}
.fp-news-row{display:flex;width:100%;height:42px}
.fp-news-row input{min-width:0;flex:1;border:1px solid #d9e0ec;border-right:none;border-radius:8px 0 0 8px;background:#fff;padding:0 13px;font:inherit;font-size:12.5px;color:#17213b;outline:none}
.fp-news-row input:focus{border-color:#9dbcf5}
.fp-news-row button{width:45px;border:none;border-radius:0 8px 8px 0;background:#0f67f8;color:#fff;font-size:21px;cursor:pointer}
.fp-news label{display:flex;align-items:flex-start;gap:8px;margin-top:9px;font-size:11.5px;color:#6d7890;line-height:1.35}
.fp-news label input{margin-top:2px}
.fp-lang{margin-top:24px;text-align:right;font-size:12px;font-weight:700;color:#34425e}
@media(max-width:960px){
  .fp-head-nav{display:none}
  .fp-footer-grid{grid-template-columns:1.2fr 1fr 1fr;gap:32px}
  .fp-news{grid-column:2/4}
  .fp-card-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .fp-bottom-cta{align-items:flex-start;flex-direction:column}
  .fp-bottom-actions{flex-direction:row}
}
@media(max-width:640px){
  .fp-header{height:60px;padding:0 16px}
  .fp-logo{font-size:16px}
  .fp-open{padding:8px 12px;font-size:12px}
  .fp-hero-inner{padding:52px 18px 50px}
  .fp-hero h1{font-size:39px}
  .fp-hero p{font-size:16px;line-height:1.6}
  .fp-main{padding:42px 18px 56px}
  .fp-section{margin-bottom:48px}
  .fp-section-head h2{font-size:23px}
  .fp-card-grid,.fp-bullets{grid-template-columns:1fr}
  .fp-card{min-height:0;padding:19px}
  .fp-bottom-cta{padding:26px 21px}
  .fp-bottom-actions{width:100%;flex-direction:column}
  .fp-footer{padding:34px 20px 24px}
  .fp-footer-grid{grid-template-columns:1fr 1fr;gap:30px 22px}
  .fp-brand-col,.fp-news{grid-column:1/3}
  .fp-news{order:5}
  .fp-lang{text-align:left}
}
`;
