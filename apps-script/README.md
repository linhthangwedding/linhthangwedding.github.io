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

## Giữ cả link cũ và mới khi đổi tên

**Google Sheets đã được chuẩn bị:** Guest List cột **B/J** lưu tên hiển thị có dấu; cột **G/Q** tự tạo link theo tên mới. Tab kỹ thuật `RSVP Online` lưu mã nội bộ ở A, slug hiện tại ở Q, snapshot slug gần nhất ở U. Tab ẩn `RSVP Link History` ghi **slug cũ + mã nội bộ**, không lộ danh sách khách trên GitHub.

**Apps Script mới có hai lớp đồng bộ:**
- Hàm `onEdit(e)` tự chạy khi sửa tên trực tiếp trong hai bảng Guest List. Hàm lưu slug cũ vào tab lịch sử rồi cập nhật snapshot slug mới.
- Lúc một link cũ hoặc mới truy cập Web App, backend đối chiếu lại snapshot để xử lý cả trường hợp công thức vừa thay đổi hoặc chỉnh sửa từ công cụ khác.
- Chỉ cần cập nhật `Code.gs` và redeploy Web App một lần để bật. **Không cần tự chạy** `syncAllGuestLinks`, vì hàm cũ đã được thay thế.

**Tương thích:** Link ngắn theo tên trước đó (nếu đã được lưu trong lịch sử), link dài ngẫu nhiên 30 ký tự, mã 16 ký tự cũ và link tên hiện tại đều trả về cùng người. Tên hiển thị luôn được đọc từ Guest List tại thời điểm mở thiệp. RSVP được ghi về cùng ô E/P của khách bất kể dùng phiên bản nào.

**An toàn khi trùng tên:** Công thức slug tự thêm 4 ký tự của mã ổn định khi trùng với link của khách khác, kể cả link đã lưu lịch sử. Backend từ chối nếu hai khách thật sự dùng cùng một alias, để không ghi nhầm RSVP.

**Đã chuẩn bị 151 snapshot đầu tiên**, và một vài link trước khi kích hoạt lịch sử đã được phục hồi từ các phiên bản Master File có thể kiểm tra. Không thể cam kết phục hồi các URL cũ đã mất mà không còn trong hồ sơ.

**Quan trọng:** Cần vào Apps Script đã deploy, thay toàn bộ [Code.gs mới nhất](./Code.gs), **Save → Deploy → Manage deployments → Edit → New version → Deploy**. Không cần đổi URL `/exec`. Sau đó thử đổi tên một khách chưa gửi thiệp, kiểm tra link cũ và mới cùng hiển thị tên mới; thử RSVP bằng một khách thử và hoàn nguyên dữ liệu sau khi kiểm tra.

**Quyền riêng tư:** Đuôi link theo tên dễ bị đoán hơn token ngẫu nhiên. Cả link cũ và mới cùng hoạt động thì những URL đã chia sẻ trước đây vẫn truy cập được; không nên dùng link làm bằng chứng xác thực danh tính.
