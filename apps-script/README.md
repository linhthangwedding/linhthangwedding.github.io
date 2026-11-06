# Kết nối RSVP Google Sheets với thiệp Linh & Thắng

## Khôi phục lưu RSVP, xác nhận song song và tâm icon (06/11/2026)

- Backend đang phục vụ vẫn dò nhãn cột tại dòng 1. Các dòng ghi chú từng đẩy nhãn bảng khách xuống dòng 4, làm toàn bộ 160 link không tìm được dòng ghi RSVP.
- Đã thêm **một dòng tiêu đề kỹ thuật ẩn ở dòng 1 của Guest List**, sao chép đúng nhãn cột và giữ hai bảng khách hiển thị bên dưới. Tiêu đề hiển thị hiện ở dòng 5; giữ dòng kỹ thuật ở vị trí 1 cho đến khi backend dò tiêu đề động được triển khai. Không xóa dòng này khi thêm ghi chú.
- Đã kiểm tra 160/160 link, tên, vị trí ghi và tính duy nhất. Ba native table giữ nguyên ID, màu, dropdown và cấu trúc cột; các công thức tự điều chỉnh khi chèn dòng.
- Gửi thử backend trên Test 1 (HCM, 1 người) và Test 2 (Vinh, 2 người) đã lưu và xác minh đúng mã biên nhận. Dữ liệu thử được khôi phục về mặc định trong finally sau mỗi lượt.
- Frontend bắt đầu kiểm tra biên nhận song song với POST, thay vì đợi toàn bộ phản hồi opaque rồi mới kiểm tra. Chỉ xác nhận khi biên nhận, Có/Không, địa điểm và số người khớp; mỗi lượt vẫn chỉ gửi một POST.
- Tâm xoay icon lấy theo tâm khung phần hình có alpha thực, gồm nhánh lá, chữ Amsterdam EN/VN, tim, phong thư và tia sáng. Offset được tính lại để giữ vị trí nghỉ cũ; SVG dùng tâm phần nét vẽ.
- `Code.gs` trong repo và editor có thêm `readGuestHeader_` để hỗ trợ các dòng ghi chú, nhưng bản code đó **chưa được triển khai** vì chưa hoàn tất cấp quyền Google. Bản sửa tương thích bằng dòng ẩn đã khôi phục luồng lưu đang chạy mà không cấp quyền OAuth mới.

## Cột lựa chọn tiệc trên Guest List (02/11/2026)

- Trong Guest List, **H** và **T** có nhãn chính xác `tiệc tham dự (khách chọn)`; dữ liệu là công thức tham chiếu từ `RSVP Online!Y` (chỉ hiện Vinh/HCM sau RSVP **Có**). Cột link giờ là **I/U**, số người **G/S**, RSVP **F/R**.
- Hai cột được **chèn**, không ghi đè link hoặc dữ liệu cũ. Công thức link và công thức của tab registry tự điều chỉnh theo Google Sheets. Mã `Code.gs` dò vị trí theo nhãn cột, không theo chỉ số cố định của Guest List.
- Từng lời mời dùng chung slug hiển thị cùng kết quả. Không cộng số người bằng cách đếm tất cả dòng này mà không loại trùng mã thiệp.


## Lưu địa điểm Vinh/HCM trong RSVP (02/11/2026)

- Tab ẩn `RSVP Online` được bổ sung cột **Y** (`Tiệc xác nhận (Vinh/HCM)`), có danh sách chọn `Vinh` và `HCM`. Không thay đổi các cột H–L chứa dữ liệu RSVP gốc.
- `Code.gs` nhận `venue=Vinh|HCM` khi RSVP **Có**, xác thực lựa chọn và ghi vào Y; khi **Không** thì để Y trống. `doGet` trả `venue` cùng các trạng thái `responded`, `partySize`, `venueSupported` để website cho chỉnh sửa được lựa chọn cũ.
- Cả nhóm `Đám cưới` và `Dạm ngõ + Đám hỏi` đều có thể RSVP. Website hiển thị tệp lịch đúng theo lựa chọn: Vinh dùng `assets/linh-thang-wedding-vinh.ics`, HCM dùng `assets/linh-thang-wedding.ics`. Cần redeploy `Code.gs` để bật backend mới; giao diện tạm khóa gửi cho đến khi API trả `venueSupported:true`.
- **Triển khai:** Master Wedding Planner → Extensions → Apps Script → thay toàn bộ `Code.gs` bằng bản trong repo → Save → Deploy → Manage deployments → Edit → New version → Deploy. Giữ URL `/exec`; không chạy `activateWeddingInvitations`.
- **Không gửi RSVP thử bằng dữ liệu thật** khi chưa chuẩn bị hoàn nguyên phản hồi. Những link chung mã thiệp cần được kiểm thử riêng và có thể đang không gửi được do kiểm tra trùng link trong `locateGuest_`.


