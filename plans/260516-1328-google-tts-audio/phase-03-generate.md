# Phase 03: Chạy Script Tạo Audio
Status: ⬜ Pending
Dependencies: Phase 01, Phase 02

## Objective
Chạy script để tạo toàn bộ 144 file MP3.

## Steps

### 1. Đảm bảo credentials đã set
```bash
$env:GOOGLE_APPLICATION_CREDENTIALS="gcloud-key.json"
```

### 2. Chạy script
```bash
python generate_audio.py
```

### 3. Kiểm tra kết quả
- Mở folder `audio/` xem có đủ 144 file
- Mở vài file MP3 nghe thử
- Kiểm tra phát âm có chuẩn không

### 4. Nếu cần điều chỉnh
- Thay đổi voice (Neural2-A → WaveNet-A, etc.)
- Thay đổi speaking rate
- Thay đổi SSML pattern

## Test Criteria
- [ ] 144 file MP3 được tạo thành công
- [ ] Phát âm rõ ràng, chuẩn tiếng Việt
- [ ] File size hợp lý (~5-20KB mỗi file)

---
Next Phase: phase-04-update-app.md
