# Features Index (cross-subproject reference)

> Workflow harness lưu **source-of-truth contract ngay tại root của mỗi subproject**:
> `spec.md` (product contract) + `Plans.md` (task ledger) + `evidence/` (bằng chứng verify).
> Các file này **không commit vào git của subproject** — chúng là overlay local (xem `.git/info/exclude`,
> do `/init-workspace` cấu hình).

Folder `docs/features/` ở workspace là **chỗ tham chiếu chéo subproject** (optional) — dùng khi một
feature trải nhiều subproject (vd backend + frontend) và cần một chỗ nhìn tổng thể. Nguồn chính vẫn là
`spec.md`/`Plans.md` ở từng subproject.

## Layout đề xuất khi cần reference chéo

```
docs/features/
  index.md                         # bảng này
  <group>/                         # vùng feature (vd: dispute, tracking)
    <feature>/
      README.md                    # tóm tắt feature + trỏ tới spec.md/Plans.md ở subproject nào
      evidence/                    # screenshot/log verify chéo subproject (nếu cần)
```

## Index

| Group | Feature | Subproject(s) | Ghi chú |
|-------|---------|---------------|---------|
| _(chưa có — thêm khi bắt đầu feature trải nhiều subproject)_ | | | |

> Feature gói gọn trong 1 subproject thì **không cần** entry ở đây — `spec.md`/`Plans.md` ở subproject đó là đủ.