## Link mời có tên để hiển thị ngay (02/11/2026)

- **Cấu hình mới nhất:** các cột `Guest List!I` và `Guest List!U` tạo link `?i=<slug>&to=<ENCODEURL(tên từ RSVP Online!B)>`. Backend vẫn chỉ tin cậy mã `i`; `to` được dùng để vẽ tên trước khi request xác minh hoàn tất.
- **Đã kiểm tra trên Google Sheets:** 157 ô công thức, 156 link có hiệu lực; 156/156 tên giải mã và slug khớp registry. Không thêm tham số theo dõi. Bốn nhóm dòng đang dùng chung một mã thiệp được giữ nguyên.
- **Không cần deploy lại Apps Script** chỉ để hỗ trợ `to`: regex đang chấp nhận link có tham số này. Khi cập nhật tên, link trong Sheet tự đổi; link cũ có thể hiển thị tên cũ ban đầu cho đến khi backend gửi lại tên hiện tại.
- **Cần kiểm thử riêng trước khi gửi hàng loạt:** hàm `locateGuest_` hiện từ chối slug xuất hiện nhiều lần trong Guest List. Các nhóm dùng chung một mã đã tồn tại trước thay đổi; chưa có xác nhận end-to-end về hành vi RSVP của những nhóm này.
- **Bảo mật:** tên đầy đủ nằm trong URL khi khách nhận link, dù browser sẽ loại `to` khỏi address bar sau khi đọc. Không coi mã slug là xác thực danh tính mạnh.



## Tăng tốc hiển thị tên khách lần đầu (02/11/2026)

- **Nguyên nhân:** lần đầu mở link `?i=<slug>`, website phải đợi phản hồi Google Apps Script; backend trước đây còn tra ngược về `Guest List` dù cột B của tab ẩn `RSVP Online` đã chứa tên hiển thị chính xác bằng công thức liên kết trực tiếp.
- **Thay đổi trong `Code.gs`:** với `action=guest`, sau khi xác minh slug duy nhất ở cột Q (hoặc alias hợp lệ ở LIVE), dùng trực tiếp cột B và cột D cùng dòng registry để trả tên và sự kiện. Không thực hiện tra cứu Guest List lần thứ hai. Luồng **ghi/sửa RSVP vẫn đối chiếu dòng Guest List**, giữ nguyên cơ chế bảo vệ dữ liệu và hạn 10/02/2027.
- **Bắt buộc redeploy backend:** Master File → Extensions → Apps Script → thay toàn bộ `Code.gs` bằng [bản hiện tại](./Code.gs) → Save → Deploy → Manage deployments → Edit → New version → Deploy, giữ nguyên Web App URL. Không chạy `activateWeddingInvitations`.
- Không đưa danh sách khách ra GitHub hoặc thêm tên vào URL. Lần truy cập đầu vẫn cần một request tới Apps Script và có thể gặp cold start; thời gian phản hồi không được bảo đảm.



## Cập nhật RSVP và tải lịch (.ics) – 02/11/2026

**Thời hạn mới (áp dụng cho gửi và chỉnh sửa):** Thứ Tư, 10/02/2027, 23:59 (giờ Việt Nam), tương đương 17:59 (CET). Đây là mốc backend phải kiểm tra. Để kích hoạt mốc này, copy `Code.gs` mới từ GitHub vào Apps Script và **Deploy → Manage deployments → Edit → New version → Deploy**; giữ nguyên URL `/exec`.

