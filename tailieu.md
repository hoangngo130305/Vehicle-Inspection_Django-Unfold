# TÀI LIỆU CHỨC NĂNG HỆ THỐNG ĐĂNG KIỂM XE

## TỔNG QUAN

**3 phân quyền:**

| Phân quyền     | Cách đăng nhập                  | Ai tạo tài khoản |
| -------------- | ------------------------------- | ---------------- |
| **Khách hàng** | OTP / Google / Facebook / Apple | Tự đăng ký       |
| **Nhân viên**  | Username + Password             | Admin cấp        |
| **Admin**      | Username + Password             | Super Admin cấp  |

---

## PHẦN 1: CHỨC NĂNG KHÁCH HÀNG

### 1.1. Đăng ký & Đăng nhập

**4 phương thức đăng nhập:**

**Cách 1: OTP**

1. Nhập số điện thoại
2. Nhận mã OTP
   - 6 số
   - Hiệu lực 5 phút
3. Nhập OTP
   → Đăng nhập thành công
4. Lần đầu: Hoàn thiện hồ sơ
   - Họ tên
   - Email
   - Ngày sinh

**Cách 2: Google**

1. Chọn tài khoản Google
2. Xác thực
   → Đăng nhập thành công
3. Lần đầu: Hoàn thiện hồ sơ
   - Họ tên
   - Email
   - Ngày sinh

**Cách 3: Facebook**

1. Xác thực Facebook
   → Đăng nhập thành công
2. Lần đầu: Hoàn thiện hồ sơ
   - Họ tên
   - Email
   - Ngày sinh

**Cách 4: Apple**

1. Xác thực Apple ID (Face/Touch ID)
   → Đăng nhập thành công
2. Lần đầu: Hoàn thiện hồ sơ
   - Họ tên
   - Email
   - Ngày sinh

---

### 1.2. Quản lý xe

**Thêm xe mới:**

1. Nhập biển số xe
2. Chọn loại xe:
   - Xe máy
   - Ô tô
   - Xe tải
   - Xe khách
3. Nhập hãng xe
4. Nhập dòng xe
5. Nhập màu sắc
6. Nhập năm sản xuất
7. Nhập ngày đăng kiểm gần nhất (tùy chọn)
8. Chụp ảnh xe (tùy chọn)
9. Nhấn Lưu
   → Xe xuất hiện trong danh sách

**Sửa xe:**

1. Chọn xe cần sửa
2. Sửa thông tin
3. Nhấn Lưu
   → Cập nhật thành công

**Xóa xe:**

1. Chọn xe cần xóa
2. Nhấn Xóa
3. Xác nhận
   → Xe biến khỏi danh sách

**Xem danh sách xe:**

- Hiển thị thông tin:
  - Biển số
  - Loại xe
  - Hãng
  - Màu sắc
  - Năm sản xuất
  - Hạn kiểm định
- Cảnh báo nếu sắp hết hạn (< 30 ngày)

---

### 1.3. Đặt lịch đăng kiểm

**Quy trình đặt lịch:**

**Bước 1: Chọn xe**

1. Xem danh sách xe của mình
2. Chọn 1 xe cần đăng kiểm

**Bước 2: Chọn trạm**

1. Xem danh sách trạm gần nhất (theo GPS)
2. Xem thông tin từng trạm:
   - Địa chỉ
   - Số điện thoại
   - Khoảng cách
   - Đánh giá
3. Chọn 1 trạm

**Bước 3: Chọn ngày & giờ hẹn**

1. Chọn ngày hẹn
2. Chọn giờ hẹn:
   - 08:00 - 17:00
   - Trừ 12:00 - 13:00 (giờ nghỉ trưa)

**Bước 4: Nhập ghi chú** (tùy chọn)

1. Nhập ghi chú đặc biệt

**Bước 5: Xem giá ước tính**

- Xem chi tiết chi phí:
  - Phí kiểm định
  - Phí hồ sơ
  - Phí tem đăng kiểm
  - **Tổng cộng**

**Bước 6: Xác nhận**

1. Nhấn Xác nhận
   → Nhận mã đơn hàng
   → Đơn lưu vào hệ thống với trạng thái "Chờ xử lý"

---

### 1.4. Theo dõi đơn hàng

**Xem danh sách đơn:**

1. Lọc theo trạng thái:
   - Đang chờ
   - Đang thực hiện
   - Hoàn thành
   - Đã hủy

**Xem chi tiết đơn:**

- Thông tin cơ bản:
  - Mã đơn
  - Trạng thái hiện tại
  - Thông tin xe
  - Thông tin trạm
  - Ngày giờ hẹn
  - Ghi chú

- Khi có nhân viên nhận đơn:
  - Ảnh nhân viên
  - Tên nhân viên
  - Mã nhân viên
  - Số điện thoại nhân viên
  - Biển số xe máy của nhân viên
  - Đánh giá nhân viên

