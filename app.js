/* =============================================
   Morse Code Converter — app.js
   Author: Param Sangani | Day 82 of 100 Days of Code
   ============================================= */

'use strict';

// =============================================
// Morse Code Dictionary (Extended)
// =============================================
const MORSE_CODE_DICT = {
    'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..',
    'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
    'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
    'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
    'q': '--.-', 'r': '.-.', 's': '...', 't': '-',
    'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
    'y': '-.--', 'z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
    '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
    '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
    '$': '...-..-', '@': '.--.-.'
};

// Reverse dictionary: Morse → English
const REVERSE_MORSE = {};
for (const [char, code] of Object.entries(MORSE_CODE_DICT)) {
    REVERSE_MORSE[code] = char;
}

// =============================================
// DOM References
// =============================================
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const btnSwap = document.getElementById('btn-swap');
const btnCopy = document.getElementById('btn-copy');
const btnPlay = document.getElementById('btn-play');
const btnClear = document.getElementById('btn-clear');
const btnDownload = document.getElementById('btn-download');
const labelSource = document.getElementById('label-source');
const labelTarget = document.getElementById('label-target');
const charCounter = document.getElementById('char-counter');
const statusMsg = document.getElementById('status-msg');
const morseDotDisplay = document.getElementById('morse-dot-display');
const audioStatus = document.getElementById('audio-status');
const audioVisualizer = document.getElementById('audio-visualizer');
const referenceGrid = document.getElementById('reference-grid');
const btnToggleRef = document.getElementById('btn-toggle-ref');
const referenceHeader = document.querySelector('.reference-header');

// =============================================
// State
// =============================================
let isEnglishToMorse = true;
let audioContext = null;
let isPlaying = false;
let stopPlayback = false;
let currentSymbolEls = [];

// =============================================
// Translation Logic
// =============================================
function textToMorse(text) {
    const chars = text.toLowerCase().split('');
    const parts = [];

    for (const char of chars) {
        if (char === ' ' || char === '\n') {
            // Avoid consecutive word-separators
            if (parts.length && parts[parts.length - 1] !== '/') {
                parts.push('/');
            }
        } else if (MORSE_CODE_DICT[char] !== undefined) {
            parts.push(MORSE_CODE_DICT[char]);
        }
        // Unknown chars are silently skipped (not polluting output with '?')
    }

    // Trim trailing word separator
    while (parts.length && parts[parts.length - 1] === '/') parts.pop();

    return parts.join(' ');
}

function morseToText(morse) {
    const words = morse.trim().split(/\s*\/\s*/);
    const decoded = words.map(word => {
        if (!word.trim()) return '';
        return word.trim().split(/\s+/).map(code => {
            const ch = REVERSE_MORSE[code];
            return ch !== undefined ? ch.toUpperCase() : '?';
        }).join('');
    });
    return decoded.filter(w => w !== '').join(' ');
}

function translate() {
    const raw = inputText.value;
    const input = raw.trim();

    updateCharCounter(raw.length);

    if (!input) {
        outputText.value = '';
        setStatus('');
        buildMorseDots('');
        return;
    }

    const result = isEnglishToMorse ? textToMorse(input) : morseToText(input);
    outputText.value = result;

    if (result) {
        if (isEnglishToMorse) {
            const symbolCount = result.split(/\s+/).filter(s => s !== '/').length;
            setStatus(`${symbolCount} symbol${symbolCount !== 1 ? 's' : ''}`, 'success');
            buildMorseDots(result);
        } else {
            const charCount = result.replace(/\s/g, '').length;
            setStatus(`${charCount} character${charCount !== 1 ? 's' : ''}`, 'success');
            buildMorseDots('');
        }
    } else {
        setStatus('No translatable characters', 'error');
    }
}

// =============================================
// Character Counter
// =============================================
function updateCharCounter(length) {
    charCounter.textContent = `${length} character${length !== 1 ? 's' : ''}`;
    charCounter.classList.toggle('near-limit', length > 500);
}

// =============================================
// Status Message
// =============================================
function setStatus(msg, type = '') {
    statusMsg.textContent = msg;
    statusMsg.className = 'status-msg' + (type ? ` ${type}` : '');
}

