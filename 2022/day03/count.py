#!/usr/bin/env python3
import string

total = 0

with open("data.txt") as f:
    lines = f.readlines()
    lowercase_letters = dict(zip(string.ascii_lowercase, range(1, 27)))
    uppercase_letters = dict(zip(string.ascii_uppercase, range(27, 53)))
    letters = lowercase_letters | uppercase_letters
    for line in lines:
        first_part, second_part = line[: len(line) // 2], line[len(line) // 2 :]
        for letter in string.ascii_letters:
            if (letter in first_part) and (letter in second_part):
                total += letters[letter]
                break

print(total)

new_total = 0

with open("data.txt") as f:
    lines = f.readlines()
    lowercase_letters = dict(zip(string.ascii_lowercase, range(1, 27)))
    uppercase_letters = dict(zip(string.ascii_uppercase, range(27, 53)))
    letters = lowercase_letters | uppercase_letters
    group_of_3_lines = []
    for line in lines:
        group_of_3_lines.append(line.strip())
        if len(group_of_3_lines) == 3:
            for letter in string.ascii_letters:
                if all(letter in stripped_line for stripped_line in group_of_3_lines):
                    new_total += letters[letter]
                    break
            group_of_3_lines.clear()

print(new_total)
