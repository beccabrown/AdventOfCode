#!/usr/bin/env python3

calorie_count_1 = 0
calorie_count_2 = 0
most_calories = 0
calories_per_elf = []

with open("data.txt") as f:
    lines = f.readlines()
    for line in lines:
        if line in ["\n", "\r", "\r\n"]:
            if calorie_count_1 > most_calories:
                most_calories = calorie_count_1
            calorie_count_1 = 0
        else:
            calorie_count_1 += int(line)

print(most_calories)

with open("data.txt") as f:
    lines = f.readlines()
    for line in lines:
        if line in ["\n", "\r", "\r\n"]:
            calories_per_elf.append(calorie_count_2)
            calorie_count_2 = 0
        else:
            calorie_count_2 += int(line)

calories_per_elf.sort(reverse=True)
print(calories_per_elf[0] + calories_per_elf[1] + calories_per_elf[2])
