"""
🔊 Generate Vietnamese Rhyme Audio Files
Sử dụng Google Cloud Text-to-Speech API để tạo file MP3
cho 72 vần tiếng Việt (bình thường + chậm = 144 file).

Cách dùng:
  1. Set biến môi trường:
     $env:GOOGLE_APPLICATION_CREDENTIALS="gcloud-key.json"
  2. Chạy script:
     python generate_audio.py

Tùy chọn:
  --voice    Tên voice (mặc định: vi-VN-Neural2-A)
  --output   Thư mục output (mặc định: audio)
  --list     Liệt kê tất cả giọng tiếng Việt có sẵn
  --test     Chỉ tạo 3 file đầu tiên để test
"""

import os
import sys
import argparse
from google.cloud import texttospeech


# ═══════════════════════════════════════════════════════════════
# DANH SÁCH 72 VẦN TIẾNG VIỆT
# ═══════════════════════════════════════════════════════════════

RHYMES = [
    # Vần đôi nguyên âm (22 vần)
    'ai', 'ao', 'au', 'âu', 'ay', 'ây', 'eo', 'êu', 'ia', 'iu',
    'oa', 'oe', 'oi', 'ôi', 'ơi', 'ua', 'uê', 'ui', 'uy', 'ưa',
    'ưi', 'ưu',

    # Vần có âm cuối m/p (20 vần)
    'am', 'ap', 'ăm', 'ăp', 'âm', 'âp', 'em', 'ep', 'êm', 'êp',
    'im', 'ip', 'om', 'op', 'ôm', 'ôp', 'ơm', 'ơp', 'um', 'up',

    # Vần có âm cuối n/t (22 vần)
    'an', 'at', 'ăn', 'ăt', 'ân', 'ât', 'en', 'et', 'ên', 'êt',
    'in', 'it', 'on', 'ot', 'ôn', 'ôt', 'ơn', 'ơt', 'un', 'ut',
    'ưn', 'ưt',

    # Vần có âm cuối c (10 vần)
    'ac', 'ăc', 'âc', 'ec', 'êc', 'ic', 'oc', 'ôc', 'uc', 'ưc',
]


def build_ssml_normal(rhyme: str) -> str:
    """
    Tạo SSML cho phiên bản bình thường.
    Pattern: "vần [X] ... [X]"
    """
    return (
        f'<speak>'
        f'vần <break time="300ms"/> {rhyme}'
        f'<break time="600ms"/>'
        f'{rhyme}'
        f'</speak>'
    )


def build_ssml_slow(rhyme: str) -> str:
    """
    Tạo SSML cho phiên bản chậm.
    Pattern: (chậm) "vần [X] ... [X]"
    """
    return (
        f'<speak>'
        f'<prosody rate="slow">'
        f'vần <break time="500ms"/> {rhyme}'
        f'<break time="800ms"/>'
        f'{rhyme}'
        f'</prosody>'
        f'</speak>'
    )


def list_vietnamese_voices(client: texttospeech.TextToSpeechClient):
    """Liệt kê tất cả giọng tiếng Việt có sẵn."""
    response = client.list_voices(language_code="vi-VN")

    print("\n🎤 Giọng tiếng Việt có sẵn trên Google Cloud TTS:")
    print("=" * 60)

    for voice in response.voices:
        ssml_gender = texttospeech.SsmlVoiceGender(voice.ssml_gender).name
        print(f"  {voice.name:<25} | {ssml_gender:<8} | {', '.join(voice.language_codes)}")

    print("=" * 60)
    print(f"  Tổng: {len(response.voices)} giọng\n")


def synthesize_rhyme(
    client: texttospeech.TextToSpeechClient,
    ssml: str,
    voice_name: str,
    output_path: str,
):
    """Gọi TTS API và lưu file MP3."""
    synthesis_input = texttospeech.SynthesisInput(ssml=ssml)

    voice = texttospeech.VoiceSelectionParams(
        language_code="vi-VN",
        name=voice_name,
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        speaking_rate=1.0,
        pitch=0.0,
        # Sample rate 24kHz cho chất lượng tốt, file nhỏ
        sample_rate_hertz=24000,
    )

    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config,
    )

    with open(output_path, "wb") as f:
        f.write(response.audio_content)

    return len(response.audio_content)


