# Kết nối RSVP Google Sheets với thiệp Linh & Thắng

Đuôi link hiện dùng **tên không dấu**, ví dụ `?i=chi-thu-tam-kp`, thay cho mã 16 ký tự ngẫu nhiên. 151 link có đuôi duy nhất. Mã 30 ký tự cũ vẫn lưu ở tab ẩn để định danh nội bộ, nhưng **Web App chỉ chấp nhận đuôi link hiện tại ở cột Q**. Link cũ không còn hợp lệ.

## Cập nhật deployment (bắt buộc sau lần thay đổi này)
1. Trong Master File Google Sheets, chọn **Extensions → Apps Script**.
2. Thay toàn bộ nội dung **Code.gs** hiện có bằng [Code.gs phiên bản mới nhất](./Code.gs) và bấm **Save**.
3. **Deploy → Manage deployments → Edit** (bút chì của deployment Web App đang chạy).
4. **Version → New version → Deploy**. Giữ deployment cũ để URL `/exec` không đổi.
5. Kiểm tra **Execute as: Me** và **Who has access: Anyone**.

**Cần redeploy để loại bỏ xử lý link cũ**. Hệ thống chỉ nhận đuôi link hiện tại sau khi cập nhật phiên bản backend. Không gửi thiệp cho khách khi chưa kiểm thử.

## Bố cục Guest List hiện tại

| Bảng | Tên hiển thị | Đường dẫn thiệp | RSVP |
|---|---|---|---|
| Bảng hồng, bên trái | B | G | E |
| Bảng bên phải | J | Q | P |

Các cột có thể dịch chuyển khi sửa bảng. Code.gs tìm tên cột dựa vào hai tiêu đề `Tên khách mời`, `Link`, `Event` và `RSVP` ở hàng 1.

- Tên khách **trên thiệp** được tra cứu từ cột Tên khách mời trong đúng bảng gốc; sửa cách xưng hô ở đây thì **cả tên trên thiệp và đuôi đường link tự đổi**, không cần bấm Run.
- Bộ nhận RSVP dùng đuôi link để tìm mã gốc trong tab kỹ thuật **RSVP Online** rồi dò lại đúng dòng khách có link đó.
- Tab kỹ thuật ẩn có đuôi dễ đọc tại cột Q, mã gốc cột A, lời nhắn và biên nhận. Không xóa.
- Trạng thái Có/Không (và số người nếu có) ghi vào cột RSVP ngay trên đúng dòng khách trong Guest List.

## Kiểm thử
1. Sao chép một link ở cột G hoặc Q, mở bằng cửa sổ ẩn danh. Tên có dấu phải hiện dưới dòng `TRÂN TRỌNG KÍNH MỜI`.
2. Gửi thử RSVP bằng một khách thử và kiểm tra đúng dòng có phản hồi trong cột E/P.
3. Xác minh cột H–L của tab ẩn RSVP Online có dữ liệu phản hồi; sau khi kiểm thử, xóa dữ liệu thử.
4. Chỉ bắt đầu gửi thiệp sau khi chức năng RSVP hoạt động đầu cuối.

## Cảnh báo bảo mật
Link gợi nhớ theo tên có thể bị người ngoài đoán. Người có hoặc đoán được đường dẫn có thể gửi RSVP thay khách. Cách này tiện chia sẻ nhưng **kém riêng tư hơn mã ngẫu nhiên**, không nên coi là xác minh danh tính. Không công khai toàn bộ link cá nhân.

## Tự động đổi tên và link (không cần chạy Apps Script)

**Đã thiết lập công thức cho 151 khách đang có link:**
- Guest List cột **B** (bảng hồng) / **J** (bảng bên phải) là nơi sửa tên.
- Link ở cột **G** / **Q** là công thức đọc đuôi link mới nhất, tự đổi ngay khi tên thay đổi.
- Tab RSVP Online (ẩn) dùng cột **R** để chuyển tên có dấu thành slug; cột **S** giữ hậu tố phân biệt; cột **T** ghép các phần; cột **Q** xử lý trùng tên bằng mã ngắn nếu cần.
- Website tra cứu tên có dấu bằng đuôi link hiện tại và ghi RSVP về đúng người. Đổi tên không đổi mã nội bộ của khách.
- **Không có trigger onEdit, không cần chạy hàm syncAllGuestLinks hay cấp thêm quyền kích hoạt tự động.** Đó là hướng cũ đã thay thế bằng công thức.
- Nếu xóa tên, link tự ẩn. Khi nhập lại tên, link tự xuất hiện với đuôi mới.
- Link cũ theo tên trước đó không được Web App phiên bản mới chấp nhận.

**Chỉ một bước thủ công cần làm:** thay `Code.gs` bằng bản mới nhất và redeploy **New version** vì logic từ chối link cũ phải được cập nhật trong Web App. Không cần thay URL `/exec`.

Sau khi redeploy, hãy kiểm thử bằng cách sửa một tên chưa gửi thiệp, kiểm tra link thay đổi, mở link thấy tên mới, và thử phản hồi bằng khách thử. Hoàn nguyên tên nếu dùng để thử. Tuyệt đối không sửa trực tiếp cột Link hoặc các công thức trong tab ẩn.

**Lưu ý:** Hệ thống đảm bảo khi sửa trực tiếp ô tên. Nếu sau này sắp xếp/di chuyển các dòng hay chèn cột mới vào hai bảng, nên rà lại công thức và liên kết dữ liệu trước khi gửi link vì registry hiện tham chiếu vị trí các dòng nguồn.
