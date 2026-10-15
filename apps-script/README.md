# Kết nối RSVP Google Sheets với thiệp Linh & Thắng

Đuôi link hiện dùng **tên không dấu**, ví dụ `?i=chi-thu-tam-kp`, thay cho mã 16 ký tự ngẫu nhiên. 151 link có đuôi duy nhất. Mã 30 ký tự cũ và 16 ký tự cũ vẫn được giữ trong tab ẩn để tương thích.

## Cập nhật deployment (bắt buộc sau lần thay đổi này)
1. Trong Master File Google Sheets, chọn **Extensions → Apps Script**.
2. Thay toàn bộ nội dung **Code.gs** hiện có bằng [Code.gs phiên bản mới nhất](./Code.gs) và bấm **Save**.
3. **Deploy → Manage deployments → Edit** (bút chì của deployment Web App đang chạy).
4. **Version → New version → Deploy**. Giữ deployment cũ để URL `/exec` không đổi.
5. Kiểm tra **Execute as: Me** và **Who has access: Anyone**.

Backend cũ không hỗ trợ đuôi link theo tên. Không gửi link mới khi chưa redeploy.

## Bố cục Guest List hiện tại

| Bảng | Tên hiển thị | Đường dẫn thiệp | RSVP |
|---|---|---|---|
| Bảng hồng, bên trái | B | G | E |
| Bảng bên phải | J | Q | P |

Các cột có thể dịch chuyển khi sửa bảng. Code.gs tìm tên cột dựa vào hai tiêu đề `Tên khách mời`, `Link`, `Event` và `RSVP` ở hàng 1.

- Tên khách **trên thiệp** được tra cứu từ cột Tên khách mời trong đúng bảng gốc; sửa cách xưng hô ở đây thì thiệp đổi tương ứng, **không đổi đường link**.
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
