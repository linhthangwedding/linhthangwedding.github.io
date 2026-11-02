# Thiệp cưới Linh & Thắng

## Hiển thị tên khách tức thì từ link thiệp (02/11/2026)

- **Nguồn link hiện hành:** `Guest List!H/S` dùng `https://linhthangwedding.github.io/?i=<slug>&to=<ENCODEURL(tên khách mời)>`. Tên được lấy từ `RSVP Online!B` cùng bản ghi với mã `Q`, vì một số dòng chia sẻ cùng một mã thiệp. Nếu `B/K` của dòng trống thì không tạo link.
- **Đã kiểm tra:** 157 ô có công thức, 156 link đang có hiệu lực; cả 156 link đều đúng `i`, giải mã `to` trùng tên hiển thị của registry và không có `utm_*`. Có bốn nhóm dòng dùng chung mã thiệp và giữ nguyên.
- **Tốc độ:** website đọc `to` để hiển thị tên ngay khi HTML được dựng; Apps Script vẫn kiểm tra lại mã `i`, tên đúng và quyền RSVP. Browser xóa `to` khỏi thanh địa chỉ sau khi đã đọc để giữ link hiển thị gọn. Link đã gửi vẫn có thể chứa tên; đó là đánh đổi quyền riêng tư được chấp nhận cho phương án này.
- **Không thay đổi RSVP:** mã thiệp, ngày khóa 10/02/2027, các cột RSVP và backend giữ nguyên. Không dùng `to` để xác thực người gửi. Các liên kết `?i=...` cũ vẫn tra cứu được nhưng tải tên chậm ở lần đầu.
- **Lưu ý phát hiện khi đối chiếu:** có các dòng chung mã thiệp, trong khi backend hiện tại từ chối nếu nhiều dòng Guest List khớp cùng slug. Đó là vấn đề có sẵn trước khi thêm `to` và cần kiểm thử hoặc xử lý riêng trước khi gửi hàng loạt; cập nhật link này không sửa luồng ghi RSVP.

## Tối ưu tên khách bằng Apps Script (02/11/2026)

Giữ nguyên link `?i=...`, PREP và cơ chế RSVP. Cloudflare đã được loại khỏi website và repository.

Bản `apps-script/Code.gs` mới sử dụng CacheService với TTL 300 giây để lưu tạm tên khách đã xác thực theo mã nội bộ. Lần đầu tra trực tiếp dòng nguồn từ registry (có kiểm tra đúng link), lần sau lấy từ cache. Tên được xóa khỏi cache khi sửa thủ công trong Guest List. Mỗi lần mở thiệp vẫn **kiểm tra tính hợp lệ của slug hiện tại** cùng trạng thái RSVP thật; cache không được dùng để quyết định quyền gửi phản hồi hoặc bật lại link PREP cũ. Website vẫn preload tên từ Apps Script ngay trong phần `head`.

**Cần cập nhật Web App Apps Script thủ công** để thay đổi backend có hiệu lực: xem [hướng dẫn trong apps-script](apps-script/README.md). Việc GitHub Pages deploy thành công không thay thế bước này. Không chạy `activateWeddingInvitations` trước ngày chính thức launch. Các cache của Google có thể hết hạn sớm, và lần mở đầu không bảo đảm tải tức thì.


Website thiệp cưới: https://linhthangwedding.github.io

**Deadline RSVP mới (02/11/2026):** Thứ Tư, 10/02/2027 lúc 23:59 giờ Việt Nam = 17:59 CET. Mốc này áp dụng cho cả RSVP lần đầu và chỉnh sửa, trên cả bản EN và VN. `script.js` và `apps-script/Code.gs` đã được cập nhật; **cần redeploy Apps Script trên Web App hiện tại** để Google Sheets thực thi hạn mới. Ngày cưới 28/02/2027 và file lịch `.ics` không thay đổi.

**Cập nhật giao diện 02/11/2026:** Dòng deadline chỉ sử dụng múi giờ Việt Nam và Central European Time (CET), không liệt kê từng quốc gia. Trong trạng thái RSVP đã xác nhận Có, `Update my RSVP` và `Add to my calendar` hiển thị cạnh nhau trên cùng một hàng, kể cả màn hình mobile. Tên khách xác minh từ Apps Script được yêu cầu từ đầu `<head>` trước các stylesheet và được hiển thị ngay khi có kết quả, không đợi bundle JavaScript cuối trang; không đưa tên khách vào repository. Lần mở đầu vẫn phụ thuộc vào tốc độ Google Apps Script.

