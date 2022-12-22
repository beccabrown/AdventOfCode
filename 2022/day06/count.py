#!/usr/bin/env python3

with open("data.txt") as f:
    lines = f.readlines()
    chars = []
    for line in lines:
        characters = list(line)
        i = 0
        for char in characters:
            chars.append(char)
            i += 1
            if len(chars) > 4:
                chars.pop(0)
            if len(set(chars)) == len(chars) and len(chars) == 4:
                # marker
                break
print(chars, i)

with open("data.txt") as f:
    lines = f.readlines()
    chars = []
    for line in lines:
        characters = list(line)
        i = 0
        for char in characters:
            chars.append(char)
            i += 1
            if len(chars) > 14:
                chars.pop(0)
            if len(set(chars)) == len(chars) and len(chars) == 14:
                # marker
                break
print(chars, i)
