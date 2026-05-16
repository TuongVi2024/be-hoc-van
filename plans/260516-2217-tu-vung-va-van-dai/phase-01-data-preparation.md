# Phase 01: Data Preparation
Status: ✅ Complete

## Objective
Xây dựng cấu trúc dữ liệu mới để hỗ trợ cả "vần" và "từ vựng", đồng thời bổ sung danh sách các vần 3-4 chữ cái.

## Implementation Steps
1. [ ] **Thiết kế cấu trúc dữ liệu**: Đổi mảng `rhymes` từ mảng String sang mảng Object trong `index.html`.
   - Cấu trúc: `{ rhyme: 'ưa', word: 'con ngựa' }`
2. [ ] **Biên soạn danh sách vần cũ kèm từ vựng**: Cập nhật 72 vần hiện tại với từ vựng tương ứng (VD: 'ai' -> 'cái tai', 'ao' -> 'ngôi sao').
3. [ ] **Bổ sung vần 3 và 4 chữ cái**: Thêm các vần như 'oai', 'oay', 'oan', 'oang', 'iêu', 'yêu', 'ương', 'uyên', 'uyêt', 'oong'... và từ vựng cho chúng.
4. [ ] **Cập nhật script TTS**: Điều chỉnh `generate_audio.js` để đọc file dữ liệu mới và chuẩn bị danh sách text cần gọi API Google TTS.

## Files to Create/Modify
- `index.html` - Cập nhật biến `rhymes`.
- `generate_audio.js` - Chuẩn bị script để lấy danh sách từ vựng.

## Notes
Nên lưu mảng data vào một file riêng (VD: `data.js`) hoặc giữ trong `index.html` nhưng phải dễ maintain. Sẽ cần một khối lượng biên soạn từ vựng khá lớn (khoảng 100+ từ).

---
Next Phase: Phase 02 - Audio Generation