- Lịch sử trạng thái real-time:
  1. Đã đặt lịch
  2. Đã phân công nhân viên
  3. Nhân viên đang đến
  4. Đang kiểm tra xe
  5. Hoàn thành kiểm tra

- Tiến độ checklist:
  - Xem danh sách hạng mục
  - Xem hạng mục đã hoàn thành
  - Xem kết quả từng hạng mục

- Hình ảnh:
  - Ảnh xe trước kiểm tra (4 góc)
  - Ảnh xe sau kiểm tra (4 góc)

**Xem vị trí nhân viên trên bản đồ:**

1. Mở bản đồ
2. Xem vị trí nhân viên real-time
3. Xem khoảng cách còn lại
4. Xem thời gian dự kiến đến

---

### 1.5. Chat với nhân viên

**Chức năng chat:**

1. Mở chat với nhân viên được giao đơn (chat 1-1)
2. Gửi tin nhắn văn bản
3. Gửi ảnh
4. Xem lịch sử chat
5. Nhận thông báo khi có tin nhắn mới

---

### 1.6. Hủy đơn hàng

**Điều kiện hủy:**

- Chỉ hủy được khi trạng thái:
  - "Chờ xử lý", hoặc
  - "Đã phân công"

**Quy trình hủy:**

1. Chọn đơn cần hủy
2. Chọn lý do hủy:
   - Đổi lịch khác
   - Không có thời gian
   - Tìm được chỗ rẻ hơn
   - Lý do khác
3. Xác nhận
   → Đơn chuyển sang "Đã hủy"
   → Nhân viên (nếu đã phân công) nhận thông báo

---

### 1.7. Thanh toán

**Xem chi tiết chi phí:**

- Bảng chi phí:
  - Phí kiểm định
  - Phí hồ sơ
  - Phí tem đăng kiểm
  - Phí phát sinh (nếu có)
  - **Tổng cộng**

**Chọn phương thức thanh toán:**

1. Chuyển khoản ngân hàng (VietQR):
   - Quét mã QR
   - Chuyển khoản
     → Hệ thống tự động xác nhận

2. Ví điện tử:
   - Momo
   - ZaloPay
   - VNPay

3. Tiền mặt tại trạm

**Sau thanh toán:**
→ Nhận thông báo "Thanh toán thành công"
→ Xem hóa đơn
→ Tải hóa đơn PDF

---

### 1.8. Đánh giá dịch vụ

**Quy trình đánh giá:**

1. Chấm sao tổng thể (1-5 sao)
2. Chấm sao riêng cho nhân viên (1-5 sao)
3. Viết nhận xét
4. Đính kèm ảnh (tùy chọn)
5. Nhấn Gửi đánh giá
   → Đánh giá lưu vào hệ thống
   → Điểm trung bình nhân viên được cập nhật

---

### 1.9. Thông báo

**Nhận thông báo khi:**

- Đặt lịch thành công
- Đơn được phân công nhân viên
- Nhân viên đang đến
- Nhân viên đã đến trạm
- Bắt đầu kiểm tra
- Hoàn thành kiểm tra
- Yêu cầu thanh toán
- Thanh toán thành công
- Có tin nhắn mới
- Sắp đến hạn kiểm định (nhắc trước 30 ngày)

---

### 1.10. Quản lý tài khoản

**Xem thông tin:**

- Thông tin cá nhân:
  - Họ tên
  - Số điện thoại
  - Email
  - Ngày sinh
  - Địa chỉ
- Thống kê:
  - Tổng đơn hàng
  - Tổng chi tiêu

**Sửa hồ sơ:**

1. Chọn Sửa hồ sơ
2. Sửa thông tin:
   - Họ tên
   - Email
   - Ảnh đại diện
   - Ngày sinh
   - Địa chỉ
3. Lưu
   → Cập nhật thành công

**Đổi số điện thoại:**

1. Nhập số điện thoại mới
2. Nhận OTP
3. Nhập OTP
   → Đổi thành công

**Đổi mật khẩu:**

1. Nhập mật khẩu cũ
2. Nhập mật khẩu mới
3. Nhập lại mật khẩu mới
4. Xác nhận
   → Đổi thành công

**Cài đặt thông báo:**

- Bật/tắt thông báo
- Bật/tắt âm thanh
- Bật/tắt rung

**Trợ giúp:**

- Liên hệ hỗ trợ (hotline, email)
- Xem câu hỏi thường gặp

**Chọn ngôn ngữ:**

- Tiếng Việt
- English

**Đăng xuất:**

1. Chọn Đăng xuất
2. Xác nhận
   → Thoát về màn hình đăng nhập

---

## PHẦN 2: CHỨC NĂNG NHÂN VIÊN

### 2.1. Đăng nhập

**Phương thức duy nhất:**

1. Nhập Username (do Admin cấp)
2. Nhập Password (do Admin cấp)
3. Đăng nhập

**Lưu ý:**