- Sau khi khách phản hồi, website xác nhận trạng thái, đồng thời hiển thị **Add to my calendar** nếu khách đã chọn Có. File `assets/linh-thang-wedding.ics` chứa lịch ngày 28/02/2027 bắt đầu 11:00 (giờ Việt Nam), thời điểm kết thúc 14:00 là **ước lượng**.
- Website có nút **Update my RSVP** để mở lại form, giữ lựa chọn Có/Không và số người cũ; có thể đổi lựa chọn, số người và gửi lại tới 23:59:59 ngày 10/02/2027 (giờ Việt Nam).
- Backend `Code.gs` phải được **copy và redeploy vào Web App hiện tại** thì nút sửa mới xuất hiện; API trả `canEdit` cho link hợp lệ và ghi đè câu trả lời cũ với biên nhận mới. Lời chúc cũ được giữ khi khách không nhập lời chúc mới.
- Khi redeploy, giữ URL `/exec` hiện tại, không tạo deployment mới, không chạy `activateWeddingInvitations`. Test bằng một khách thử và kiểm tra ở cả Guest List lẫn RSVP Online trước khi gửi thiệp chính thức.
- Nút **Add to my calendar** không yêu cầu thay đổi Apps Script; nó chỉ phụ thuộc vào trạng thái đã xác nhận Có.


## Tối ưu tên khách qua Google Apps Script (PREP, 02/11/2026)

- Không dùng Cloudflare, không đưa Guest List hoặc mã thiệp gốc lên GitHub.
- `getInvitationPhase_` đọc V2:W2 trong một lần, còn `findInvite_` vẫn xác minh **link PREP mới nhất** hoặc link lịch sử hợp lệ **sau LIVE**. Không lấy tính hợp lệ của link từ cache.
- `locateGuestForDisplay_` đọc trực tiếp dòng nguồn P của RSVP Online (sau khi kiểm tra slug hiện tại và link Guest List) thay vì quét mọi link ở lần tải đầu. Nếu dòng nguồn không khớp, hệ thống quay về `locateGuest_` để tra cứu nghiêm ngặt.
- Tên và vị trí đã xác minh được giữ tối đa **300 giây** trong `CacheService.getScriptCache()`. Tên được xóa khỏi cache khi sửa tên bằng thao tác thủ công trên Guest List. Trạng thái RSVP, quyền gửi và deadline luôn đọc dữ liệu thật, **không cache**. Bản mới cho phép khách đã phản hồi chỉnh sửa cho đến hết 10/02/2027 (giờ Việt Nam), nếu link cá nhân và Event còn hợp lệ.
- Website tiếp tục gửi yêu cầu lấy tên ngay trong `<head>`, và các lần truy cập lại cùng trình duyệt có thể sử dụng cache đã xác minh trên thiết bị.
- Google có thể xóa cache sớm; lần đầu hoặc khi cache hết hạn vẫn phải truy vấn Sheets. Không bảo đảm hiển thị tức thì trên thiết bị mới.

**Cần deploy backend để áp dụng:** Master File → Extensions → Apps Script → thay **toàn bộ** file `Code.gs` bằng bản mới từ thư mục `apps-script` trên GitHub (không xóa các file .gs khác) → Save → Run `verifyWeddingBackend` (chỉ đọc) → Deploy → Manage deployments → Edit → New version → Deploy. Giữ nguyên URL Web App /exec. Không chạy `activateWeddingInvitations`; đang PREP và chỉ người dùng quyết định launch.


Đuôi link hiện dùng **tên không dấu**, ví dụ `?i=chi-thu-tam-kp`, thay cho mã 16 ký tự ngẫu nhiên. 162 link khách hiện có đuôi duy nhất (15 link mới được tạo sau khi Guest List bổ sung khách). Mã 30 ký tự vẫn là định danh nội bộ. Khi **PREP**, Web App chỉ nhận slug hiện tại; khi **LIVE**, các slug cũ ghi nhận từ thời điểm launch mới được chấp nhận.

## Cập nhật deployment (bắt buộc sau lần thay đổi này)
1. Trong Master File Google Sheets, chọn **Extensions → Apps Script**.
2. Thay toàn bộ nội dung **Code.gs** hiện có bằng [Code.gs phiên bản mới nhất](./Code.gs) và bấm **Save**.
3. **Deploy → Manage deployments → Edit** (bút chì của deployment Web App đang chạy).
4. **Version → New version → Deploy**. Giữ deployment cũ để URL `/exec` không đổi.
5. Kiểm tra **Execute as: Me** và **Who has access: Anyone**.