// =============================================
// Morse Dot Display (Visual)
// =============================================
function buildMorseDots(morseStr) {
    morseDotDisplay.innerHTML = '';
    currentSymbolEls = [];

    if (!morseStr) return;

    const chars = morseStr.split('');
    chars.forEach(ch => {
        let el;
        if (ch === '.') {
            el = document.createElement('span');
            el.className = 'dot-sym';
            currentSymbolEls.push(el);
        } else if (ch === '-') {
            el = document.createElement('span');
            el.className = 'dash-sym';
            currentSymbolEls.push(el);
        } else if (ch === ' ' || ch === '/') {
            el = document.createElement('span');
            el.className = 'space-sym';
        }
        if (el) morseDotDisplay.appendChild(el);
    });
}

// =============================================
// Swap Direction
// =============================================
btnSwap.addEventListener('click', () => {
    isEnglishToMorse = !isEnglishToMorse;

    // Update labels & active class
    if (isEnglishToMorse) {
        labelSource.textContent = 'English';
        labelTarget.textContent = 'Morse';
        labelSource.classList.add('active-lang');
        labelTarget.classList.remove('active-lang');
        inputText.placeholder = 'Type here to translate...';
    } else {
        labelSource.textContent = 'Morse';
        labelTarget.textContent = 'English';
        labelSource.classList.add('active-lang');
        labelTarget.classList.remove('active-lang');
        inputText.placeholder = 'Enter Morse code (use spaces between letters, / between words)...';
    }

    // Swap text content
    const currentOutput = outputText.value;
    inputText.value = currentOutput;
    outputText.value = '';

    translate();

    // Animate swap button
    btnSwap.classList.add('spinning');
    setTimeout(() => btnSwap.classList.remove('spinning'), 420);
});

// =============================================
// Copy to Clipboard
// =============================================
btnCopy.addEventListener('click', async () => {
    const text = outputText.value;
    if (!text) {
        setStatus('Nothing to copy!', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        const icon = btnCopy.querySelector('i');
        icon.className = 'fa-solid fa-check';
        btnCopy.style.color = '#34d399';
        btnCopy.style.borderColor = '#34d399';
        setStatus('Copied to clipboard!', 'success');

        setTimeout(() => {
            icon.className = 'fa-regular fa-copy';
            btnCopy.style.color = '';
            btnCopy.style.borderColor = '';
            setStatus('');
        }, 2000);
    } catch {
        setStatus('Copy failed — please copy manually.', 'error');
    }
});

// =============================================
// Clear All
// =============================================
btnClear.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';
    updateCharCounter(0);
    setStatus('');
    buildMorseDots('');
    audioStatus.textContent = 'Press play to hear the Morse code';
    audioVisualizer.classList.remove('active');
    inputText.focus();
});