- Không có: Đăng ký tài khoản
- Không có: Login social
- Không có: Login OTP
- Quên mật khẩu → Liên hệ Admin để reset

---

### 2.2. Xem công việc được giao

**Xem danh sách đơn:**

1. Xem đơn Admin đã phân công
2. Lọc theo trạng thái:
   - Chờ làm
   - Đang làm
   - Hoàn thành

**Xem chi tiết đơn:**

- Mã đơn
- Tên khách hàng
- Số điện thoại khách hàng
- Thông tin xe:
  - Biển số
  - Loại xe
  - Hãng
  - Màu
- Trạm làm việc
- Giờ hẹn
- Ghi chú của khách

---

### 2.3. Bắt đầu công việc

**Quy trình bắt đầu:**

1. Chọn đơn "Chờ làm"
2. Gọi điện cho khách hàng
3. Xác nhận:
   - Đã liên hệ khách
   - Đã đến trạm
   - Đã nhận xe
4. Nhấn "Bắt đầu"
   → Đơn chuyển sang "Đang thực hiện"
   → Khách nhận thông báo

---

### 2.4. Lập biên bản nhận xe

**Quy trình lập biên bản:**

1. Chụp ảnh xe 4 góc:
   - Góc trước
   - Góc sau
   - Góc trái
   - Góc phải

2. Kiểm tra giấy tờ:
   - Số khung có khớp giấy tờ?
     - Có
     - Không
   - Số máy có khớp giấy tờ?
     - Có
     - Không
   - Xe có độ chế?
     - Có (ghi chú chi tiết)
     - Không

3. Ghi chú tình trạng xe:
   - Trầy xước
   - Móp méo
   - Vết nứt
   - Khác...

4. Khách ký xác nhận (chữ ký điện tử)

5. Lưu biên bản
   → Biên bản được lưu vào hệ thống

---

### 2.5. Thực hiện checklist kiểm tra

**3 nhóm kiểm tra:**

**A. An toàn:**

1. Kiểm tra phanh trước
   - Chọn: Đạt / Không đạt
   - Nếu không đạt: Nhập ghi chú, chụp ảnh

2. Kiểm tra phanh sau
   - Chọn: Đạt / Không đạt
   - Nếu không đạt: Nhập ghi chú, chụp ảnh

3. Kiểm tra hệ thống lái
   - Chọn: Đạt / Không đạt
   - Nếu không đạt: Nhập ghi chú, chụp ảnh

4. Kiểm tra hệ thống treo
   - Chọn: Đạt / Không đạt
   - Nếu không đạt: Nhập ghi chú, chụp ảnh

5. Kiểm tra lốp xe
   - Chọn: Đạt / Không đạt
   - Nếu không đạt: Nhập ghi chú, chụp ảnh

6. Kiểm tra đèn chiếu sáng
   - Chọn: Đạt / Không đạt
   - Nếu không đạt: Nhập ghi chú, chụp ảnh

7. Kiểm tra còi
   - Chọn: Đạt / Không đạt
   - Nếu không đạt: Nhập ghi chú, chụp ảnh

8. Kiểm tra gương chiếu hậu
   - Chọn: Đạt / Không đạt
   - Nếu không đạt: Nhập ghi chú, chụp ảnh

**B. Khí thải:**

1. Đo nồng độ CO:
   - Nhập giá trị đo (%)
     → Hệ thống tự động so sánh với giới hạn
     → Kết quả: Đạt / Không đạt

2. Đo nồng độ HC:
   - Nhập giá trị đo (ppm)
     → Hệ thống tự động so sánh với giới hạn
     → Kết quả: Đạt / Không đạt

3. Đo nồng độ CO2:
   - Nhập giá trị đo (%)
     → Hệ thống tự động so sánh với giới hạn
     → Kết quả: Đạt / Không đạt

4. Đo độ mờ khói:
   - Nhập giá trị đo (%)
     → Hệ thống tự động so sánh với giới hạn
     → Kết quả: Đạt / Không đạt

5. Đo tiếng ồn:
   - Nhập giá trị đo (dB)
     → Hệ thống tự động so sánh với giới hạn
     → Kết quả: Đạt / Không đạt

**C. Giấy tờ:**

1. Kiểm tra số khung
   - Chọn: Đạt / Không đạt

2. Kiểm tra số máy
   - Chọn: Đạt / Không đạt

3. Kiểm tra biển số xe
   - Chọn: Đạt / Không đạt

**Lưu ý:**

- Sau mỗi hạng mục: Nhấn Lưu
- Khách xem tiến độ real-time

---

### 2.6. Lập biên bản trả xe

**Quy trình lập biên bản:**

1. Chụp ảnh xe sau kiểm tra (4 góc):
   - Góc trước
   - Góc sau
   - Góc trái
   - Góc phải

2. Upload tem đăng kiểm mới (nếu đạt)

3. Upload biên lai phí (nếu có)