**Cần redeploy để bật hai chế độ.** Ở PREP chỉ link hiện tại hợp lệ; sau launch, link cũ phát sinh từ lúc LIVE và link mới cùng ánh xạ về một khách. Không gửi thiệp cho khách khi chưa kiểm thử.

## Bố cục Guest List hiện tại

| Bảng | Tên hiển thị | RSVP | Số người tham dự | Link |
|---|---|---|---|---|
| Bảng hồng, bên trái | B | F | G | H |
| Bảng bên phải | K | Q | R | S |

Các cột có thể dịch chuyển khi sửa bảng. Code.gs tìm tên cột dựa vào hai tiêu đề `Tên khách mời`, `Link`, `Event` và `RSVP` ở hàng 1.

- Tên khách **trên thiệp** được tra cứu từ cột Tên khách mời trong đúng bảng gốc; sửa cách xưng hô ở đây thì **cả tên trên thiệp và đuôi đường link tự đổi**, nhưng URL cũ được lưu và vẫn dùng được.
- Bộ nhận RSVP tra slug hiện tại hoặc lịch sử để tìm mã khách ổn định trong tab kỹ thuật **RSVP Online** rồi dò lại đúng dòng có link hiện tại.
- Tab kỹ thuật ẩn có đuôi dễ đọc tại cột Q, mã gốc cột A, lời nhắn và biên nhận. Không xóa.
- Trạng thái Có/Không ghi về cột RSVP ngay trên đúng dòng khách trong Guest List. **Số người tham dự** tự lấy từ tab ẩn: Có = số người đã xác nhận (1–10), Không = 0, chưa phản hồi = ô trống.

## Kiểm thử
1. Sao chép một link ở cột H hoặc S, mở bằng cửa sổ ẩn danh. Tên có dấu phải hiện dưới dòng `TRÂN TRỌNG KÍNH MỜI`.
2. Gửi thử RSVP bằng một khách thử, nhập số người (ví dụ 2), kiểm tra trạng thái ở cột F/R, **số người ở G/S**, và **tiệc tham dự (khách chọn) ở H/T** đúng như đã nhập.
3. Xác minh cột H–L của tab ẩn RSVP Online có phản hồi, tổng số người, lời nhắn và biên nhận; sau kiểm thử, hoàn nguyên dữ liệu thử.
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


## Ghi chú khi chèn dòng khách mới

Các công thức B/X trong tab kỹ thuật được cập nhật để theo tên/ghi chú của đúng người sau khi chèn dòng. Nếu thêm **khách mới hoàn toàn** vào Guest List, cần tạo cho khách một mã thiệp nội bộ mới và link mới, không sao chép link của khách phía trên. 15 khách mới đã được bổ sung ở lần rà soát 29/10/2026; 162 người hiện có link riêng. Các bản ghi ứng với khách đã xóa được giữ ẩn, không cấp lại mã cho khách khác.

## Xác nhận số người tham dự (29/10/2026)

- Trên website v33, chọn **Có** sẽ hiển thị trường **Số người tham dự (bao gồm bạn)**, cần nhập số nguyên 1–10. Khi chọn **Không**, form không yêu cầu nhập số và bộ nhận ghi 0.
- Sau khi Google Sheets xác nhận lưu thành công qua mã biên nhận, website sẽ hiển thị thông báo kèm số người đã ghi nhận.
- Không thêm bảng thứ ba; trong Guest List, sau RSVP **F/R** là số người **G/S**, cột `tiệc tham dự (khách chọn)` **H/T**, tiếp theo là link **I/U**. Đây là cấu trúc hiện hành kể từ 02/11/2026.
- Số người ở Guest List đọc trực tiếp tab ẩn RSVP Online (cột I) theo **đuôi link hiện tại**, không bị lẫn khi thay đổi tên. Giá trị 0 là Không tham dự; ô trống là Chưa phản hồi.
- Vì các cột của bảng bên phải đã dịch chuyển, **Code.gs cũng đã đổi onEdit sang nhận dạng vị trí cột Tên khách mời theo tiêu đề**, cần Save và **Deploy → Manage deployments → Edit → New version → Deploy** để bật đúng quy trình lưu link sau launch. Website tự xuất bản khi GitHub Pages cập nhật, không cần deploy riêng.

