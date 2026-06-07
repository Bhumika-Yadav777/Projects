import random

word_bank = ['hello', 'bye', 'welcome', 'funny', 'rhythm']

while True:
    word = random.choice(word_bank)
    word_length = len(word)
    attempts = 5

    print(f'\nNew word chosen! You have {attempts} attempts to guess it.')

    while attempts > 0:
        print('Current word: ' + ' '.join(['_'] * word_length))
        guess = input('Guess the word: ').strip().lower()

        if not guess.isalpha():
            print('Please enter only letters.')
            continue

        if guess == word:
            print('Congratulations! You guessed the word: ' + word)
            break

        attempts -= 1
        print('Wrong! Attempts left: ' + str(attempts))

    else:
        print('Game Over! The word was: ' + word)

    play_again = input('Do you want to play again? (yes/no): ').strip().lower()
    if play_again not in ('yes', 'y'):
        print('Thanks for playing!')
        break