4. Chọn kết quả cuối cùng:
   - Đạt kiểm định
   - Không đạt kiểm định

5. Nhập chi phí phát sinh (nếu có):
   - Loại chi phí
   - Số tiền
   - Ghi chú

6. Ghi chú cuối cùng (khuyến nghị cho khách)

7. Khách ký xác nhận (chữ ký điện tử)

8. Nhấn Hoàn tất
   → Đơn chuyển "Hoàn thành"
   → Khách nhận thông báo thanh toán

---

### 2.7. Chat với khách hàng

**Chức năng chat:**

1. Mở chat với khách của đơn mình làm (chat 1-1)
2. Gửi tin nhắn văn bản
3. Gửi ảnh
4. Thông báo phát sinh vấn đề cho khách

---

### 2.8. Xem thống kê hiệu suất

**Xem thống kê:**

1. Chọn khoảng thời gian:
   - Hôm nay
   - Tuần này
   - Tháng này
   - Tùy chọn

2. Xem các chỉ số:
   - Tổng đơn
   - Đơn hoàn thành
   - Tỷ lệ hoàn thành (%)
   - Đánh giá trung bình (⭐)
   - Phân bố đánh giá:
     - 5 sao
     - 4 sao
     - 3 sao
     - 2 sao
     - 1 sao

3. Xem xếp hạng so với các nhân viên khác:
   - Theo số đơn hoàn thành
   - Theo đánh giá trung bình

---

### 2.9. Quản lý tài khoản

**Xem thông tin:**

- Mã nhân viên
- Vai trò
- Trạm làm việc
- Đánh giá trung bình
- Thống kê toàn thời gian:
  - Tổng đơn
  - Tỷ lệ hoàn thành
  - Tổng đánh giá

**Sửa hồ sơ:**

1. Chọn Sửa hồ sơ
2. Sửa thông tin:
   - Ảnh đại diện
   - Số điện thoại
   - Email
3. Lưu
   → Cập nhật thành công

**Đổi mật khẩu:**

1. Nhập mật khẩu cũ
2. Nhập mật khẩu mới
3. Nhập lại mật khẩu mới
4. Xác nhận
   → Đổi thành công

**Cài đặt thông báo:**

- Bật/tắt thông báo đơn hàng mới
- Bật/tắt thông báo chat
- Bật/tắt âm thanh

**Trợ giúp:**

- Liên hệ hỗ trợ
- Xem câu hỏi thường gặp

**Đăng xuất:**

1. Chọn Đăng xuất
2. Xác nhận
   → Thoát về màn hình đăng nhập

---

## PHẦN 3: CHỨC NĂNG ADMIN

### 3.1. Đăng nhập

**Phương thức duy nhất:**

1. Nhập Username
2. Nhập Password
3. Đăng nhập

**Lưu ý:**

- Không có: Đăng ký tài khoản
- Không có: Login social
- Tài khoản do Super Admin cấp

---

### 3.2. Dashboard

**Xem thống kê tổng quan:**

- Tổng số khách hàng
- Tổng số nhân viên
- Đơn hàng hôm nay
- Doanh thu hôm nay

**Xem biểu đồ:**

- Biểu đồ doanh thu 7 ngày gần nhất
- Biểu đồ đơn hàng theo trạng thái:
  - Chờ xử lý
  - Đã phân công
  - Đang thực hiện
  - Hoàn thành
  - Đã hủy

**Phân công nhanh:**

1. Xem đơn chờ phân công
2. Chọn đơn
3. Chọn nhân viên
4. Phân công
   → Đơn chuyển "Đã phân công"

---

### 3.3. Quản lý khách hàng

**Xem danh sách:**

1. Tìm kiếm:
   - Theo tên
   - Theo số điện thoại
   - Theo biển số xe
   - Theo email

2. Filter:
   - Theo trạng thái (Active/Locked)
   - Theo membership (Free/VIP Bạc/VIP Vàng)
   - Theo ngày đăng ký

3. Xem thông tin:
   - ID
   - Họ tên
   - Số điện thoại
   - Email
   - Số đơn hàng
   - Tổng chi tiêu
   - Đánh giá trung bình

**Chi tiết khách:**

1. Chọn khách hàng
2. Xem thông tin:
   - Thông tin cá nhân đầy đủ
   - Danh sách xe
   - Lịch sử đơn hàng
   - Đánh giá đã cho

**Sửa thông tin khách:**

1. Chọn Sửa
2. Sửa thông tin:
   - Họ tên
   - Email
   - Số điện thoại
   - Địa chỉ
3. Lưu
   → Cập nhật thành công

**Khóa/Mở khóa tài khoản:**

1. Chọn khách hàng
2. Chọn Khóa tài khoản / Mở khóa
3. Nhập lý do
4. Xác nhận
   → Tài khoản bị khóa (không đăng nhập được)
   → Hoặc mở khóa (đăng nhập lại được)

**Xóa khách:**

