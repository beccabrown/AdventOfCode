#!/usr/bin/env python3

conditions = {
    "A": {"X": 4, "Y": 8, "Z": 3},
    "B": {"X": 1, "Y": 5, "Z": 9},
    "C": {"X": 7, "Y": 2, "Z": 6},
}

total_winnings = 0

with open("data.txt") as f:
    lines = f.readlines()
    for line in lines:
        [column_1, column_2] = line.split()
        total_winnings += conditions[column_1][column_2]

print(total_winnings)

new_total_winnings = 0
new_conditions = {
    "A": {"X": 3, "Y": 4, "Z": 8},
    "B": {"X": 1, "Y": 5, "Z": 9},
    "C": {"X": 2, "Y": 6, "Z": 7},
}

with open("data.txt") as f:
    lines = f.readlines()
    for line in lines:
        [column_1, column_2] = line.split()
        new_total_winnings += new_conditions[column_1][column_2]

print(new_total_winnings)
