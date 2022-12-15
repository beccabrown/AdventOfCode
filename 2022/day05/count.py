#!/usr/bin/env python3

with open("data.txt") as f:
    lines = f.readlines()
    stacks = []
    padded_list = []
    for line in lines:
        indices = [i for i, x in enumerate(line) if x == "["]
        if len(indices):
            crates_in_row = [None] * ((indices[len(indices) - 1] // 4) + 1)
            for index in indices:
                # each stack is 4 wide
                crate_in_row = index // 4
                crates_in_row[crate_in_row] = line[index + 1]
            stacks.append(crates_in_row.copy())
            crates_in_row.clear()
        if all(strings.isdigit() for strings in line.split()) and len(line.split()):
            number_of_stacks = len(line.split())
            for stack in stacks:
                padded_list.append(stack + [None] * (number_of_stacks - len(stack)))
        # begin instructions
        elif line.startswith("move"):
            instruction = line.split()[1::2]
            move, from_stack, to_stack = list(map(int, instruction))
            for _ in range(move):
                top_container_to_move = None
                level_to_check = 0
                while top_container_to_move == None:
                    top_container_to_move = padded_list[level_to_check][from_stack - 1]
                    level_to_check += 1
                new_level_to_check = len(padded_list)
                top_container_in_to_stack = "foo"
                while top_container_in_to_stack != None:
                    try:
                        top_container_in_to_stack = padded_list[new_level_to_check - 1][
                            to_stack - 1
                        ]
                        new_level_to_check -= 1
                    except IndexError:
                        # stack is full, add another level
                        padded_list.insert(0, [None] * number_of_stacks)
                        new_level_to_check = 0
                        # coz we added another layer, index needs increasing
                        level_to_check += 1
                        break
                padded_list[new_level_to_check][to_stack - 1] = padded_list[
                    level_to_check - 1
                ][from_stack - 1]
                padded_list[level_to_check - 1][from_stack - 1] = None
    final_code = []
    for index in range(len(padded_list)):
        code = padded_list[len(padded_list) - index - 1]
        if final_code == []:
            final_code = code.copy()
        else:
            position = 0
            for letter in code:
                if letter:
                    final_code[position] = letter
                position += 1
    print("".join(final_code))

# PART 2

with open("data.txt") as f:
    lines = f.readlines()
    stacks = []
    padded_list = []
    for line in lines:
        indices = [i for i, x in enumerate(line) if x == "["]
        if len(indices):
            crates_in_row = [None] * ((indices[len(indices) - 1] // 4) + 1)
            for index in indices:
                # each stack is 4 wide
                crate_in_row = index // 4
                crates_in_row[crate_in_row] = line[index + 1]
            stacks.append(crates_in_row.copy())
            crates_in_row.clear()
        if all(strings.isdigit() for strings in line.split()) and len(line.split()):
            number_of_stacks = len(line.split())
            for stack in stacks:
                padded_list.append(stack + [None] * (number_of_stacks - len(stack)))
        # begin instructions
        elif line.startswith("move"):
            instruction = line.split()[1::2]
            move, from_stack, to_stack = list(map(int, instruction))
            containers_to_move = []
            level_to_check = 0
            while len(containers_to_move) != move:
                top_container_to_move = None
                while top_container_to_move == None:
                    top_container_to_move = padded_list[level_to_check][from_stack - 1]
                    level_to_check += 1
                containers_to_move.append(level_to_check)
            target_container_locations = []
            new_level_to_check = len(padded_list)
            while len(target_container_locations) != move:
                top_container_in_to_stack = "foo"
                flag = False
                while top_container_in_to_stack != None:
                    top_container_in_to_stack = padded_list[new_level_to_check - 1][
                        to_stack - 1
                    ]
                    new_level_to_check -= 1
                    if new_level_to_check < 0 and top_container_in_to_stack != None:
                        # stack is full, add another level
                        padded_list.insert(0, [None] * number_of_stacks)
                        # coz we added another layer, indexes needs increasing
                        containers_to_move = list(
                            map(lambda i: i + 1, containers_to_move)
                        )
                        target_container_locations = list(
                            map(lambda i: i + 1, target_container_locations)
                        )
                        target_container_locations.insert(0, 0)
                        flag = True
                        break
                if not flag:
                    target_container_locations.insert(0, new_level_to_check)
            for i in range(len(containers_to_move)):
                padded_list[
                    target_container_locations[len(target_container_locations) - i - 1]
                ][to_stack - 1] = padded_list[
                    containers_to_move[len(containers_to_move) - i - 1] - 1
                ][
                    from_stack - 1
                ]
                padded_list[containers_to_move[len(containers_to_move) - i - 1] - 1][
                    from_stack - 1
                ] = None
    final_code = []
    for index in range(len(padded_list)):
        code = padded_list[len(padded_list) - index - 1]
        if final_code == []:
            final_code = code.copy()
        else:
            position = 0
            for letter in code:
                if letter:
                    final_code[position] = letter
                position += 1
    print("".join(final_code))