1. Chọn khách hàng
2. Chọn Xóa
3. Xác nhận
   → Xóa mềm (soft delete, vẫn lưu trong DB)

---

### 3.4. Quản lý nhân viên

**Xem danh sách:**

1. Tìm kiếm:
   - Theo tên
   - Theo mã nhân viên
   - Theo số điện thoại

2. Filter:
   - Theo trạm
   - Theo vai trò
   - Theo trạng thái (Active/Locked)

3. Xem thông tin:
   - Mã nhân viên
   - Họ tên
   - Vai trò
   - Trạm làm việc
   - Hiệu suất (đơn hoàn thành, đánh giá)

**Thêm nhân viên mới:**

1. Nhấn "Thêm nhân viên"
2. Nhập thông tin:
   - Mã nhân viên
   - Username
   - Password tạm (hệ thống tự sinh hoặc tự đặt)
   - Họ tên
   - Số điện thoại
   - Email
3. Chọn vai trò:
   - Admin
   - Nhân viên kiểm định
   - Kế toán
   - Lễ tân
   - Quản lý
4. Chọn trạm làm việc
5. Nhập chức vụ
6. Nhập ngày vào làm
7. Upload ảnh đại diện (tùy chọn)
8. Tick "Gửi thông tin qua SMS/Email"
9. Nhấn Lưu
   → Nhân viên được tạo trong hệ thống
   → Nhân viên nhận SMS/Email với thông tin đăng nhập

**Sửa nhân viên:**

1. Chọn nhân viên
2. Chọn Sửa
3. Sửa thông tin:
   - Vai trò
   - Trạm làm việc
   - Thông tin cá nhân
4. Lưu
   → Cập nhật thành công

**Reset mật khẩu:**

1. Chọn nhân viên
2. Chọn Reset mật khẩu
3. Chọn:
   - Tự sinh mật khẩu mới
   - Hoặc nhập mật khẩu tạm
4. Tick "Gửi qua SMS/Email"
5. Xác nhận
   → Mật khẩu được reset
   → Nhân viên nhận thông tin mới

**Khóa/Mở khóa tài khoản:**

1. Chọn nhân viên
2. Chọn Khóa tài khoản / Mở khóa
3. Nhập lý do
4. Xác nhận
   → Tài khoản bị khóa
   → Hoặc mở khóa

**Xóa nhân viên:**

1. Chọn nhân viên
2. Chọn Xóa
3. Xác nhận
   → Xóa mềm (soft delete)

---

### 3.5. Quản lý vai trò & quyền hạn

**Xem vai trò mặc định:**

- Admin (toàn quyền)
- Nhân viên kiểm định (xem & cập nhật đơn, checklist)
- Kế toán (xem thanh toán, báo cáo)
- Lễ tân (xem đơn, chat)
- Quản lý (xem tất cả, phân công)

**Thêm vai trò mới:**

1. Nhấn "Thêm vai trò"
2. Nhập thông tin:
   - Mã vai trò
   - Tên vai trò
   - Chọn màu sắc (hiển thị trong hệ thống)
   - Nhập mô tả
   - Nhập độ ưu tiên (1-100)
3. Nhấn Lưu
   → Vai trò được tạo

**Gán quyền cho vai trò:**

1. Chọn vai trò
2. Chọn "Phân quyền"
3. Tick chọn quyền
4. Nhấn Lưu

---

### 3.6. Quản lý trạm đăng kiểm

**Xem danh sách:**

1. Tìm kiếm:
   - Theo tên trạm
   - Theo địa chỉ

2. Filter:
   - Theo trạng thái (Active/Inactive)
   - Theo công suất

3. Xem thông tin:
   - Mã trạm
   - Tên trạm
   - Địa chỉ
   - Số điện thoại
   - Số nhân viên
   - Công suất (xe/ngày)
   - Đánh giá

**Thêm trạm mới:**

1. Nhấn "Thêm trạm"
2. Nhập thông tin:
   - Mã trạm
   - Tên trạm
   - Địa chỉ đầy đủ
3. Nhập tọa độ:
   - Nhập latitude, longitude
   - Hoặc chọn vị trí trên bản đồ (kéo thả marker)
4. Nhập số điện thoại
5. Nhập email
6. Nhập công suất (xe/ngày)
7. Chọn giờ làm việc:
   - Giờ mở cửa
   - Giờ đóng cửa
   - Giờ nghỉ trưa
8. Chọn trạng thái:
   - Active (hoạt động)
   - Inactive (tạm ngừng)
9. Nhấn Lưu
   → Trạm xuất hiện trong danh sách Admin
   → Trạm xuất hiện trong dropdown khi phân công nhân viên
   → Trạm xuất hiện trong app khách hàng (nếu Active)

**Sửa trạm:**

1. Chọn trạm
2. Chọn Sửa
3. Sửa tất cả thông tin
4. Di chuyển marker trên bản đồ để cập nhật tọa độ
5. Lưu
   → Cập nhật thành công

