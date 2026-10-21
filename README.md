# Thiệp cưới Linh & Thắng

Website thiệp cưới song ngữ Việt / Anh: https://linhthangwedding.github.io

## Thiệp cá nhân hóa
- Tiệc Thành hôn tại Capella Park View, TP.HCM ngày 28/02/2027; mời khách khoảng 11:00.
- Link riêng hiện dạng dễ đọc, ví dụ: `https://linhthangwedding.github.io/?i=chi-thu-tam-kp`.
- Tên xuất hiện trên thiệp lấy TRỰC TIẾP từ cột **Tên khách mời** thuộc đúng dòng khách ở **Guest List**, không phải từ đuôi link.
- Đuôi link **tự thay đổi khi sửa tên** trong Guest List, không cần chỉnh tay. Công thức chuyển tiếng Việt có dấu thành chữ thường không dấu; nếu trùng, hệ thống thêm phần phân biệt để giữ đúng khách.
- Theo lựa chọn cập nhật, **cả link hiện tại và những link cũ đã được ghi nhận đều hoạt động**. Link cũ luôn tải tên mới nhất và ghi RSVP về cùng khách.

## Quản lý khách mời
Chỉ dùng HAI bảng có sẵn trong tab **Guest List**, không tạo bảng thứ ba:
- Bảng hồng bên trái: tên ở cột **B**, RSVP ở cột **E**, link ở cột **G**.
- Bảng bên phải: tên ở cột **J**, RSVP ở cột **P**, link ở cột **Q**.

Cấu trúc các cột có thể được đổi trên Google Sheets; Apps Script phiên bản hiện tại tìm cột theo tiêu đề ở hàng 1, không theo số cột cố định.

Tab **RSVP Online** được giữ **ẩn** để lưu mã gốc 30 ký tự, đuôi hiện tại ở cột Q, snapshot ở cột U, số khách, lời nhắn, thời gian và mã biên nhận. Tab **RSVP Link History** cũng được giữ ẩn để lưu các đuôi trước đó. Không xóa hoặc công khai hai tab này.

## Kích hoạt và kiểm thử
Việc đổi tên/link đã tự cập nhật bằng công thức Google Sheets. Mã Apps Script bổ sung `onEdit` lưu đuôi link trước khi đổi tên vào **RSVP Link History** (tab ẩn) và ánh xạ các link đó về mã khách gốc. **Cần cập nhật Apps Script và chọn Deploy → Manage deployments → Edit → New version → Deploy** để bật chức năng lưu link cũ. Xem [hướng dẫn](apps-script/README.md).

Chưa xác nhận đã test RSVP đầu cuối từ browser đến Google Sheets sau bản cập nhật slug. Không gửi thiệp hàng loạt trước khi test.

## Riêng tư
- Không đưa Guest List, mã gốc, lời nhắn RSVP hoặc số điện thoại lên GitHub.
- **Link theo tên dễ đoán hơn link có mã ngẫu nhiên.** Người đoán được link có thể xem tên và gửi phản hồi thay; link không phải xác thực danh tính mạnh. Nếu muốn bảo vệ RSVP tốt hơn, cần dùng mã ngẫu nhiên hoặc xác minh bổ sung.
