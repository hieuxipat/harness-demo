# US-EX01: Add Todo Item

- **ID:** US-EX01-todo-add-item
- **Group:** example
- **Jira:** — (example story, không gắn Jira ticket)
- **Test Cases:** [TC-EX01-todo-add-item.md](./TC-EX01-todo-add-item.md)
- **Status:** DRAFT

> Đây là **example story** minh họa format của một `US-*.md` được tạo bởi `/explore-story`. Khi bắt đầu dự án thật, hãy xóa folder `example/` và chạy `/explore-story` với feature thực tế.

## Goal

Cho phép người dùng thêm một todo item mới vào danh sách để theo dõi công việc cần làm.

## User Stories

1. **Là một User**, tôi muốn nhập nội dung todo và nhấn Enter (hoặc click nút Add) để thêm item mới vào danh sách, nhờ đó tôi không quên việc cần làm.

## Current State

- Đây là feature mới, chưa có implementation nào trong codebase.
- Đã có component `TodoList` hiển thị danh sách nhưng chưa có input để thêm.

## Acceptance Criteria

1. **Input field hiển thị rõ ràng:** Có một ô input với placeholder "What needs to be done?" ở trên cùng danh sách todo.
2. **Thêm bằng Enter:** Nhấn phím Enter khi input có nội dung hợp lệ sẽ thêm item mới và clear input.
3. **Thêm bằng nút Add:** Click nút "Add" cạnh input cũng thêm item mới và clear input.
4. **Trim whitespace:** Nội dung todo được trim khoảng trắng đầu/cuối trước khi lưu.
5. **Không cho phép rỗng:** Nếu input rỗng hoặc chỉ chứa whitespace, không thêm item và hiển thị hint error.
6. **Giới hạn độ dài:** Nội dung tối đa 200 ký tự; vượt quá hiển thị error message.

## Steps (User Flow)

1. User mở trang Todo
2. User click vào input field
3. User gõ nội dung todo (ví dụ: "Buy groceries")
4. User nhấn Enter hoặc click nút "Add"
5. Todo item mới xuất hiện ở cuối danh sách
6. Input field được clear để sẵn sàng nhập item tiếp theo

## Notes

- Không cần persist lên server ở story này — chỉ lưu state trong client.
- Edit/delete todo là scope của story khác.

## Open questions for PO

> Các câu hỏi dưới đây dành cho Product Owner. Sau khi có câu trả lời, cập nhật trực tiếp vào story body (hoặc dùng `/po-qa-loop`), rồi chuyển sang Phase 2 (`/create-test-case`).

1. Todo có cần sort theo thời gian tạo (mới nhất ở trên) hay append vào cuối danh sách?
2. Giới hạn 200 ký tự có chính xác không, hay cần điều chỉnh?
3. Khi người dùng paste nội dung có newline, có cần tự động split thành nhiều todo không?
