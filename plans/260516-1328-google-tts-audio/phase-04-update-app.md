# Phase 04: Cập Nhật App HTML
Status: ⬜ Pending
Dependencies: Phase 03

## Objective
Cập nhật Be_hoc_van 2.html để phát file MP3 thay vì dùng Web Speech API.

## Changes

### Bỏ đi:
- Voice selection panel (dropdown chọn giọng)
- Web Speech API code (SpeechSynthesis)
- Voice loading logic

### Thêm vào:
- HTML5 Audio element
- Logic phát file MP3 từ folder `audio/`
- Preload audio cho trải nghiệm mượt

### Code thay đổi chính:
```javascript
// CŨ: Web Speech API
const utterance = new SpeechSynthesisUtterance(text);
window.speechSynthesis.speak(utterance);

// MỚI: HTML5 Audio
const audio = new Audio(`audio/${rhyme}.mp3`);
audio.play();
```

## Test Criteria
- [ ] Bấm "Đọc vần" → phát MP3 bình thường
- [ ] Bấm "Đọc chậm 2 lần" → phát MP3 chậm
- [ ] Chạm vào thẻ → phát âm
- [ ] Chuyển thẻ → phát đúng vần
- [ ] Hoạt động trên mobile
- [ ] Không còn phụ thuộc vào giọng trình duyệt
