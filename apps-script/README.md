# RSVP trực tiếp về Wedding Master File

Đây là mã nhận phản hồi từ thiệp cưới GitHub Pages.
Khách mời có link riêng trong tab **RSVP Online** của Google Sheet.
Mã này KHÔNG tự hoạt động chỉ vì đã có trên GitHub.

## 0. Đổi sang link ngắn (bắt buộc nếu từng deploy bản trước)
- Website dùng link `?i=MÃ_16_KÝ_TỰ` thay vì `?invite=MÃ_DÀI&to=TÊN`. Tên được truy xuất an toàn từ cột A của bảng thiệp cuối tab **Guest List**.
- Mở Apps Script hiện có từ Master Google Sheet, thay **toàn bộ nội dung** file `Code.gs` bằng bản **mới nhất** trong repository này, bấm Save.
- Vào **Deploy → Manage deployments → Edit (biểu tượng bút chì)**, chọn **Version → New version**, rồi **Deploy**. Không tạo dự án Apps Script mới; URL `/exec` thường được giữ nguyên khi cập nhật deployment cũ.
- Cho đến khi redeploy mã mới, link ngắn chưa tự tải tên nên **chưa gửi thiệp cho khách**. Link cũ đã gửi với `?invite=...&to=...` vẫn được xử lý.

## 1. Kích hoạt bộ nhận RSVP
1. Mở Master File_Linh & Thang (Google Sheets), vào **Extensions → Apps Script**.
2. Xóa nội dung `Code.gs` mặc định và sao chép toàn bộ `Code.gs` ở thư mục này vào.
3. Bấm **Save**.
4. Chọn **Deploy → New deployment → Web app**.
5. **Execute as: Me**, **Who has access: Anyone**. Xác nhận quyền truy cập Google Sheets khi Google yêu cầu.
6. Copy URL triển khai kết thúc bằng **/exec**. Chỉ gửi URL này lại cho người quản trị website để cập nhật `RSVP_ENDPOINT` trong `script.js` (hiện đang để trống).

Nếu không có tùy chọn **Anyone**, cần một cách triển khai khác; đừng dùng chế độ yêu cầu đăng nhập vì khách không nên cần tài khoản Google.

## 2. Cách hoạt động
- Tab **Guest List** chứa bảng quản lý thiệp ở các dòng 147–300, cột A là **Tên khách mời (HIỂN THỊ TRÊN THIỆP)** và cột F là link ngắn. Tab **RSVP Online** là bảng kỹ thuật ẩn, giữ mã gốc 30 ký tự và lưu phản hồi. Không xóa tab kỹ thuật.
- Website lấy `i` từ link, gọi Apps Script bằng JSONP action `guest` để lấy **tên hiển thị** từ Guest List (không cần `to` trên URL), rồi hiển thị dưới dòng "TRÂN TRỌNG KÍNH MỜI".
- Website gửi `invite` (không dựa vào tên khách gõ) đến bộ nhận phản hồi.
- Bộ nhận chỉ chấp nhận những dòng có cột `Sự kiện` đúng là **Đám cưới**.
- Phản hồi được lưu trong tab **RSVP Online** và cập nhật cột **Confirm**:
  - bảng bên trái của **Guest List** → cột **E**
  - bảng bên phải của **Guest List** → cột **O**.
- Website chỉ hiện "Đã nhận" khi kiểm tra được một mã biên nhận đã thật sự lưu vào Sheet.

## 3. Trước khi gửi link thật
- Kiểm tra những người chưa có phân loại sự kiện trong Guest List; tab RSVP Online đánh dấu chờ xác nhận.
- Xử lý các dòng gộp tên, ví dụ `Huy + Hạnh`, nếu muốn gửi từng người một link.
- Gửi **link trong cột F** của bảng thiệp ở cuối tab **Guest List**; không đăng danh sách khách hoặc mã thiệp lên repository công khai.
- **Test bằng một khách thử**, chọn Có hoặc Không, xem cột H–L trong RSVP Online và cột E/O trong Guest List. Sau khi test, xóa trạng thái test để khách RSVP thật.
- Không tự gửi link khi website chưa có URL Apps Script thực.

## Lưu ý an toàn
- URL riêng là một vé mời truy cập bằng link, **không phải xác thực danh tính mạnh**; ai có link có thể trả lời thay khách. Chỉ chia sẻ cho đúng người.
- Mã RSVP nằm trong **Google Sheet riêng tư**, không đưa danh sách khách lên GitHub.
- Không sắp xếp hay thay đổi vị trí từng bảng nguồn Guest List mà không rà lại mapping; backend sẽ ngừng ghi nếu nhận thấy tên ở dòng nguồn không khớp.
- Bản thiết kế dùng POST không-CORS và GET kiểm tra biên nhận để xác nhận dữ liệu đã tới Google Sheets. Không cần khách đăng nhập tài khoản Google.
