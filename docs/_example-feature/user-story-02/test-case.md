# Test Cases - User Story 02: Cập nhật thông tin nhà vận chuyển

## TC-01: Cập nhật tên và API endpoint thành công

- **Precondition**: Nhà vận chuyển "VNPost" đã tồn tại
- **Steps**:
  1. Truy cập chi tiết nhà vận chuyển "VNPost"
  2. Thay đổi tên thành "Vietnam Post"
  3. Click "Lưu"
- **Expected**: Thông tin được cập nhật, notification thành công

## TC-02: Không cho phép thay đổi mã nhà vận chuyển

- **Precondition**: Nhà vận chuyển "VNPost" (mã: VNP) đã tồn tại
- **Steps**:
  1. Truy cập chi tiết nhà vận chuyển
  2. Kiểm tra trường "Mã"
- **Expected**: Trường mã bị disabled, không cho phép chỉnh sửa

## TC-03: Bật/tắt trạng thái nhà vận chuyển

- **Precondition**: Nhà vận chuyển đang active
- **Steps**:
  1. Toggle trạng thái sang inactive
  2. Click "Lưu"
- **Expected**: Trạng thái chuyển thành inactive, nhà vận chuyển không hiển thị cho khách hàng