**Tắt trạm:**

1. Chọn trạm
2. Chuyển trạng thái sang "Inactive"
3. Lưu
   → Trạm không hiển thị trong app khách hàng
   → Trạm không nhận đơn mới
   → Nhân viên vẫn thấy trong hệ thống

---

### 3.7. Quản lý loại xe

**Xem loại xe mặc định:**

- Xe máy
- Ô tô
- Xe tải
- Xe khách

**Thêm loại xe mới:**

1. Nhấn "Thêm loại xe"
2. Nhập thông tin:
   - Mã loại
   - Tên loại
3. Chọn icon:
   - Chọn emoji (🏍️, 🚗, 🚚, 🚌)
   - Hoặc upload ảnh icon
4. Nhập thứ tự hiển thị (1, 2, 3...)
5. Chọn trạng thái:
   - Active
   - Inactive
6. Nhấn Lưu
   → Loại xe hiển thị trong dropdown khi khách thêm xe
   → Loại xe hiển thị trong dropdown khi khách đặt lịch

**Sửa loại xe:**

1. Chọn loại xe
2. Chọn Sửa
3. Sửa thông tin:
   - Tên
   - Icon
   - Thứ tự
4. Lưu
   → Cập nhật thành công

**Xóa loại xe:**

1. Chọn loại xe
2. Chọn Xóa
3. Hệ thống kiểm tra:
   - Nếu có xe đang dùng loại này → Không cho xóa, hiện thông báo
   - Nếu không có xe nào → Xác nhận xóa
4. Xác nhận
   → Xóa thành công

**Sắp xếp thứ tự:**

1. Kéo thả loại xe lên/xuống
2. Hoặc nhập số thứ tự
   → Thứ tự hiển thị được cập nhật

---

### 3.8. Quản lý đơn hàng

**Xem danh sách:**

1. Tìm kiếm:
   - Theo mã đơn
   - Theo biển số
   - Theo tên khách
   - Theo số điện thoại

2. Filter:
   - Theo trạng thái (Chờ xử lý, Đã phân công, Đang thực hiện, Hoàn thành, Đã hủy)
   - Theo ngày
   - Theo trạm
   - Theo nhân viên

3. Xem thông tin:
   - Mã đơn
   - Tên khách hàng
   - Biển số xe
   - Trạm
   - Nhân viên được giao
   - Ngày hẹn
   - Trạng thái

**Xem chi tiết đơn:**

1. Chọn đơn
2. Xem thông tin đầy đủ:
   - Thông tin khách hàng
   - Thông tin xe
   - Thông tin trạm
   - Nhân viên được giao
   - Ngày giờ hẹn
   - Ghi chú
3. Xem lịch sử trạng thái (timeline)
4. Xem kết quả checklist
5. Xem hình ảnh (trước/sau kiểm tra)
6. Xem chat log
7. Xem thông tin thanh toán
8. Xem đánh giá (nếu có)

**Phân công nhân viên:**

1. Chọn đơn "Chờ xử lý"
2. Chọn "Phân công"
3. Filter nhân viên:
   - Theo trạm (chọn trạm đã chọn trong đơn)
   - Theo vai trò (Nhân viên kiểm định)
   - Theo trạng thái (Active)
4. Xem thông tin nhân viên:
   - Ảnh đại diện
   - Tên
   - Mã nhân viên
   - Đánh giá trung bình
   - Số đơn hôm nay
   - Trạng thái (Rảnh/Bận)
5. Chọn nhân viên phù hợp
6. Tick:
   - "Gửi thông báo cho nhân viên"
   - "Gửi thông báo cho khách hàng"
7. Nhấn Phân công
   → Đơn chuyển "Đã phân công"
   → Nhân viên nhận thông báo
   → Khách hàng nhận thông báo

**Sửa đơn:**

1. Chọn đơn
2. Chọn Sửa
3. Sửa được:
   - Ngày giờ hẹn
   - Trạm
   - Ghi chú
4. Không sửa được:
   - Khách hàng
   - Xe
   - Nhân viên (phải hủy phân công trước)
5. Lưu
   → Cập nhật thành công
   → Gửi thông báo cho khách & nhân viên

**Hủy đơn:**

1. Chọn đơn
2. Chọn Hủy đơn
3. Chọn lý do:
   - Khách yêu cầu hủy
   - Nhân viên không đến được
   - Trạm đóng cửa đột xuất
   - Lý do khác
4. Nhập ghi chú
5. Xác nhận
   → Đơn chuyển sang "Đã hủy"
   → Gửi thông báo cho khách
   → Gửi thông báo cho nhân viên (nếu đã phân công)

**Giám sát bản đồ (tùy chọn):**

1. Chọn "Xem bản đồ"
2. Xem vị trí real-time nhân viên đang làm việc
3. Xem lộ trình di chuyển
4. Cảnh báo nếu nhân viên:
   - Đi sai lộ trình
   - Dừng quá lâu
   - Xa điểm hẹn

