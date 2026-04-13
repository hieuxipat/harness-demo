# TC-EX01: Add Todo Item

- **ID:** TC-EX01-todo-add-item
- **Group:** example
- **Linked Story:** [US-EX01-todo-add-item.md](./US-EX01-todo-add-item.md)

> Đây là **example test case file** minh họa format do `/create-test-case` sinh ra. Mỗi test case có section prefix: `H01` (HAPPY), `E01` (EDGE), `R01` (ERROR).

---

## TC-EX01-H01: Add todo bằng phím Enter

- **test-result:** PENDING
- **test-result-note:**
- **type:** happy_path
- **description:** Verify người dùng có thể thêm todo mới bằng cách gõ nội dung và nhấn Enter.
- **precondition:** Trang Todo đã load xong, danh sách hiện tại có 0 hoặc nhiều items.

### Steps

1. Click vào input field "What needs to be done?"
2. Gõ "Buy groceries"
3. Nhấn phím Enter

### Expected Result

- Todo item "Buy groceries" xuất hiện trong danh sách.
- Input field được clear (trống).
- Focus vẫn ở trong input để sẵn sàng nhập item tiếp theo.

---

## TC-EX01-H02: Add todo bằng nút Add

- **test-result:** PENDING
- **test-result-note:**
- **type:** happy_path
- **description:** Verify click nút "Add" cũng thêm todo giống như nhấn Enter.
- **precondition:** Trang Todo đã load xong.

### Steps

1. Click vào input field
2. Gõ "Call dentist"
3. Click nút "Add" cạnh input

### Expected Result

- Todo item "Call dentist" xuất hiện trong danh sách.
- Input field được clear.

---

## TC-EX01-E01: Trim whitespace đầu/cuối

- **test-result:** PENDING
- **test-result-note:**
- **type:** edge_case
- **description:** Verify nội dung todo được trim khoảng trắng trước khi lưu.
- **precondition:** Trang Todo đã load xong.

### Steps

1. Gõ "   Read book   " (có khoảng trắng đầu và cuối)
2. Nhấn Enter

### Expected Result

- Todo item hiển thị là "Read book" (không có khoảng trắng thừa).

---

## TC-EX01-E02: Nội dung đúng 200 ký tự (biên trên)

- **test-result:** PENDING
- **test-result-note:**
- **type:** edge_case
- **description:** Verify todo với đúng 200 ký tự được accept (boundary case).
- **precondition:** Trang Todo đã load xong.

### Steps

1. Paste nội dung dài đúng 200 ký tự vào input
2. Nhấn Enter

### Expected Result

- Todo item được thêm thành công với đầy đủ 200 ký tự.
- Không hiện error message.

---

## TC-EX01-R01: Từ chối input rỗng hoặc chỉ whitespace

- **test-result:** PENDING
- **test-result-note:**
- **type:** error_case
- **description:** Verify hệ thống không thêm todo khi input rỗng hoặc chỉ chứa khoảng trắng.
- **precondition:** Trang Todo đã load xong.

### Steps

1. Để input trống (hoặc gõ "    " toàn khoảng trắng)
2. Nhấn Enter

### Expected Result

- Không có todo mới được thêm vào danh sách.
- Hiển thị hint error ngắn gọn (ví dụ: "Todo không được để trống").
- Input field vẫn giữ nguyên nội dung (nếu có whitespace) để user chỉnh sửa.