**Link Add to calendar duy nhất (02/11/2026):** `https://linhthangwedding.github.io/assets/linh-thang-wedding.ics`. Cả nút Add to calendar ở thông tin sự kiện và nút Add to my calendar sau xác nhận RSVP đều tải đúng file .ics này. Không dùng link Google Calendar hoặc tạo link calendar khác trong invitation.

**English-only preview (v37):** Mọi nội dung hiển thị đã được rà lại theo hướng casual, ấm áp; ẩn switch VN/EN trong `index.html` và đặt `setLang("en")` trong `script.js`. Nội dung tiếng Việt **vẫn được giữ** ở `copy.vi` để bật lại sau. Khách mời vẫn giữ tên tiếng Việt theo Guest List. Không thay đổi backend/RSVP, hình ảnh, địa điểm hoặc lịch tiệc.

## Ảnh polaroid ở phần A little about us (demo)

Ba ảnh cũ đã có trong repo được dùng để demo trong `index.html`: `assets/garden.webp`, `assets/louvre.jpeg`, `assets/paris.jpeg`. Chỉ có 3 khung trắng nghiêng nhẹ, **không caption**. Desktop hiển thị một hàng, mobile hiển thị 2 khung trên và 1 khung căn giữa bên dưới, không tràn ngang; bố cục giữ nguyên khi thay đường dẫn ảnh sau này. Cả ba ảnh đều được crop gọn trong khung cố định 4:5 để không làm trang kéo dài hoặc lệch; ảnh garden hiện là bản thumbnail nên có thể hơi mờ, cần thay ảnh gốc khi chốt.

## Tăng tốc tải tên (v42)

Bản `script.js?v=42` hiển thị tên khách từ sessionStorage trong cùng tab cho lần mở lại sau khi đã xác minh; backend vẫn phải xác minh lại trước khi gửi RSVP. `Code.gs` tăng tốc tra cứu bằng TextFinder, bỏ thao tác lock/sync trên lần đọc khi PREP, và giữ link history khi LIVE. Phải redeploy `Code.gs` Web App đang có để áp dụng cải tiến backend. Tên khách/ID vẫn không được công khai trong repo.

## Link thiệp chính thức gọn (29/10/2026)

**Lịch sử (29/10/2026, không còn là cấu hình hiện hành):** các công thức `Guest List!H/S` trước đây chỉ tạo `?i=<slug>` và không có `&to=`. Quy tắc mới ngày 02/11/2026 được ghi phía trên. Tên khách được tra từ Master Google Sheet sau khi website tải; lần mở lại cùng tab có thể hiện sớm nhờ sessionStorage của `script.js?v=43`. Không công khai danh sách khách trong mã nguồn. Backend `Code.gs` vẫn tương thích cả link cũ có `&to=` và link mới chỉ có mã `i`.

Chỉ bật LIVE khi người dùng báo sẵn sàng gửi batch đầu tiên. LIVE là trạng thái chung, không bật lại cho từng batch. Hai khách đang chờ chốt tên chưa được cấp link trong Guest List.

## Thiệp cá nhân hóa
- Tiệc Thành hôn tại Capella Park View, TP.HCM ngày 28/02/2027; mời khách khoảng 11:00.
- Link riêng hiện có mã thiệp và tên được mã hóa URL; ví dụ: `https://linhthangwedding.github.io/?i=chi-thu-tam-kp&to=Ch%E1%BB%8B%20Thu%20T%C3%A2m`.
- Tên trên thiệp hiện ngay từ tham số `to` của link, sau đó được đối chiếu bằng tên chính xác từ `RSVP Online`/`Guest List` khi backend xác minh mã thiệp.
- Đuôi link **tự thay đổi khi sửa tên** trong Guest List, không cần chỉnh tay. Công thức chuyển tiếng Việt có dấu thành chữ thường không dấu; nếu trùng, hệ thống thêm phần phân biệt để giữ đúng khách.
- **Khi PREP:** chỉ link mới nhất hoạt động. **Sau khi LIVE:** link đã phát kể từ launch được giữ lại khi đổi tên; cả link cũ và mới đều trả về cùng khách.

