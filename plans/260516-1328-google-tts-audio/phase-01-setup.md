# Phase 01: Setup Google Cloud
Status: ⬜ Pending

## Objective
Chuẩn bị môi trường: Google Cloud project, API key, Python environment.

## Steps

### 1. Tạo Google Cloud Project (nếu chưa có)
- Truy cập https://console.cloud.google.com
- Tạo project mới hoặc dùng project có sẵn
- Ghi nhớ Project ID

### 2. Bật Text-to-Speech API
- Vào APIs & Services → Library
- Tìm "Cloud Text-to-Speech API"
- Bấm Enable

### 3. Tạo Service Account Key
- Vào APIs & Services → Credentials
- Create Credentials → Service Account
- Tạo key JSON, download về folder project
- Đặt tên file: `gcloud-key.json`

### 4. Cài Python Dependencies
```bash
pip install google-cloud-texttospeech
```

### 5. Set biến môi trường
```bash
# Windows PowerShell
$env:GOOGLE_APPLICATION_CREDENTIALS="đường-dẫn-tới/gcloud-key.json"

# Hoặc Linux/Mac
export GOOGLE_APPLICATION_CREDENTIALS="đường-dẫn-tới/gcloud-key.json"
```

## Test
Chạy lệnh kiểm tra:
```bash
python -c "from google.cloud import texttospeech; print('OK!')"
```

---
Next Phase: phase-02-script.md
