# Test Cases - User Story 01: Thêm nhà vận chuyển mới

## TC-01: Thêm nhà vận chuyển thành công

- **Precondition**: Admin đã đăng nhập
- **Steps**:
  1. Truy cập trang quản lý vận chuyển
  2. Click "Thêm nhà vận chuyển"
  3. Nhập tên: "VNPost", mã: "VNP", API endpoint: "https://api.vnpost.vn"
  4. Click "Lưu"
- **Expected**: Nhà vận chuyển được tạo, hiển thị notification thành công, xuất hiện trong danh sách

## TC-02: Validate thông tin bắt buộc

- **Precondition**: Admin đã đăng nhập
- **Steps**:
  1. Truy cập trang quản lý vận chuyển
  2. Click "Thêm nhà vận chuyển"
  3. Để trống tất cả các trường
  4. Click "Lưu"
- **Expected**: Hiển thị lỗi validation cho các trường bắt buộc

## TC-03: Mã nhà vận chuyển trùng lặp

- **Precondition**: Đã tồn tại nhà vận chuyển mã "VNP"
- **Steps**:
  1. Thêm nhà vận chuyển mới với mã "VNP"
  2. Click "Lưu"
- **Expected**: Hiển thị lỗi "Mã nhà vận chuyển đã tồn tại"

## TC-04: API endpoint không hợp lệ

- **Precondition**: Admin đã đăng nhập
- **Steps**:
  1. Nhập API endpoint: "not-a-url"
  2. Click "Lưu"
- **Expected**: Hiển thị lỗi "API endpoint không hợp lệ"