---

### 3.9. Quản lý bảng giá

**Xem bảng giá:**

1. Xem giá theo loại xe:
   - Xe máy
   - Ô tô
   - Xe tải
   - Xe khách
2. Xem chi tiết từng loại:
   - Phí kiểm định
   - Phí hồ sơ
   - Phí tem đăng kiểm
   - Tổng cộng (tự động tính)
   - Ngày áp dụng
   - Trạng thái (Active/Inactive)

**Thêm/Sửa giá:**

1. Chọn loại xe
2. Nhấn "Thêm giá mới" hoặc "Sửa"
3. Nhập chi tiết:
   - Phí kiểm định
   - Phí hồ sơ
   - Phí tem
     → Tổng tự động tính
4. Chọn ngày áp dụng
5. Chọn trạng thái:
   - Active (áp dụng)
   - Inactive (không áp dụng)
6. Nhấn Lưu
   → Giá áp dụng từ ngày đã chọn
   → Khách xem giá ước tính khi đặt lịch dựa vào bảng giá Active

**Xem lịch sử giá:**

1. Chọn "Lịch sử giá"
2. Filter:
   - Theo loại xe
   - Theo khoảng thời gian
3. Xem bảng lịch sử:
   - Ngày áp dụng
   - Phí kiểm định
   - Phí hồ sơ
   - Phí tem
   - Tổng cộng
   - Người cập nhật

---

### 3.10. Quản lý thanh toán

**Xem danh sách:**

1. Tìm kiếm:
   - Theo mã đơn
   - Theo tên khách
   - Theo số điện thoại

2. Filter:
   - Theo trạng thái (Chờ thanh toán, Đã thanh toán, Thất bại)
   - Theo phương thức (VietQR, Momo, ZaloPay, VNPay, Tiền mặt)
   - Theo ngày

3. Xem thông tin:
   - Mã đơn
   - Tên khách hàng
   - Số tiền
   - Phương thức thanh toán
   - Trạng thái
   - Ngày thanh toán
   - Mã giao dịch

4. Xem tổng doanh thu theo filter hiện tại

**Xem chi tiết thanh toán:**

1. Chọn thanh toán
2. Xem thông tin:
   - Thông tin đơn hàng
   - Chi tiết chi phí:
     - Phí kiểm định
     - Phí hồ sơ
     - Phí tem
     - Phí phát sinh
     - Tổng cộng
   - Phương thức thanh toán
   - Mã giao dịch
   - Ảnh chứng từ (nếu có)
   - Thời gian thanh toán
   - Trạng thái webhook

**Xác nhận thủ công:**

1. Nếu webhook fail (trạng thái "Chờ thanh toán" nhưng khách đã chuyển khoản)
2. Chọn thanh toán
3. Xem ảnh chứng từ
4. Kiểm tra nội dung chuyển khoản
5. Nhấn "Xác nhận thanh toán"
6. Xác nhận
   → Đổi trạng thái sang "Đã thanh toán"
   → Gửi thông báo cho khách

**Xuất báo cáo:**

1. Chọn "Xuất báo cáo"
2. Chọn khoảng thời gian
3. Chọn filter:
   - Trạng thái
   - Phương thức
4. Chọn format:
   - Excel (.xlsx)
   - PDF
5. Nhấn Xuất
   → Hệ thống tạo file
   → Download file

---

### 3.11. Quản lý checklist mẫu

**Xem danh sách:**

1. Xem tất cả hạng mục kiểm tra:
   - Mã hạng mục
   - Tên hạng mục
   - Danh mục (An toàn / Khí thải / Giấy tờ)
   - Bắt buộc chụp ảnh?
   - Thứ tự hiển thị
   - Trạng thái (Active/Inactive)

**Thêm hạng mục mới:**

1. Nhấn "Thêm hạng mục"
2. Nhập thông tin:
   - Mã hạng mục
   - Tên hạng mục
3. Chọn danh mục:
   - An toàn
   - Khí thải
   - Giấy tờ
4. Tick "Bắt buộc chụp ảnh" (nếu cần)
5. Tick "Yêu cầu nhập giá trị đo" (cho hạng mục Khí thải)
6. Nếu tick yêu cầu nhập giá trị đo:
   - Nhập đơn vị (%, ppm, dB...)
   - Nhập giới hạn cho phép
     → Hệ thống tự động so sánh khi nhân viên nhập
7. Nhập thứ tự hiển thị
8. Chọn trạng thái:
   - Active (hiển thị)
   - Inactive (ẩn)
9. Nhấn Lưu
   → Hạng mục hiển thị trong checklist nhân viên

**Sửa hạng mục:**

1. Chọn hạng mục
2. Chọn Sửa
3. Sửa tất cả thông tin
4. Lưu
   → Cập nhật thành công

**Tắt hạng mục:**

