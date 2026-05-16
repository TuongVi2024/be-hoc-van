# Plan: Thêm Từ Vựng và Vần Dài (3-4 chữ cái)
Created: 2026-05-16
Status: 🟡 In Progress

## Overview
Nâng cấp ứng dụng "Bé Học Vần" bằng cách bổ sung thêm danh sách các vần dài (3 và 4 chữ cái) và thêm từ vựng minh họa cho MỖI vần (ví dụ: vần "ưa" -> "con ngựa"). 

## Scope & Features
1. **Dữ liệu mới**: Bổ sung các vần 3-4 chữ cái (oai, oay, oang, ương, uyên, v.v.).
2. **Từ vựng minh họa**: Ghép mỗi vần với một từ vựng thực tế, quen thuộc với trẻ em.
3. **Phát âm từ vựng**: Tạo thêm file Audio TTS cho các từ vựng mới.
4. **Cập nhật Giao diện (UI)**: Hiển thị từ vựng kèm theo vần trên flashcard và hỗ trợ đọc cả từ vựng.

## Tech Stack
- Frontend: HTML, CSS, Vanilla JS
- Tooling: Node.js (generate_audio.js với Google Cloud TTS)

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | Data Preparation | ✅ Complete | 100% |
| 02 | Audio Generation | ✅ Complete | 100% |
| 03 | Frontend UI Update | ✅ Complete | 100% |

## Quick Commands
- Start Phase 1: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`
