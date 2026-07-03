"""
Morse Code Converter — CLI
Day 82 of 100 Days of Code
Author: Param Sangani
"""

# =============================================
# Morse Code Dictionary (Extended)
# =============================================
MORSE_CODE_DICT = {
    'a': '.-',    'b': '-...',  'c': '-.-.',  'd': '-..',
    'e': '.',     'f': '..-.',  'g': '--.',   'h': '....',
    'i': '..',    'j': '.---',  'k': '-.-',   'l': '.-..',
    'm': '--',    'n': '-.',    'o': '---',   'p': '.--.',
    'q': '--.-',  'r': '.-.',   's': '...',   't': '-',
    'u': '..-',   'v': '...-',  'w': '.--',   'x': '-..-',
    'y': '-.--',  'z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
    '!': '-.-.--', '/': '-..-.', '(': '-.--.',  ')': '-.--.-',
    '&': '.-...',  ':': '---...', ';': '-.-.-.',  '=': '-...-',
    '+': '.-.-.',  '-': '-....-', '_': '..--.-',  '"': '.-..-.',
    '$': '...-..-','@': '.--.-.'
}

# Reverse dictionary: Morse → English
REVERSE_MORSE_CODE_DICT = {code: char for char, code in MORSE_CODE_DICT.items()}


def text_to_morse(text: str) -> str:
    """Convert English text to Morse code."""
    text = text.lower()
    parts = []
    for char in text:
        if char == ' ':
            if parts and parts[-1] != '/':
                parts.append('/')
        elif char in MORSE_CODE_DICT:
            parts.append(MORSE_CODE_DICT[char])
    # Remove trailing word separator
    while parts and parts[-1] == '/':
        parts.pop()
    return ' '.join(parts)


def morse_to_text(morse: str) -> str:
    """Convert Morse code to English text."""
    words = morse.strip().split('/')
    decoded_words = []
    for word in words:
        codes = word.strip().split()
        decoded_word = ''.join(
            REVERSE_MORSE_CODE_DICT.get(code, '?') for code in codes if code
        )
        if decoded_word:
            decoded_words.append(decoded_word)
    return ' '.join(decoded_words).upper()


def display_banner():
    """Display a welcome banner."""
    print("\n" + "=" * 50)
    print("   ✦  MORSE CODE CONVERTER  ✦")
    print("   Day 82 of 100 Days of Code")
    print("   by Param Sangani")
    print("=" * 50)


def display_menu():
    """Display the mode selection menu."""
    print("\nSelect mode:")
    print("  [1] English → Morse Code")
    print("  [2] Morse Code → English")
    print("  [3] Exit")
    return input("\nYour choice: ").strip()


def main():
    display_banner()

    while True:
        choice = display_menu()

        if choice == '1':
            text = input("\nEnter English text: ")
            if not text.strip():
                print("  ⚠  No input provided.")
                continue
            result = text_to_morse(text)
            if result:
                print(f"\n  Original : {text}")
                print(f"  Morse    : {result}")
            else:
                print("  ⚠  No translatable characters found.")

        elif choice == '2':
            print("  (Use spaces between letters, / between words)")
            morse = input("Enter Morse code : ")
            if not morse.strip():
                print("  ⚠  No input provided.")
                continue
            result = morse_to_text(morse)
            print(f"\n  Morse    : {morse}")
            print(f"  English  : {result}")

        elif choice == '3':
            print("\nGoodbye! Keep coding! 🚀\n")
            break

        else:
            print("  ⚠  Invalid choice. Please enter 1, 2, or 3.")


if __name__ == "__main__":
    main()
