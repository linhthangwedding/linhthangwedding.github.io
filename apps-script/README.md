# RSVP trực tiếp về Wedding Master File

Đây là mã nhận phản hồi từ thiệp cưới GitHub Pages.
Khách mời có link riêng trong tab **RSVP Online** của Google Sheet.
Mã này KHÔNG tự hoạt động chỉ vì đã có trên GitHub.

## 1. Kích hoạt bộ nhận RSVP
1. Mở Master File_Linh & Thang (Google Sheets), vào **Extensions → Apps Script**.
2. Xóa nội dung `Code.gs` mặc định và sao chép toàn bộ `Code.gs` ở thư mục này vào.
3. Bấm **Save**.
4. Chọn **Deploy → New deployment → Web app**.
5. **Execute as: Me**, **Who has access: Anyone**. Xác nhận quyền truy cập Google Sheets khi Google yêu cầu.
6. Copy URL triển khai kết thúc bằng **/exec**. Chỉ gửi URL này lại cho người quản trị website để cập nhật `RSVP_ENDPOINT` trong `script.js` (hiện đang để trống).

Nếu không có tùy chọn **Anyone**, cần một cách triển khai khác; đừng dùng chế độ yêu cầu đăng nhập vì khách không nên cần tài khoản Google.

## 2. Cách hoạt động
- Tab **RSVP Online** chứa mã ngẫu nhiên, link cá nhân, tên lấy bằng công thức từ **Guest List**, RSVP, số người, lời nhắn và thời gian.
- Website lấy `invite` và `to` từ link, hiển thị tên dưới dòng "TRÂN TRỌNG KÍNH MỜI".
- Website gửi `invite` (không dựa vào tên khách gõ) đến bộ nhận phản hồi.
- Bộ nhận chỉ chấp nhận những dòng có cột `Sự kiện` đúng là **Đám cưới**.
- Phản hồi được lưu trong tab **RSVP Online** và cập nhật cột **Confirm**:
  - bảng bên trái của **Guest List** → cột **E**
  - bảng bên phải của **Guest List** → cột **O**.
- Website chỉ hiện "Đã nhận" khi kiểm tra được một mã biên nhận đã thật sự lưu vào Sheet.

## 3. Trước khi gửi link thật
- Kiểm tra những người chưa có phân loại sự kiện trong Guest List; tab RSVP Online đánh dấu chờ xác nhận.
- Xử lý các dòng gộp tên, ví dụ `Huy + Hạnh`, nếu muốn gửi từng người một link.
- Gửi **link trong cột F** tab RSVP Online; không đăng danh sách khách hoặc mã thiệp lên repository công khai.
- **Test bằng một khách thử**, chọn Có hoặc Không, xem cột H–L trong RSVP Online và cột E/O trong Guest List. Sau khi test, xóa trạng thái test để khách RSVP thật.
- Không tự gửi link khi website chưa có URL Apps Script thực.

## Lưu ý an toàn
- URL riêng là một vé mời truy cập bằng link, **không phải xác thực danh tính mạnh**; ai có link có thể trả lời thay khách. Chỉ chia sẻ cho đúng người.
- Mã RSVP nằm trong **Google Sheet riêng tư**, không đưa danh sách khách lên GitHub.
- Không sắp xếp hay thay đổi vị trí từng bảng nguồn Guest List mà không rà lại mapping; backend sẽ ngừng ghi nếu nhận thấy tên ở dòng nguồn không khớp.
- Bản thiết kế dùng POST không-CORS và GET kiểm tra biên nhận để xác nhận dữ liệu đã tới Google Sheets. Không cần khách đăng nhập tài khoản Google.
