# Phase 02: Audio Generation
Status: ✅ Complete
Dependencies: Phase 01

## Objective
Sử dụng Google Cloud TTS để tạo hàng loạt file MP3 cho cả các vần mới bổ sung và danh sách các từ vựng minh họa.

## Implementation Steps
1. [ ] Cập nhật logic `generate_audio.js`:
   - Lặp qua mảng đối tượng `{ rhyme, word }`.
   - Sinh file MP3 cho vần: `audio/{rhyme}.mp3` và `audio/{rhyme}_slow.mp3`.
   - Sinh file MP3 cho từ vựng: `audio/word_{rhyme}.mp3` (VD: `audio/word_ưa.mp3` chứa âm thanh "con ngựa").
2. [ ] Xử lý SSML (nếu cần) cho các từ vựng đặc biệt để Google TTS đọc chuẩn giọng tiếng Việt (như đã làm ở Phase trước với các vần kết thúc bằng 'c', 'p', 't', 'ch').
3. [ ] Chạy script `node generate_audio.js` để tải toàn bộ file về máy.
4. [ ] Kiểm tra xác suất một vài file audio từ vựng xem có bị lỗi phát âm hay không.

## Files to Modify
- `generate_audio.js`

## Notes
Google TTS có giới hạn quota miễn phí hàng tháng, nhưng với khoảng 200 từ/vần thì sẽ nằm trong mức an toàn (Free Tier).

---
Next Phase: Phase 03 - Frontend UI Update