// =============================================
// Download as .txt
// =============================================
btnDownload.addEventListener('click', () => {
    const input = inputText.value.trim();
    const output = outputText.value.trim();
    if (!input && !output) {
        setStatus('Nothing to download!', 'error');
        return;
    }

    const direction = isEnglishToMorse ? 'English → Morse' : 'Morse → English';
    const content = [
        '============================',
        '  Morse Code Converter',
        '  by Param Sangani',
        '============================',
        '',
        `Direction: ${direction}`,
        '',
        'Input:',
        input,
        '',
        'Output:',
        output,
        '',
        `Generated: ${new Date().toLocaleString()}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'morse_translation.txt';
    a.click();
    URL.revokeObjectURL(url);
    setStatus('Downloaded!', 'success');
    setTimeout(() => setStatus(''), 2000);
});

// =============================================
// Web Audio API — Morse Playback
// =============================================
const DOT_MS = 80;   // milliseconds per dot unit
const FREQ_HZ = 650;  // tone frequency

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function playTone(durationMs) {
    return new Promise(resolve => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.value = FREQ_HZ;
        osc.connect(gain);
        gain.connect(audioContext.destination);

        const now = audioContext.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.7, now + 0.005);
        gain.gain.setValueAtTime(0.7, now + (durationMs / 1000) - 0.005);
        gain.gain.linearRampToValueAtTime(0, now + (durationMs / 1000));

        osc.start(now);
        osc.stop(now + (durationMs / 1000));
        osc.onended = resolve;
    });
}

async function playMorse(morseStr) {
    stopPlayback = false;
    isPlaying = true;

    setPlayingUI(true);
    audioVisualizer.classList.add('active');

    // Build dot display if not already built
    buildMorseDots(morseStr);

    let symIndex = 0; // index into currentSymbolEls

    const chars = morseStr.split('');
    for (let i = 0; i < chars.length; i++) {
        if (stopPlayback) break;

        const ch = chars[i];
        const el = currentSymbolEls[symIndex];

        if (ch === '.') {
            if (el) el.classList.add('lit');
            audioStatus.textContent = '▶  dot';
            await playTone(DOT_MS);
            await wait(DOT_MS); // inter-symbol gap
            if (el) el.classList.remove('lit');
            symIndex++;
        } else if (ch === '-') {
            if (el) el.classList.add('lit');
            audioStatus.textContent = '▶  dash';
            await playTone(DOT_MS * 3);
            await wait(DOT_MS); // inter-symbol gap
            if (el) el.classList.remove('lit');
            symIndex++;
        } else if (ch === ' ') {
            audioStatus.textContent = '  (letter gap)';
            await wait(DOT_MS * 2); // 3 total with inter-symbol gap already done
        } else if (ch === '/') {
            audioStatus.textContent = '  (word gap)';
            await wait(DOT_MS * 5); // 7 total
        }
    }

    audioStatus.textContent = stopPlayback
        ? '⏹  Stopped'
        : '✓  Playback complete';

    setPlayingUI(false);
    isPlaying = false;
    stopPlayback = false;
    audioVisualizer.classList.remove('active');
}

function setPlayingUI(playing) {
    const icon = btnPlay.querySelector('i');
    if (playing) {
        icon.className = 'fa-solid fa-stop';
        btnPlay.classList.add('playing');
        btnPlay.setAttribute('title', 'Stop Playback');
        btnPlay.setAttribute('aria-label', 'Stop Morse code playback');
    } else {
        icon.className = 'fa-solid fa-volume-high';
        btnPlay.classList.remove('playing');
        btnPlay.setAttribute('title', 'Play Morse Code as Audio');
        btnPlay.setAttribute('aria-label', 'Play Morse code audio');
    }
}

btnPlay.addEventListener('click', () => {
    if (isPlaying) {
        stopPlayback = true;
        return;
    }

    const morseStr = isEnglishToMorse ? outputText.value : inputText.value;
    if (!morseStr.trim()) {
        setStatus('No Morse code to play!', 'error');
        setTimeout(() => setStatus(''), 2000);
        return;
    }

    // Resume suspended audio context (browser autoplay policy)
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }

    playMorse(morseStr);
});

// =============================================
// Morse Reference Chart
// =============================================
function buildReferenceChart() {
    referenceGrid.innerHTML = '';

    const entries = Object.entries(MORSE_CODE_DICT);
    entries.forEach(([char, code]) => {
        const item = document.createElement('div');
        item.className = 'ref-item';
        item.title = `Click to use "${char.toUpperCase()}"`;
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `${char.toUpperCase()}: ${code}`);

        item.innerHTML = `
            <span class="ref-char">${char.toUpperCase()}</span>
            <span class="ref-code">${code}</span>
        `;

        // Click ref item → insert char into input
        const insertChar = () => {
            if (!isEnglishToMorse) return;
            const pos = inputText.selectionStart;
            const val = inputText.value;
            inputText.value = val.slice(0, pos) + char + val.slice(pos);
            inputText.selectionStart = inputText.selectionEnd = pos + 1;
            inputText.focus();
            translate();
        };

        item.addEventListener('click', insertChar);
        item.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                insertChar();
            }
        });

        referenceGrid.appendChild(item);
    });
}

btnToggleRef.addEventListener('click', () => {
    const isOpen = !referenceGrid.hidden;
    referenceGrid.hidden = isOpen;
    btnToggleRef.querySelector('span').textContent = isOpen ? 'Show Chart' : 'Hide Chart';
    btnToggleRef.classList.toggle('open', !isOpen);
    btnToggleRef.setAttribute('aria-expanded', String(!isOpen));
    referenceHeader.classList.toggle('open', !isOpen);
});

// =============================================
// Real-time Translation
// =============================================
inputText.addEventListener('input', translate);

// =============================================
// Initialize
// =============================================
buildReferenceChart();
updateCharCounter(0);
