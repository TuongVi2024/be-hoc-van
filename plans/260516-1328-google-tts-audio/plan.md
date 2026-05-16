# Plan: Tạo Audio Vần Tiếng Việt bằng Google Cloud TTS
Created: 2026-05-16 13:28
Status: 🟡 In Progress

## Overview
Thay thế Web Speech API (giọng trình duyệt) bằng file MP3 được tạo sẵn từ Google Cloud Text-to-Speech API. Tổng cộng 144 file MP3 (72 vần × 2 tốc độ: bình thường + chậm).

## Tech Stack
- Script: Python 3 + `google-cloud-texttospeech`
- TTS: Google Cloud Text-to-Speech (Neural2 voice)
- Audio: MP3 format
- App: HTML/CSS/JS (cập nhật file hiện có)

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | Setup Google Cloud | ⬜ Pending | 0% |
| 02 | Viết script Python | ⬜ Pending | 0% |
| 03 | Chạy script tạo audio | ⬜ Pending | 0% |
| 04 | Cập nhật app HTML | ⬜ Pending | 0% |

## Danh sách 72 vần
```
ai, ao, au, âu, ay, ây, eo, êu, ia, iu,
oa, oe, oi, ôi, ơi, ua, uê, ui, uy, ưa, ưi, ưu,
am, ap, ăm, ăp, âm, âp, em, ep, êm, êp,
im, ip, om, op, ôm, ôp, ơm, ơp, um, up,
an, at, ăn, ăt, ân, ât, en, et, ên, êt,
in, it, on, ot, ôn, ôt, ơn, ơt, un, ut, ưn, ưt,
ac, ăc, âc, ec, êc, ic, oc, ôc, uc, ưc
```

## Quick Commands
- Start Phase 1: `/code phase-01`
- Check progress: `/next`
