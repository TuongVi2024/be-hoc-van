# Phase 03: Frontend UI Update
Status: ✅ Complete
Dependencies: Phase 02

## Objective
Hiển thị từ vựng minh họa lên giao diện thẻ bài (Flashcard) và tích hợp âm thanh đọc từ vựng vào hệ thống nút bấm.

## Implementation Steps
1. [ ] **Cập nhật UI Thẻ Bài**: 
   - Chia không gian thẻ bài để hiển thị vần (chữ lớn) ở trên và từ vựng minh họa (chữ vừa) ở dưới.
   - Làm nổi bật phần vần bên trong từ vựng (VD: con ng**ựa**).
2. [ ] **Thêm nút Đọc Từ Vựng**: 
   - Thêm một nút chức năng "🗣️ Đọc từ" hoặc cho phép bấm trực tiếp vào chữ "con ngựa" để nghe.
3. [ ] **Cập nhật logic `index.html`**:
   - Khởi tạo Audio object cho file `word_{rhyme}.mp3`.
   - Xử lý mượt mà việc chuyển tiếp giữa đọc vần và đọc từ vựng.
4. [ ] **Chỉnh sửa Responsive**: Đảm bảo layout không bị vỡ trên điện thoại khi từ vựng quá dài (VD: "chim khuyên").

## Files to Modify
- `index.html` - HTML, CSS, JS logic.

## Notes
Nên thiết kế sao cho từ vựng minh họa trông thân thiện, dễ thương, phù hợp với màu sắc pastel hiện có. Cần tính đến trường hợp có thể thêm ảnh minh họa bằng Emoji hoặc hình thật sau này.
