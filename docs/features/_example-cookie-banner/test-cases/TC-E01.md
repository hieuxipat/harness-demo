---
id: TC-E01
title: "E2E: Full cookie consent flow trên storefront"
type: e2e
covers: [US-002]
covers_ac: [AC-1, AC-2, AC-3]
status: pass
assigned_to: "Hoang Van E"
last_run: 2026-03-25
---

## Preconditions
- Cookie banner enabled với default content
- Storefront accessible
- Browser clear (no localStorage)

## Steps
1. Mở storefront homepage
2. Verify banner hiển thị
3. Click "Reject All"
4. Verify banner ẩn
5. Mở DevTools → Application → localStorage → verify `cookie_consent = "rejected"`
6. Mở Network tab → verify không có tracking scripts loaded
7. Refresh page → verify banner không hiển thị lại

## Expected Result
- Banner hiển thị khi chưa có consent
- Reject lưu đúng vào localStorage
- Tracking scripts không load khi rejected
- Banner không hiển thị lại sau refresh

## Actual Result
Pass — Full reject flow verified. No tracking scripts (Google Analytics, Facebook Pixel) loaded after rejection.
