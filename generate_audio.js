/**
 * 🔊 Generate Vietnamese Rhyme Audio Files
 * Sử dụng Google Cloud Text-to-Speech API để tạo file MP3
 * cho 72 vần tiếng Việt (bình thường + chậm = 144 file).
 *
 * Cách dùng:
 *   1. Cài package:
 *      npm install @google-cloud/text-to-speech
 *
 *   2. Set biến môi trường:
 *      $env:GOOGLE_APPLICATION_CREDENTIALS="gcloud-key.json"
 *
 *   3. Chạy script:
 *      node generate_audio.js
 *
 * Tùy chọn:
 *   --voice <name>    Tên voice (mặc định: vi-VN-Neural2-A)
 *   --output <dir>    Thư mục output (mặc định: audio)
 *   --list            Liệt kê tất cả giọng tiếng Việt
 *   --test            Chỉ tạo 3 vần đầu để test
 */

const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');
const util = require('util');

// ═══════════════════════════════════════════════════════════════
// DANH SÁCH VẦN VÀ TỪ VỰNG
// ═══════════════════════════════════════════════════════════════

const rhymeData = require('./data.js');

// ═══════════════════════════════════════════════════════════════
// PRONUNCIATION DICTIONARY (Sửa lỗi phát âm)
// ═══════════════════════════════════════════════════════════════

const PRONUNCIATION_MAP = {
    // Thêm dấu sắc cho các vần kết thúc bằng c, p, t, ch
    'ac': 'ác', 'ăc': 'ắc', 'âc': 'ấc', 'ec': 'éc', 'êc': 'ếc', 'ic': 'íc', 'oc': 'óc', 'ôc': 'ốc', 'uc': 'úc', 'ưc': 'ức',
    'ap': 'áp', 'ăp': 'ắp', 'âp': 'ấp', 'ep': 'ép', 'êp': 'ếp', 'ip': 'íp', 'op': 'óp', 'ôp': 'ốp', 'up': 'úp', 'ơp': 'ớp',
    'at': 'át', 'ăt': 'ắt', 'ât': 'ất', 'et': 'ét', 'êt': 'ết', 'it': 'ít', 'ot': 'ót', 'ôt': 'ốt', 'ơt': 'ớt', 'ut': 'út', 'ưt': 'ứt',
    
    // Vần 3-4 chữ cái có âm cuối c, p, t, ch
    'oap': 'oáp', 'oăp': 'oắp', 'iêp': 'iếp', 'yêp': 'yếp', 'uôp': 'uốp', 'ươp': 'ướp',
    'oat': 'oát', 'oăt': 'oắt', 'uât': 'uất', 'iêt': 'iết', 'yêt': 'yết', 'uôt': 'uốt', 'ươt': 'ướt',
    'oac': 'oác', 'oăc': 'oắc', 'iêc': 'iếc', 'uôc': 'uốc', 'ươc': 'ước',
    'ach': 'ách', 'êch': 'ếch', 'ich': 'ích', 'oach': 'oách', 'uych': 'uých',

    // Tách âm cho một số vần đặc biệt
    'ia': 'i a',
    'ưu': 'ư u'
};

// ═══════════════════════════════════════════════════════════════
// SSML BUILDERS
// ═══════════════════════════════════════════════════════════════

function buildSsmlNormal(rhymeText) {
    return `<speak>vần <break time="300ms"/> ${rhymeText}<break time="600ms"/>${rhymeText}</speak>`;
}

function buildSsmlSlow(rhymeText) {
    return `<speak><prosody rate="slow">vần <break time="500ms"/> ${rhymeText}<break time="800ms"/>${rhymeText}</prosody></speak>`;
}

// ═══════════════════════════════════════════════════════════════
// PARSE ARGS
// ═══════════════════════════════════════════════════════════════

function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        voice: 'vi-VN-Neural2-A',
        output: 'audio',
        list: false,
        test: false,
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--voice':
                options.voice = args[++i];
                break;
            case '--output':
                options.output = args[++i];
                break;
            case '--list':
                options.list = true;
                break;
            case '--test':
                options.test = true;
                break;
        }
    }

    return options;
}

// ═══════════════════════════════════════════════════════════════
// LIST VOICES
// ═══════════════════════════════════════════════════════════════

async function listVietnameseVoices(client) {
    const [result] = await client.listVoices({ languageCode: 'vi-VN' });

    console.log('\n🎤 Giọng tiếng Việt có sẵn trên Google Cloud TTS:');
    console.log('='.repeat(60));

    const genderMap = { 1: 'MALE', 2: 'FEMALE', 3: 'NEUTRAL' };

    for (const voice of result.voices) {
        const gender = genderMap[voice.ssmlGender] || 'UNKNOWN';
        const langs = voice.languageCodes.join(', ');
        console.log(`  ${voice.name.padEnd(25)} | ${gender.padEnd(8)} | ${langs}`);
    }

    console.log('='.repeat(60));
    console.log(`  Tổng: ${result.voices.length} giọng\n`);
}

// ═══════════════════════════════════════════════════════════════
// SYNTHESIZE
// ═══════════════════════════════════════════════════════════════

