# Kết nối RSVP Google Sheets với thiệp Linh & Thắng

Đuôi link hiện dùng **tên không dấu**, ví dụ `?i=chi-thu-tam-kp`, thay cho mã 16 ký tự ngẫu nhiên. 162 link khách hiện có đuôi duy nhất (15 link mới được tạo sau khi Guest List bổ sung khách). Mã 30 ký tự vẫn là định danh nội bộ. Khi **PREP**, Web App chỉ nhận slug hiện tại; khi **LIVE**, các slug cũ ghi nhận từ thời điểm launch mới được chấp nhận.

## Cập nhật deployment (bắt buộc sau lần thay đổi này)
1. Trong Master File Google Sheets, chọn **Extensions → Apps Script**.
2. Thay toàn bộ nội dung **Code.gs** hiện có bằng [Code.gs phiên bản mới nhất](./Code.gs) và bấm **Save**.
3. **Deploy → Manage deployments → Edit** (bút chì của deployment Web App đang chạy).
4. **Version → New version → Deploy**. Giữ deployment cũ để URL `/exec` không đổi.
5. Kiểm tra **Execute as: Me** và **Who has access: Anyone**.

**Cần redeploy để bật hai chế độ.** Ở PREP chỉ link hiện tại hợp lệ; sau launch, link cũ phát sinh từ lúc LIVE và link mới cùng ánh xạ về một khách. Không gửi thiệp cho khách khi chưa kiểm thử.

## Bố cục Guest List hiện tại

| Bảng | Tên hiển thị | RSVP | Số người tham dự | Link |
|---|---|---|---|---|
| Bảng hồng, bên trái | B | F | G | H |
| Bảng bên phải | K | Q | R | S |

Các cột có thể dịch chuyển khi sửa bảng. Code.gs tìm tên cột dựa vào hai tiêu đề `Tên khách mời`, `Link`, `Event` và `RSVP` ở hàng 1.

- Tên khách **trên thiệp** được tra cứu từ cột Tên khách mời trong đúng bảng gốc; sửa cách xưng hô ở đây thì **cả tên trên thiệp và đuôi đường link tự đổi**, nhưng URL cũ được lưu và vẫn dùng được.
- Bộ nhận RSVP tra slug hiện tại hoặc lịch sử để tìm mã khách ổn định trong tab kỹ thuật **RSVP Online** rồi dò lại đúng dòng có link hiện tại.
- Tab kỹ thuật ẩn có đuôi dễ đọc tại cột Q, mã gốc cột A, lời nhắn và biên nhận. Không xóa.
- Trạng thái Có/Không ghi về cột RSVP ngay trên đúng dòng khách trong Guest List. **Số người tham dự** tự lấy từ tab ẩn: Có = số người đã xác nhận (1–10), Không = 0, chưa phản hồi = ô trống.

## Kiểm thử
1. Sao chép một link ở cột H hoặc S, mở bằng cửa sổ ẩn danh. Tên có dấu phải hiện dưới dòng `TRÂN TRỌNG KÍNH MỜI`.
2. Gửi thử RSVP bằng một khách thử, nhập số người (ví dụ 2), kiểm tra trạng thái ở cột F/Q và **số người ở G/R** đúng như đã nhập.
3. Xác minh cột H–L của tab ẩn RSVP Online có phản hồi, tổng số người, lời nhắn và biên nhận; sau kiểm thử, hoàn nguyên dữ liệu thử.
4. Chỉ bắt đầu gửi thiệp sau khi chức năng RSVP hoạt động đầu cuối.

## Cảnh báo bảo mật
Link gợi nhớ theo tên có thể bị người ngoài đoán. Người có hoặc đoán được đường dẫn có thể gửi RSVP thay khách. Cách này tiện chia sẻ nhưng **kém riêng tư hơn mã ngẫu nhiên**, không nên coi là xác minh danh tính. Không công khai toàn bộ link cá nhân.