## Khi website báo "We couldn't load your invitation" (29/10/2026)

Lỗi này có thể xảy ra khi Web App vẫn chạy một bản Code.gs cũ hoặc chưa được cấp quyền đọc Master Sheet. Cập nhật GitHub **không tự deploy Apps Script**.

1. Mở Master File → **Extensions → Apps Script**, thay toàn bộ `Code.gs` bằng [bản hiện hành](./Code.gs), **Save**.
2. Chọn hàm **`verifyWeddingBackend`** trong dropdown → **Run**. Cấp quyền Google nếu được hỏi. **Execution log** phải báo `Wedding guest lookup OK | <tên khách> | Mode: PREP`. Hàm này chỉ đọc dữ liệu, không sửa Sheet hay gửi RSVP.
3. Chọn **Deploy → Manage deployments →** biểu tượng bút chì tại Web App hiện có → **Version: New version**. Kiểm tra **Execute as: Me** và **Who has access: Anyone**, sau đó bấm **Deploy**. **Đừng tạo New deployment**, để URL `/exec` trong website không đổi.
4. Mở thử URL chẩn đoán (chỉ trả tên của khách mẫu đã có trong sheet): `https://script.google.com/macros/s/AKfycbwDA6HVjo0JZUM0dCiPjVwNB2Whzjgsr4IiuTxulmd2LDijhpfQ3SR_c34VVJ6mXHNRxQ/exec?action=guest&invite=chi-thu-tam-kp&callback=checkWedding`. Kết quả đúng có dạng `checkWedding({"valid":true,"name":"Chị Thu Tâm","canRsvp":true});`.
5. Mở lại link thiệp của khách. Nếu hàm test đã OK nhưng URL chẩn đoán vẫn lỗi, kiểm tra **Executions** ở Apps Script và quyền Web App. **Không chạy `activateWeddingInvitations` trong giai đoạn PREP**.


## Tăng tốc tải tên khách (v42)

- `Code.gs`: trong **PREP**, khi website đọc tên thì không lấy document lock/đồng bộ alias; dùng `TextFinder` với khớp chính xác trên cột Q của registry và cột Link trên Guest List, vẫn kiểm tra trùng link để không hiển thị nhầm khách.
- Trong **LIVE**, bộ đọc vẫn giữ cơ chế đồng bộ lịch sử alias kể từ launch và bảo đảm các link cũ/mới ánh xạ về cùng mã khách.
- `script.js`: tên khách đã xác minh được lưu **trong sessionStorage của tab hiện tại** tối đa 15 phút. Khi mở lại thiệp cùng link trong tab, tên hiện sớm, nhưng nút RSVP chỉ bật sau khi backend xác minh lần nữa. Link không hợp lệ sẽ xóa cache.
- `index.html`: thêm `preconnect` tới Google Apps Script và đổi cache version `script.js?v=42`.
- **Bắt buộc triển khai lại backend để nhận tối ưu PREP:** vào Master File → Extensions → Apps Script; thay `Code.gs` bằng bản mới từ GitHub, **Save**; chọn hàm `verifyWeddingBackend` → Run kiểm tra; sau đó **Deploy → Manage deployments → Edit → New version → Deploy**. Không tạo deployment mới, không chạy `activateWeddingInvitations`.
- Cold start của Google Apps Script vẫn có thể chậm trong lần truy cập đầu. Không publish dữ liệu Guest List lên GitHub và không thêm tên khách vào URL để tối ưu tốc độ.

## Trở lại link gọn (29/10/2026)

- **Lịch sử 29/10 (đã thay thế từ 02/11):** link gửi khách ở `Guest List!H/S` từng chỉ có `?i=<slug>`. Cấu hình hiện nay có thêm `&to=` để hiển thị tên ngay; vẫn không có `utm_source=chatgpt.com` hay `#story`.
- Tên khách sẽ được truy vấn từ backend, nên lần mở đầu tiên có thể phải chờ Apps Script; trong cùng tab, tên đã xác minh có thể hiện sớm từ cache 15 phút.
- Backend vẫn chấp nhận link cũ từng có `&to=` (để tương thích), nhưng **không dùng tham số này làm căn cứ RSVP**. Nếu Code.gs trên Web App vẫn là bản trước v43, link sạch cũng có thể hoạt động: nó dùng mã `i` trong liên kết.
- Cần giữ PREP cho tới khi người dùng yêu cầu launch batch đầu tiên. Khi LIVE, những link đã gửi từ sau thời điểm launch được lưu lịch sử.
# Nút tim ẩn danh cho ba ảnh polaroid — 04/11/2026

