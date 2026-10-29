# Kết nối RSVP Google Sheets với thiệp Linh & Thắng

Đuôi link hiện dùng **tên không dấu**, ví dụ `?i=chi-thu-tam-kp`, thay cho mã 16 ký tự ngẫu nhiên. 151 link có đuôi duy nhất. Mã 30 ký tự cũ vẫn là định danh nội bộ; từ bản cập nhật này, Web App sẽ nhận cả slug hiện tại và các slug cũ được lưu trong **RSVP Link History**.

## Cập nhật deployment (bắt buộc sau lần thay đổi này)
1. Trong Master File Google Sheets, chọn **Extensions → Apps Script**.
2. Thay toàn bộ nội dung **Code.gs** hiện có bằng [Code.gs phiên bản mới nhất](./Code.gs) và bấm **Save**.
3. **Deploy → Manage deployments → Edit** (bút chì của deployment Web App đang chạy).
4. **Version → New version → Deploy**. Giữ deployment cũ để URL `/exec` không đổi.
5. Kiểm tra **Execute as: Me** và **Who has access: Anyone**.

**Cần redeploy để bật xử lý link cũ**. Sau khi kích hoạt, cả link cũ và link mới cùng ánh xạ về một khách. Không gửi thiệp cho khách khi chưa kiểm thử.

## Bố cục Guest List hiện tại

| Bảng | Tên hiển thị | Đường dẫn thiệp | RSVP |
|---|---|---|---|
| Bảng hồng, bên trái | B | G | E |
| Bảng bên phải | J | Q | P |

Các cột có thể dịch chuyển khi sửa bảng. Code.gs tìm tên cột dựa vào hai tiêu đề `Tên khách mời`, `Link`, `Event` và `RSVP` ở hàng 1.

- Tên khách **trên thiệp** được tra cứu từ cột Tên khách mời trong đúng bảng gốc; sửa cách xưng hô ở đây thì **cả tên trên thiệp và đuôi đường link tự đổi**, nhưng URL cũ được lưu và vẫn dùng được.
- Bộ nhận RSVP tra slug hiện tại hoặc lịch sử để tìm mã khách ổn định trong tab kỹ thuật **RSVP Online** rồi dò lại đúng dòng có link hiện tại.
- Tab kỹ thuật ẩn có đuôi dễ đọc tại cột Q, mã gốc cột A, lời nhắn và biên nhận. Không xóa.
- Trạng thái Có/Không (và số người nếu có) ghi vào cột RSVP ngay trên đúng dòng khách trong Guest List.

## Kiểm thử
1. Sao chép một link ở cột G hoặc Q, mở bằng cửa sổ ẩn danh. Tên có dấu phải hiện dưới dòng `TRÂN TRỌNG KÍNH MỜI`.
2. Gửi thử RSVP bằng một khách thử và kiểm tra đúng dòng có phản hồi trong cột E/P.
3. Xác minh cột H–L của tab ẩn RSVP Online có dữ liệu phản hồi; sau khi kiểm thử, xóa dữ liệu thử.
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