def main():
    parser = argparse.ArgumentParser(
        description="Tạo file MP3 vần tiếng Việt bằng Google Cloud TTS"
    )
    parser.add_argument(
        "--voice",
        default="vi-VN-Neural2-A",
        help="Tên voice (mặc định: vi-VN-Neural2-A, giọng nữ Neural2)",
    )
    parser.add_argument(
        "--output",
        default="audio",
        help="Thư mục output (mặc định: audio)",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="Liệt kê tất cả giọng tiếng Việt có sẵn",
    )
    parser.add_argument(
        "--test",
        action="store_true",
        help="Chỉ tạo 3 file đầu tiên để test",
    )

    args = parser.parse_args()

    # ─── Khởi tạo client ───
    try:
        client = texttospeech.TextToSpeechClient()
    except Exception as e:
        print(f"\n❌ Không thể kết nối Google Cloud TTS!")
        print(f"   Lỗi: {e}")
        print(f"\n💡 Kiểm tra:")
        print(f"   1. Đã set GOOGLE_APPLICATION_CREDENTIALS chưa?")
        print(f"   2. File JSON key có đúng đường dẫn không?")
        print(f"   3. Đã bật Text-to-Speech API trên Google Cloud chưa?")
        sys.exit(1)

    # ─── Liệt kê voices ───
    if args.list:
        list_vietnamese_voices(client)
        return

    # ─── Tạo thư mục output ───
    os.makedirs(args.output, exist_ok=True)

    # ─── Xác định danh sách vần cần tạo ───
    rhymes_to_generate = RHYMES[:3] if args.test else RHYMES
    total = len(rhymes_to_generate) * 2  # bình thường + chậm

    print(f"\n🔊 BẮT ĐẦU TẠO AUDIO VẦN TIẾNG VIỆT")
    print(f"{'=' * 50}")
    print(f"  Voice:  {args.voice}")
    print(f"  Output: {os.path.abspath(args.output)}")
    print(f"  Vần:    {len(rhymes_to_generate)} vần × 2 tốc độ = {total} file")
    if args.test:
        print(f"  Mode:   🧪 TEST (chỉ 3 vần đầu)")
    print(f"{'=' * 50}\n")

    success = 0
    errors = []

    for i, rhyme in enumerate(rhymes_to_generate, 1):
        # ── File bình thường ──
        normal_path = os.path.join(args.output, f"{rhyme}.mp3")
        try:
            ssml = build_ssml_normal(rhyme)
            size = synthesize_rhyme(client, ssml, args.voice, normal_path)
            print(f"  ✅ [{i}/{len(rhymes_to_generate)}] {rhyme}.mp3 ({size:,} bytes)")
            success += 1
        except Exception as e:
            print(f"  ❌ [{i}/{len(rhymes_to_generate)}] {rhyme}.mp3 - Lỗi: {e}")
            errors.append((f"{rhyme}.mp3", str(e)))

        # ── File chậm ──
        slow_path = os.path.join(args.output, f"{rhyme}_slow.mp3")
        try:
            ssml = build_ssml_slow(rhyme)
            size = synthesize_rhyme(client, ssml, args.voice, slow_path)
            print(f"  ✅ [{i}/{len(rhymes_to_generate)}] {rhyme}_slow.mp3 ({size:,} bytes)")
            success += 1
        except Exception as e:
            print(f"  ❌ [{i}/{len(rhymes_to_generate)}] {rhyme}_slow.mp3 - Lỗi: {e}")
            errors.append((f"{rhyme}_slow.mp3", str(e)))

    # ─── Báo cáo ───
    print(f"\n{'=' * 50}")
    print(f"  📊 KẾT QUẢ:")
    print(f"     ✅ Thành công: {success}/{total}")
    if errors:
        print(f"     ❌ Lỗi: {len(errors)}")
        for filename, err in errors:
            print(f"        - {filename}: {err}")
    print(f"     📁 Folder: {os.path.abspath(args.output)}")
    print(f"{'=' * 50}\n")

    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