**Bản đang triển khai:** Web App Version 18 (04/11/2026), hỗ trợ tim nhiều lần. Dự án Google còn có file `PhotoHearts.gs` từ lần chuẩn bị trước. Trong Version 17, hàm `photoHeartSnapshot_` trong file cũ đã được đổi thành `legacyPhotoHeartSnapshot_` cùng hai chỗ gọi của nó để tránh ghi đè hàm cùng tên trong `Code.gs`. Khi đồng bộ dự án hiện có, cần giữ bản `PhotoHearts.gs` đã sửa này. Kiểm thử hồi quy nạp cả hai file trong cùng môi trường để phát hiện lỗi trùng hàm.

Mã trong `Code.gs` bổ sung bộ đếm chung cho Keukenhof, Rotterdam và Zaandam. API chỉ nhận mã ngẫu nhiên của trình duyệt; không nhận hoặc trả tên, email hay mã thiệp của khách. Mỗi người có thể thả tim nhiều lần: mỗi lần bấm cộng ngay một lượt và có một tim màu be bay lên từ ảnh đó. Các khách đang xem ảnh được cập nhật tổng lượt tim khoảng mỗi 15 giây.

API v2 nhận tổng lũy kế `taps` cho từng ảnh và từng trình duyệt, luôn lưu giá trị lớn nhất. Gửi lại sau khi mất phản hồi hoặc yêu cầu đến sai thứ tự không cộng trùng và không xóa lượt mới. Các giá trị boolean của bản cũ được đọc như một tim; giao diện cũ còn trong cache không thể xóa tim đã chuyển sang số lũy kế. Tổng đang chờ lưu được giữ trong bộ nhớ trình duyệt và gửi lại khi kết nối trở lại, kể cả sau khi tải lại trang. Web Locks phối hợp bấm tim ở nhiều tab cùng trình duyệt.

Lượt tim được lưu trong Script Properties, tách khỏi Guest List và RSVP Online, không cần thêm quyền đọc dữ liệu Google. Xóa dữ liệu trình duyệt hoặc dùng trình duyệt khác sẽ tạo một mã ẩn danh mới.

**Bước cần làm trong Google:**

1. Mở Master Wedding Planner → **Extensions → Apps Script**.
2. Trong dự án đang phục vụ URL Web App hiện tại, thay nội dung **file `Code.gs` hiện có** bằng toàn bộ `Code.gs` ở cùng nhánh này. Giữ nguyên các file `.gs` khác. Bấm **Save** và chờ lưu xong.
3. Chọn **Deploy → Manage deployments → Edit** (biểu tượng bút chì ở Web App đang dùng).
4. **Version → New version → Deploy**. Giữ nguyên URL `/exec` và thiết lập quyền truy cập của deployment hiện có; không tạo deployment mới.
5. Báo đã Deploy để kiểm tra API `action=photo-hearts` trước khi xuất bản giao diện.

**Không chạy `activateWeddingInvitations`** trong bước này. Không cần chạy hàm đếm tim thủ công; yêu cầu đầu tiên sẽ khởi tạo dữ liệu. Nếu Google hiện màn hình cấp quyền hoặc cảnh báo, gửi ảnh màn hình trước khi chấp nhận quyền chưa rõ.

Kiểm thử: `node tests/photo-hearts.test.cjs` và `node tests/photo-hearts-ui.test.cjs` ở thư mục gốc repository. Kiểm thử gồm ba ảnh, bấm liên tục, chuyển dữ liệu cũ, yêu cầu lặp/đến muộn, mất phản hồi, lưu lại khi mở trang, hai tab đồng thời, dọn hiệu ứng tim, đầu vào sai, callback JSONP và cách ly dữ liệu riêng tư.

