# Thiệp cưới Linh & Thang

Website thiệp cưới song ngữ VN / EN trên GitHub Pages:
https://linhthangwedding.github.io

## Thông tin thiệp
- Tiệc Thành hôn: **28/02/2027**, Capella Park View, TP.HCM.
- Giờ mời khách: khoảng **11:00**.
- Thiệp có thể cá nhân hóa bằng mã `?invite=MÃ_RIÊNG&to=TÊN_KHÁCH`.
- Mã và tên khách được quản lý trong tab **RSVP Online** của **Master File_Linh & Thang** (Google Sheet riêng tư). Không đưa danh sách khách lên repo công khai.

## RSVP
Website đã có form RSVP theo link riêng. Front-end **không tự báo thành công** trừ khi backend xác nhận ghi dữ liệu về Google Sheets.

**Đã cấu hình URL nhận RSVP** trong `script.js` từ Google Apps Script do chủ tiệc cung cấp ngày 14/10/2026. **Chưa kiểm thử đầu cuối phản hồi khách thật**; cần xác nhận deployment cho phép truy cập công khai và chạy thử việc ghi phản hồi vào Google Sheets trước khi phát thiệp. Xem [apps-script/README.md](apps-script/README.md) để kiểm tra quyền truy cập và phương pháp thử.

Phản hồi sau khi được kết nối:
- Được ghi về tab `RSVP Online` (trạng thái, số khách, lời nhắn, thời gian).
- Đồng bộ vào `Guest List`: bảng bên trái cột E, bảng bên phải cột O.
- Những khách chưa được gắn sự kiện `Đám cưới` cần phân loại trước khi gửi link.

## An toàn
- Không commit tên khách, mã riêng, danh sách RSVP hay thông tin cá nhân vào repo.
- Link mời có thể được chuyển tiếp cho người khác. Mã link là công cụ khớp RSVP, không phải phương pháp xác minh danh tính tuyệt đối.
