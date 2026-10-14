# Thiệp cưới Linh & Thang

Website thiệp cưới song ngữ VN / EN trên GitHub Pages:
https://linhthangwedding.github.io

## Thông tin thiệp
- Tiệc Thành hôn: **28/02/2027**, Capella Park View, TP.HCM.
- Giờ mời khách: khoảng **11:00**.
- Link thiệp ngắn dạng `?i=MÃ_16_KÝ_TỰ`. Không đưa tên khách vào URL.
- Tên khách hiển thị được lấy từ cột **Tên khách mời (HIỂN THỊ TRÊN THIỆP)** ở phần bảng cuối tab **Guest List**, cập nhật tự động khi đổi tên trong cột này.
- Link và tên hiển thị được quản lý trong tab **Guest List** của Master File. Tab kỹ thuật **RSVP Online** được giữ ẩn cho bộ nhận phản hồi, không cần thao tác thường ngày. Không đưa danh sách khách lên repo công khai.

## RSVP
Website đã có form RSVP theo link riêng. Front-end **không tự báo thành công** trừ khi backend xác nhận ghi dữ liệu về Google Sheets.

**Website đã đổi sang link ngắn** và cấu hình URL nhận RSVP. **BẮT BUỘC cập nhật mã Google Apps Script và redeploy phiên bản mới** để link ngắn tải tên từ Master File. Chưa xác minh RSVP đầu cuối. Xem [apps-script/README.md](apps-script/README.md) để làm đúng bước kích hoạt.

Phản hồi sau khi được kết nối:
- Được ghi về tab `RSVP Online` (trạng thái, số khách, lời nhắn, thời gian).
- Đồng bộ vào `Guest List`: bảng bên trái cột E, bảng bên phải cột O.
- Những khách chưa được gắn sự kiện `Đám cưới` cần phân loại trước khi gửi link.

## An toàn
- Không commit tên khách, mã riêng, danh sách RSVP hay thông tin cá nhân vào repo.
- Link mời có thể được chuyển tiếp cho người khác. Mã link là công cụ khớp RSVP, không phải phương pháp xác minh danh tính tuyệt đối.
