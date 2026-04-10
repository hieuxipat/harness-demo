# User Story 02: Cập nhật thông tin nhà vận chuyển

## Thông tin

- **Feature**: Example Feature - Add Carrier
- **Story ID**: US-02
- **Priority**: Medium
- **Status**: Draft

## User Story

**As a** quản trị viên hệ thống,
**I want** chỉnh sửa thông tin nhà vận chuyển đã tồn tại,
**So that** tôi có thể cập nhật API endpoint hoặc thay đổi trạng thái hoạt động.

## Acceptance Criteria

1. **AC-01**: Admin có thể chỉnh sửa tên, API endpoint của nhà vận chuyển
2. **AC-02**: Admin có thể bật/tắt trạng thái nhà vận chuyển
3. **AC-03**: Mã nhà vận chuyển không được phép thay đổi sau khi tạo
4. **AC-04**: Hệ thống ghi log thay đổi

## Notes

- Mã nhà vận chuyển là immutable để đảm bảo tính nhất quán dữ liệu