async function synthesizeRhyme(client, ssml, voiceName, outputPath) {
    const request = {
        input: { ssml: ssml },
        voice: {
            languageCode: 'vi-VN',
            name: voiceName,
        },
        audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 1.0,
            pitch: 0.0,
            sampleRateHertz: 24000,
        },
    };

    const [response] = await client.synthesizeSpeech(request);

    await fs.promises.writeFile(outputPath, response.audioContent, 'binary');

    return response.audioContent.length;
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
    const options = parseArgs();

    // ─── Khởi tạo client ───
    let client;
    try {
        client = new textToSpeech.TextToSpeechClient();
    } catch (err) {
        console.error('\n❌ Không thể kết nối Google Cloud TTS!');
        console.error(`   Lỗi: ${err.message}`);
        console.error('\n💡 Kiểm tra:');
        console.error('   1. Đã set GOOGLE_APPLICATION_CREDENTIALS chưa?');
        console.error('   2. File JSON key có đúng đường dẫn không?');
        console.error('   3. Đã bật Text-to-Speech API trên Google Cloud chưa?');
        process.exit(1);
    }

    // ─── List voices ───
    if (options.list) {
        await listVietnameseVoices(client);
        return;
    }

    // ─── Tạo thư mục output ───
    fs.mkdirSync(options.output, { recursive: true });

    // ─── Xác định danh sách dữ liệu ───
    const dataToGenerate = options.test ? rhymeData.slice(0, 3) : rhymeData;
    let total = 0;
    dataToGenerate.forEach(item => {
        total += 2; // rhyme normal + slow
        if (item.word && item.word !== '(hiếm)') total += 1; // word audio
    });

    console.log(`\n🔊 BẮT ĐẦU TẠO AUDIO VẦN TIẾNG VIỆT`);
    console.log('='.repeat(50));
    console.log(`  Voice:  ${options.voice}`);
    console.log(`  Output: ${path.resolve(options.output)}`);
    console.log(`  Vần:    ${dataToGenerate.length} vần × 2 tốc độ + Từ vựng = ${total} file`);
    if (options.test) {
        console.log(`  Mode:   🧪 TEST (chỉ 3 vần đầu)`);
    }
    console.log('='.repeat(50) + '\n');

    let success = 0;
    const errors = [];

    for (let i = 0; i < dataToGenerate.length; i++) {
        const item = dataToGenerate[i];
        const rhyme = item.rhyme;
        const word = item.word;
        const num = i + 1;
        const pronunciation = PRONUNCIATION_MAP[rhyme] || rhyme;

        // ── 1. File vần bình thường ──
        const normalPath = path.join(options.output, `${rhyme}.mp3`);
        try {
            const ssml = buildSsmlNormal(pronunciation);
            const size = await synthesizeRhyme(client, ssml, options.voice, normalPath);
            console.log(`  ✅ [${num}/${dataToGenerate.length}] ${rhyme}.mp3`);
            success++;
        } catch (err) {
            console.log(`  ❌ [${num}/${dataToGenerate.length}] ${rhyme}.mp3 - Lỗi: ${err.message}`);
            errors.push({ file: `${rhyme}.mp3`, error: err.message });
        }

        // ── 2. File vần chậm ──
        const slowPath = path.join(options.output, `${rhyme}_slow.mp3`);
        try {
            const ssml = buildSsmlSlow(pronunciation);
            const size = await synthesizeRhyme(client, ssml, options.voice, slowPath);
            console.log(`  ✅ [${num}/${dataToGenerate.length}] ${rhyme}_slow.mp3`);
            success++;
        } catch (err) {
            console.log(`  ❌ [${num}/${dataToGenerate.length}] ${rhyme}_slow.mp3 - Lỗi: ${err.message}`);
            errors.push({ file: `${rhyme}_slow.mp3`, error: err.message });
        }

        // ── 3. File từ vựng minh họa ──
        if (word && word !== '(hiếm)') {
            const wordPath = path.join(options.output, `word_${rhyme}.mp3`);
            try {
                // Word không cần buildSsml phức tạp, chỉ cần đọc text bình thường
                // Hoặc có thể thêm break nhẹ trước khi đọc
                const ssmlWord = `<speak>từ <break time="300ms"/> ${word}</speak>`;
                const size = await synthesizeRhyme(client, ssmlWord, options.voice, wordPath);
                console.log(`  ✅ [${num}/${dataToGenerate.length}] word_${rhyme}.mp3 (${word})`);
                success++;
            } catch (err) {
                console.log(`  ❌ [${num}/${dataToGenerate.length}] word_${rhyme}.mp3 - Lỗi: ${err.message}`);
                errors.push({ file: `word_${rhyme}.mp3`, error: err.message });
            }
        }
    }

    // ─── Báo cáo ───
    console.log(`\n${'='.repeat(50)}`);
    console.log(`  📊 KẾT QUẢ:`);
    console.log(`     ✅ Thành công: ${success}/${total}`);
    if (errors.length > 0) {
        console.log(`     ❌ Lỗi: ${errors.length}`);
        errors.forEach(e => console.log(`        - ${e.file}: ${e.error}`));
    }
    console.log(`     📁 Folder: ${path.resolve(options.output)}`);
    console.log('='.repeat(50) + '\n');

    if (errors.length > 0) {
        process.exit(1);
    }
}

main().catch(err => {
    console.error('❌ Lỗi không xử lý được:', err.message);
    process.exit(1);
});
