# Báo cáo: AI Dev Workflow cho Division Megamind

> **Người viết:** Team R&D
> **Đối tượng:** PM, PO, Team Lead các team trong division Megamind

---

## 1. Tổng quan

Team R&D đã xây dựng **Megamind AI Boilerplate** — một bộ template workspace tích hợp AI (Claude Code) để chuẩn hoá quy trình dev cho toàn division.

**Ý tưởng cốt lõi:** Dev gõ 1 lệnh, AI tự động điều phối toàn bộ quy trình — từ phân tích task, chia nhỏ, implement, review code, test, đến thông báo team qua Lark. Dev chỉ cần giám sát và xác nhận ở các bước quan trọng.

---

## 2. Workflow làm việc của Dev

### Làm feature mới

Dev gõ 1 lệnh, chọn scope phù hợp với task:

```
/task-flow --scope fullstack      # Cả backend + frontend + storefront
/task-flow --scope backend        # Chỉ backend
/task-flow --scope frontend       # Chỉ frontend
/task-flow --scope storefront     # Chỉ storefront
```

AI sẽ chạy lần lượt:

```
[1] Lấy task từ board (Notion/Linear)
[2] Chia task thành user stories nhỏ, đánh giá story nào đủ nhỏ để implement luôn
[3] Scan codebase hiện tại → hiểu conventions, patterns
     │
     │  Lặp cho mỗi user story:
     ├── Implement theo TDD (viết test trước → code → refactor)
     ├── AI agent độc lập review code
     └── Thêm Swagger docs (nếu có API)
     │
[4] Chạy integration test (nếu có backend)
[5] Chạy E2E test trên browser (nếu có giao diện)
[6] Chạy unit test + SonarQube quality gate
[7] Commit + thông báo team qua Lark
```

### Hotfix gấp

```
/hotfix-flow
```

Quy trình rút gọn — bỏ qua phân tích task, chia stories. Tập trung: tìm nguyên nhân → fix + test → review → quality check → commit + thông báo URGENT qua Lark.

### Dùng từng bước riêng lẻ

Mỗi bước trong workflow đều chạy được độc lập, không bắt buộc phải qua orchestrator:

```
/break-task            # Chỉ chia task thành user stories
/implement             # Chỉ implement 1 user story
/review-code           # Chỉ review code
/test-e2e              # Chỉ chạy E2E test
/check-quality         # Chỉ check quality
```

---

## 3. Triển khai về các team

### Cách triển khai

Boilerplate được đưa **trực tiếp về tất cả các team** để thử nghiệm ngay trên task thật. Không chia phase, không chọn team pilot.

Mỗi team nhận boilerplate và bắt đầu dùng. Trong quá trình sử dụng, các team **feedback liên tục** về team R&D để tối ưu.

### Mỗi team cần làm gì?

**3 bước duy nhất:**

1. **Clone boilerplate** về project của team
2. **Điền `resources.md`** — tên app, URL task board, Lark webhook, SonarQube token
3. **Đặt code vào đúng thư mục** — `backend/`, `frontend/`, `storefront/`

Không cần cài đặt thêm gì. Không cần viết config phức tạp.

### Cơ chế feedback

Đây là phiên bản đầu tiên. Mỗi team có đặc thù riêng, nên feedback từ thực tế là yếu tố quyết định để boilerplate thực sự hữu ích.

**Feedback gì?**
- Skill nào chạy không đúng, không phù hợp với project
- Thiếu hoặc thừa bước nào trong workflow
- Đề xuất cải thiện

**Feedback bằng cách nào?**
- Tạo issue trên repo boilerplate (GitLab) với label `feedback`
- Hoặc nhắn trực tiếp qua Lark group

**R&D cam kết:**
- Feedback critical (block công việc): xử lý trong **24 giờ**
- Feedback cải thiện: tổng hợp và cập nhật **định kỳ 2 tuần**
