#!/usr/bin/env python3

number_of_containers = 0

with open("data.txt") as f:
    lines = f.readlines()
    for line in lines:
        [elf_1, elf_2] = line.split(",")
        [lower_x, upper_x], [lower_y, upper_y] = elf_1.split("-"), elf_2.split("-")
        elf_1_range = list(range(int(lower_x), int(upper_x) + 1))
        elf_2_range = list(range(int(lower_y), int(upper_y) + 1))
        if len(elf_1_range) > len(elf_2_range):
            overlap = [x for x in elf_2_range if x not in elf_1_range]
        else:
            overlap = [x for x in elf_1_range if x not in elf_2_range]
        if len(overlap) == 0:
            number_of_containers += 1

print(number_of_containers)

number_of_overlaps = 0

with open("data.txt") as f:
    lines = f.readlines()
    for line in lines:
        [elf_1, elf_2] = line.split(",")
        [lower_x, upper_x], [lower_y, upper_y] = elf_1.split("-"), elf_2.split("-")
        elf_1_range = list(range(int(lower_x), int(upper_x) + 1))
        elf_2_range = list(range(int(lower_y), int(upper_y) + 1))
        if len(elf_1_range) > len(elf_2_range):
            overlap = [x for x in elf_2_range if x not in elf_1_range]
        else:
            overlap = [x for x in elf_1_range if x not in elf_2_range]
        if len(overlap) != len(elf_1_range) and len(overlap) != len(elf_2_range):
            number_of_overlaps += 1

print(number_of_overlaps)