## Chế độ PREP/LIVE: chỉ lưu link cũ từ lúc phát thiệp chính thức

**Mặc định đã đặt PREP** trong tab ẩn `RSVP Online`, ô `V2`. Ngày phát thiệp `W2` đang để trống.

| Chế độ | Link sau khi sửa tên | Link cũ | RSVP |
|---|---|---|---|
| PREP | Tự đổi theo tên hiện tại | Không nhận link thử cũ | Khớp đúng mã khách |
| LIVE | Tự đổi theo tên hiện tại | Các link được tạo **sau thời điểm launch** vẫn hoạt động | Khớp về cùng một khách |

**Để triển khai chế độ này ngay bây giờ:**
1. Copy [Code.gs mới nhất](./Code.gs) vào Apps Script đã kết nối với Master File, **Save**.
2. **Deploy → Manage deployments → Edit → New version → Deploy**. Không cần thay Web App URL.
3. Để nguyên `V2 = PREP`. Không chạy hàm launch lúc này.

**Khi bắt đầu gửi thiệp chính thức:**
1. Mở Master File → **Extensions → Apps Script**.
2. Ở dropdown chọn hàm **`activateWeddingInvitations`**, bấm **Run** một lần.
3. Hàm sẽ chụp baseline link hiện tại, tự ghi thời điểm launch ở `W2`, đổi `V2` thành `LIVE`. Các link được thay đổi từ sau đó tự lưu lịch sử. Không phải deploy lại.
4. Test cả hai URL cũ/mới sau một lần đổi tên thử, xác nhận hiển thị tên mới và RSVP khớp đúng khách.

**Lưu ý:** Dữ liệu lịch sử link cũ từ PREP vẫn có thể nằm trong tab `RSVP Link History`, nhưng bộ nhận chỉ tra alias có thời gian **từ launch trở đi**. Không cần xóa dữ liệu cũ. Link ngẫu nhiên cũ trước launch cũng không được dùng. Khi test trước launch, chỉ link mới nhất hợp lệ.


## Ghi chú khi chèn dòng khách mới

Các công thức B/X trong tab kỹ thuật được cập nhật để theo tên/ghi chú của đúng người sau khi chèn dòng. Nếu thêm **khách mới hoàn toàn** vào Guest List, cần tạo cho khách một mã thiệp nội bộ mới và link mới, không sao chép link của khách phía trên. 15 khách mới đã được bổ sung ở lần rà soát 29/10/2026; 162 người hiện có link riêng. Các bản ghi ứng với khách đã xóa được giữ ẩn, không cấp lại mã cho khách khác.

## Xác nhận số người tham dự (29/10/2026)

- Trên website v33, chọn **Có** sẽ hiển thị trường **Số người tham dự (bao gồm bạn)**, cần nhập số nguyên 1–10. Khi chọn **Không**, form không yêu cầu nhập số và bộ nhận ghi 0.
- Sau khi Google Sheets xác nhận lưu thành công qua mã biên nhận, website sẽ hiển thị thông báo kèm số người đã ghi nhận.
- Không thêm bảng thứ ba; trong Guest List, ngay sau RSVP ở cột **F/Q** là cột **Số người tham dự G/R**, link dịch sang **H/S**.
- Số người ở Guest List đọc trực tiếp tab ẩn RSVP Online (cột I) theo **đuôi link hiện tại**, không bị lẫn khi thay đổi tên. Giá trị 0 là Không tham dự; ô trống là Chưa phản hồi.
- Vì các cột của bảng bên phải đã dịch chuyển, **Code.gs cũng đã đổi onEdit sang nhận dạng vị trí cột Tên khách mời theo tiêu đề**, cần Save và **Deploy → Manage deployments → Edit → New version → Deploy** để bật đúng quy trình lưu link sau launch. Website tự xuất bản khi GitHub Pages cập nhật, không cần deploy riêng.