1. Chọn hạng mục
2. Chuyển trạng thái sang "Inactive"
3. Lưu
   → Hạng mục không hiển thị trong checklist nhân viên nữa
   → Hạng mục cũ vẫn lưu trong lịch sử đơn hàng

**Sắp xếp thứ tự:**

1. Kéo thả hạng mục lên/xuống
2. Hoặc nhập số thứ tự
   → Thứ tự hiển thị trong checklist được cập nhật

---

### 3.12. Báo cáo & Thống kê

**Báo cáo doanh thu:**

1. Chọn "Báo cáo doanh thu"
2. Chọn khoảng thời gian
3. Xem biểu đồ:
   - Doanh thu theo ngày
   - Doanh thu theo tuần
   - Doanh thu theo tháng
   - Doanh thu theo trạm
   - Doanh thu theo loại xe
4. Xem bảng chi tiết:
   - Ngày
   - Số đơn
   - Tổng doanh thu
   - Trung bình/đơn
5. Xuất báo cáo:
   - Excel (.xlsx)
   - PDF

**Báo cáo đơn hàng:**

1. Chọn "Báo cáo đơn hàng"
2. Chọn khoảng thời gian
3. Xem tổng đơn theo trạng thái:
   - Chờ xử lý
   - Đã phân công
   - Đang thực hiện
   - Hoàn thành
   - Đã hủy
4. Xem biểu đồ:
   - Đơn theo ngày
   - Đơn theo tuần
   - Đơn theo tháng
5. Xem chỉ số:
   - Tỷ lệ hoàn thành (%)
   - Tỷ lệ hủy (%)

**Báo cáo nhân viên:**

1. Chọn "Báo cáo nhân viên"
2. Chọn khoảng thời gian
3. Xem top nhân viên xuất sắc:
   - Theo số đơn hoàn thành
   - Theo đánh giá trung bình
4. Xem bảng chi tiết:
   - Tên nhân viên
   - Trạm
   - Số đơn
   - Tỷ lệ hoàn thành (%)
   - Đánh giá trung bình
5. Xem biểu đồ hiệu suất nhân viên

**Báo cáo khách hàng:**

1. Chọn "Báo cáo khách hàng"
2. Chọn khoảng thời gian
3. Xem thống kê:
   - Tổng khách hàng
   - Khách hàng mới
   - Khách hàng quay lại (retention rate)
4. Xem top khách chi tiêu nhiều:
   - Tên
   - Số đơn
   - Tổng chi tiêu
5. Xem biểu đồ tăng trưởng khách hàng

---

### 3.13. Cài đặt hệ thống

**1. Cài đặt thông báo:**

1. Nhấn menu "Cài đặt" → Xem phần "Thông báo"
2. Bật/Tắt các loại thông báo:
   - Email thông báo:
     - Toggle ON: Gửi email khi có sự kiện (đơn mới, thanh toán...)
     - Toggle OFF: Không gửi email
   - SMS thông báo:
     - Toggle ON: Gửi SMS khi có sự kiện
     - Toggle OFF: Không gửi SMS
   - Push notification:
     - Toggle ON: Gửi thông báo đẩy lên app
     - Toggle OFF: Không gửi push notification

3. Nhấn "Lưu thay đổi" (góc trên bên phải)
   → Cài đặt được áp dụng

**Lưu ý:**

- Khi tắt, hệ thống sẽ không gửi loại thông báo đó cho tất cả người dùng
- Khách hàng & nhân viên vẫn có thể tự cài đặt bật/tắt trong app của họ

---

**2. Cài đặt bảo mật:**

1. Xem phần "Bảo mật"
2. Cài đặt tự động đăng xuất:
   - Tự động đăng xuất:
     - Toggle ON: Bật tự động đăng xuất khi không hoạt động
     - Toggle OFF: Không tự động đăng xuất
   - Thời gian tự động đăng xuất:
     - Chọn dropdown: 15 phút / 30 phút / 1 giờ / 2 giờ
     - Khi hết thời gian không hoạt động → Tự động đăng xuất
     - Phải đăng nhập lại

3. Nhấn "Lưu thay đổi"
   → Áp dụng cho tất cả tài khoản Admin

---

**3. Thông tin công ty:**

1. Xem phần "Thông tin công ty"
2. Nhập/Sửa thông tin:
   - Tên công ty:
     - Ví dụ: "Hệ thống Đăng Kiểm"
     - Hiển thị trong app khách hàng & nhân viên
   - Số điện thoại (Hotline):
     - Ví dụ: "1900-xxxx"
     - Khách hàng gọi để hỗ trợ
   - Email hỗ trợ:
     - Ví dụ: "support@dangkiem.vn"
     - Nhận email liên hệ từ khách hàng

3. Nhấn "Lưu thay đổi"
   → Thông tin cập nhật
   → Hiển thị trong:
   - Trang chủ app khách hàng
   - Màn hình "Liên hệ hỗ trợ"
   - Email gửi cho khách

---