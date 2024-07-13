import random
import json
import os

def load_file(filename):
    script_dir = os.path.dirname(__file__)
    file_path = os.path.join(script_dir, filename)
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def generate_name(gender):
    if gender == 'Male':
        first_names = load_file('first_names_m.json')
    elif gender == 'Female':
        first_names = load_file('first_names_f.json')
    else:
        first_names_m = load_file('first_names_m.json')
        first_names_f = load_file('first_names_f.json')
        first_names = first_names_m + first_names_f
    last_names = load_file('last_names.json')
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    return f"{first_name} {last_name}"

def generate_character(character_id, color, department, job):
    genders = ['Male', 'Female', 'Non-binary']
    ages = range(22, 66)
    cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']
    personality_traits = [
        'Introverted', 'Extroverted', 'Optimistic', 'Pessimistic', 
        'Serious', 'Playful', 'Empathetic', 'Logical'
    ]
    gender = random.choice(genders)
    character = {
        'Id': character_id,
        'Name': generate_name(gender),
        'Gender': gender,
        'Age': random.choice(ages),
        'Trust': random.randint(1, 100),
        'Rapport': random.randint(1, 100),
        'Friendliness': random.randint(1, 100),
        'Location': random.choice(cities),
        'Personality Traits': random.sample(personality_traits, k=2),
        'Department': department,
        'Job': job,
        'Color': color,
        'Gossip': [],
        'BestFriend': False,
        'CodeName': ''
    }

    return character

def print_character(character):
    print("Character Profile:")
    for key, value in character.items():
        if isinstance(value, list):
            print(f"{key}: {', '.join(value)}")
        else:
            print(f"{key}: {value}")

def save_characters_to_json(characters, filename='characters.json'):
    if os.path.exists(filename):
        try:
            with open(filename, 'r') as file:
                data = json.load(file)
        except json.JSONDecodeError:
            data = []
        else:
            data = []
    else:
        data = []
    
    data.extend(characters)
    
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4)

if __name__ == '__main__':
    jobs = load_file('jobs.json')
    colors = ['#9e0059', '#390099', '#ffbd00', '#ff5400', '#ff0054', '#6C0079', '#579C4C']
    color_iter = iter(colors)
    
    characters = []
    for job_entry in jobs:
        color = next(color_iter, random.choice(colors))
        character = generate_character(len(characters), color, job_entry['department'], job_entry['job'])
        characters.append(character)
    
    sorted_characters = sorted(characters, key=lambda x: x['Name'])
    for i, character in enumerate(sorted_characters):
        character['Id'] = i
        print_character(character)
    for character in sorted_characters:
        print_character(character)
    
    save_characters_to_json(sorted_characters)
