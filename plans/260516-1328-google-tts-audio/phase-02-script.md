# Phase 02: Viết Script Python
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Viết script Python tạo 144 file MP3 (72 vần × 2 tốc độ).

## Script: generate_audio.py

### Tính năng:
- Dùng SSML để kiểm soát tốc độ, ngắt nghỉ
- Giọng Neural2-A (nữ, tự nhiên nhất)
- 2 bản cho mỗi vần:
  - `{vần}.mp3` — tốc độ bình thường: "vần [X]... [X]"
  - `{vần}_slow.mp3` — tốc độ chậm: "vần [X]... [X]"
- Lưu vào folder `audio/`

### SSML Format:
```xml
<!-- Bình thường -->
<speak>
  vần <break time="300ms"/> ai <break time="500ms"/> ai
</speak>

<!-- Chậm -->
<speak>
  <prosody rate="slow">
    vần <break time="500ms"/> ai <break time="800ms"/> ai
  </prosody>
</speak>
```

### Output Structure:
```
audio/
├── ai.mp3
├── ai_slow.mp3
├── ao.mp3
├── ao_slow.mp3
├── ...
└── ưc_slow.mp3
```

## Files
- `generate_audio.py` — Script chính

---
Next Phase: phase-03-generate.md