Hiện có **162 khách mời có link riêng**, bao gồm 15 khách mới bổ sung sau khi Guest List được chèn thêm dòng. Bốn bản ghi kỹ thuật cũ không còn gắn với khách hợp lệ được giữ riêng để tránh tái sử dụng nhầm mã.

## Quản lý khách mời
Chỉ dùng HAI bảng có sẵn trong tab **Guest List**, không tạo bảng thứ ba:
- Bảng hồng bên trái: tên ở cột **B**, RSVP ở cột **F**, **Số người tham dự ở G**, link ở cột **H**.
- Bảng bên phải: tên ở cột **K**, RSVP ở cột **Q**, **Số người tham dự ở R**, link ở cột **S**.

Cấu trúc các cột có thể được đổi trên Google Sheets; Apps Script phiên bản hiện tại tìm cột theo tiêu đề ở hàng 1, không theo số cột cố định, kể cả khi kiểm tra tên vừa chỉnh sửa. Cột Số người tham dự là công thức: phản hồi Có hiển thị 1–10, Không hiển thị 0, chưa có phản hồi để trống.

Tab **RSVP Online** được giữ **ẩn** để lưu mã gốc 30 ký tự, đuôi hiện tại ở cột Q, snapshot ở cột U, trạng thái PREP/LIVE ở V2, thời điểm launch ở W2, số khách, lời nhắn, thời gian và mã biên nhận. Tab **RSVP Link History** cũng được giữ ẩn để lưu các đuôi trước đó. Không xóa hoặc công khai hai tab này.

## Chế độ chuẩn bị và phát thiệp (29/10/2026)

**Hiện đang ở PREP** trong Master File, tab kỹ thuật ẩn `RSVP Online`, ô `V2`.

- **PREP:** sửa tên khách thì link trong Guest List tự đổi. Chỉ **link hiện tại** được hệ thống nhận; link thử hoặc link cũ trước khi phát thiệp không được lưu thêm và không mở RSVP.
- **LIVE:** từ lúc bật chính thức, mỗi lần sửa tên mới, link cũ và link mới đều còn hiệu lực. Tất cả đều hiển thị **tên mới nhất** và lưu RSVP vào đúng mã khách gốc.
- Lịch sử được giữ trong tab ẩn `RSVP Link History`. Các link thử cũ từ giai đoạn PREP được giữ như dữ liệu lưu trữ, nhưng sẽ không được kích hoạt lại khi LIVE.

**Kích hoạt khi launch:** Sau khi cập nhật, deploy [Code.gs](apps-script/Code.gs) phiên bản mới, chỉ cần vào Apps Script chọn hàm `activateWeddingInvitations` rồi bấm **Run** **một lần** vào ngày bắt đầu gửi thiệp. Hàm tự ghi ngày launch ở ô `W2` và chuyển `V2` thành `LIVE`. **Không cần deploy lại khi launch.** Không chạy hàm khi còn trong giai đoạn chuẩn bị.

## Kích hoạt và kiểm thử
Việc đổi tên/link đã tự cập nhật bằng công thức Google Sheets. Mã Apps Script lưu lịch sử link **chỉ khi ở chế độ LIVE**, không lưu link thử từ PREP. **Cần Deploy → Manage deployments → Edit → New version → Deploy** một lần để kích hoạt logic hai chế độ. Xem [hướng dẫn](apps-script/README.md).

Trên website v33, số người tham dự là ô nhập bắt buộc khi chọn Có, tính cả người được mời; sau khi xác minh lưu thành công, website thông báo lại con số đã ghi nhận. Chưa xác nhận đã test RSVP đầu cuối từ browser đến Google Sheets sau bản cập nhật; không gửi thiệp hàng loạt trước khi test.

## Riêng tư
- Không đưa Guest List, mã gốc, lời nhắn RSVP hoặc số điện thoại lên GitHub.
- **Link theo tên dễ đoán hơn link có mã ngẫu nhiên.** Người đoán được link có thể xem tên và gửi phản hồi thay; link không phải xác thực danh tính mạnh. Nếu muốn bảo vệ RSVP tốt hơn, cần dùng mã ngẫu nhiên hoặc xác minh bổ sung.
