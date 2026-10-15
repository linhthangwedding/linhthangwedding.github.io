# Kết nối RSVP Google Sheets với thiệp Linh & Thắng

Website và Master File đã được cập nhật để link nằm NGAY TRONG hai bảng khách hiện có của tab Guest List, không có bảng quản lý thiệp thứ ba.

## Bắt buộc: cập nhật deployment hiện có
1. Trong Master File → **Extensions → Apps Script**.
2. Mở file `Code.gs` đã tạo trước đây, thay **toàn bộ** bằng [Code.gs mới nhất](./Code.gs).
3. **Save**.
4. Chọn **Deploy → Manage deployments → Edit** (bút chì của Web App đang chạy).
5. **Version: New version → Deploy**. Giữ nguyên Web App cũ để giữ URL `/exec` hiện có.
6. Đảm bảo **Execute as: Me**, **Who has access: Anyone** để khách không cần đăng nhập Google.

Cần redeploy lần này vì trước đó Apps Script còn đọc bảng thiệp ở cuối Guest List, còn bảng đó đã được gỡ bỏ theo yêu cầu.

## Cách dữ liệu được lưu
| Bảng khách | Tên HIỂN THỊ trên thiệp | Link riêng | Phản hồi tự ghi |
|---|---|---|---|
| Bảng hồng | Guest List cột B (Name) | cột G (Link) | cột E (Confirm) |
| Bảng bên phải | Guest List cột K (Name) | cột R (Link) | cột Q (RSVP) |

- Có tổng 151 link cá nhân đã tạo, không thêm link cho các dòng tên đang trống và placeholder.
- Tên trên thiệp luôn được đọc từ chính cột Name trong hai bảng. Đổi tên trong bảng sẽ đổi tên khi khách mở thiệp.
- Mã 30 ký tự, số khách, lời nhắn, thời gian và mã biên nhận được lưu ở tab **RSVP Online** ẩn, KHÔNG xóa tab này.
- Để khớp đúng người kể cả khi bạn sửa tên hoặc sắp xếp các dòng, backend dò theo mã trong cột G/R chứ không dựa vào tên khách hoặc số thứ tự dòng.
- Cột Event để trống vẫn được chấp nhận nếu tên đã ở một trong hai bảng khách cưới; nếu Event chỉ định nghi lễ khác, backend không chấp nhận RSVP cho thiệp 28/02.

## Thử trước khi gửi
1. Mở một link từ cột G hoặc R; phải thấy tên chính xác ngay dưới dòng **Trân trọng kính mời**.
2. Tự gửi một phản hồi thử bằng link của một người đã đồng ý test; sau đó kiểm tra cột E hoặc Q có phản hồi, và tab ẩn RSVP Online có số lượng và lời nhắn tương ứng.
3. Nếu thử bằng dữ liệu khách thật, xóa hoặc trả về trạng thái chưa phản hồi sau khi kiểm thử.
4. Không gửi link hàng loạt trước khi các bước này hoạt động.

## Quyền riêng tư
Website là GitHub Pages tĩnh, không chứa danh sách khách. API tra cứu chỉ trả về tên của người có mã hợp lệ trong link. Link không phải cơ chế xác thực danh tính mạnh, vì có thể được chuyển tiếp. Không xuất bản Guest List lên GitHub.
