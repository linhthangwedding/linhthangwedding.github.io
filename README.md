# Thiệp cưới Linh & Thắng

Website thiệp cưới song ngữ VN / EN:
https://linhthangwedding.github.io

## Nội dung
- Tiệc Thành hôn 28/02/2027 tại Capella Park View, TP.HCM, giờ mời khách khoảng 11:00.
- Link thiệp cá nhân dạng **https://linhthangwedding.github.io/?i=MÃ_RIÊNG**.
- Tên trên thiệp lấy TRỰC TIẾP từ cột **Name** thuộc đúng dòng khách trong tab **Guest List**.

## Danh sách khách và link
Giữ nguyên **hai bảng khách hiện có trong Guest List**, không thêm bảng thứ ba:
- Bảng hồng (bên trái): **B = Name**, **E = Confirm**, **G = Link**.
- Bảng khách (bên phải): **K = Name**, **Q = RSVP**, **R = Link**.
- Tab **RSVP Online** được ẩn để làm sổ mã/biên nhận kỹ thuật. KHÔNG xóa tab này.

Tên trên thiệp chính là giá trị trong cột Name B/K. Chỉnh cách xưng hô ở đây sẽ đổi tên hiển thị trên thiệp mà KHÔNG cần tạo link mới.

## Kích hoạt RSVP
Website đã kết nối URL Google Apps Script Web App, nhưng sau lần chỉnh sửa bố cục Guest List, **chủ tiệc cần thay Code.gs bằng bản mới nhất và Redeploy New version**. Xem [apps-script/README.md](apps-script/README.md).

Khi gửi thành công, Apps Script cập nhật cột E hoặc Q ngay tại đúng dòng khách, và đồng thời lưu số người/lời nhắn/thời gian ở tab kỹ thuật ẩn.

## Lưu ý
- Chưa có xác nhận đã kiểm thử đầu-cuối sau cập nhật mới, đừng gửi link thật tới khách trước khi test.
- Không đăng công khai Guest List, mã đầy đủ, RSVP hay thông tin cá nhân trên GitHub.
- Người có link thiệp riêng có thể phản hồi thay, vì link là công cụ phân biệt khách chứ không phải hình thức xác minh danh tính mạnh.
