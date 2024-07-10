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
    defining_features = load_file('defining_features.json')
    builds = ['Slim', 'Athletic', 'Average', 'Muscular', 'Stocky', 'Curvy']
    ages = range(22, 66)
    hair_styles = [
        'Short and neat', 'Long and wavy', 'Curly', 'Bald', 'Pixie cut', 
        'Ponytail', 'Buzz cut', 'Braided', 'Shaved sides', 'Afro', 'Unkempt'
    ]
    clothing_styles = [
        'Business formal', 'Business casual', 'Casual', 'Trendy', 'Bohemian', 
        'Vintage', 'Preppy', 'Sporty', 'Goth', 'Hipster'
    ]
    cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']
    
    personality_traits = [
        'Introverted', 'Extroverted', 'Optimistic', 'Pessimistic', 
        'Serious', 'Playful', 'Empathetic', 'Logical'
    ]
    
    gender = random.choice(genders)
    defining_features_list = random.sample(defining_features, k=random.randint(1, 3))
    if gender == 'Female' and 'Has a beard' in defining_features_list:
        defining_features_list.remove('Has a beard')

    character = {
        'Id': character_id,
        'Name': generate_name(gender),
        'Gender': gender,
        # 'Ethnic Background': random.choice(load_file('ethnic_backgrounds.json')),
        'Build': random.choice(builds),
        'Age': random.choice(ages),
        'Hair Style': random.choice(hair_styles),
        'Clothing': random.choice(clothing_styles),
        'Defining Features': defining_features_list,
        'Trust': random.randint(1, 100),
        'Rapport': random.randint(1, 100),
        'Friendliness': random.randint(1, 100),
        'Location': random.choice(cities),
        'Personality Traits': random.sample(personality_traits, k=2),
        # 'Quirk': random.choice(load_file('quirks.json')),
        # 'Favorite Book': random.sample(load_file('books.json'), k=2),
        # 'Favorite Food': random.choice(load_file('food.json')),
        # 'Hobbies': random.choice(load_file('hobbies.json')),
        'Department': department,
        'Job': job,
        # 'Favorite Movie': random.sample(load_file('movies.json'), k=3),
        # 'Favorite Music': random.sample(load_file('music.json'), k=3),
        # 'Favorite TV Show': random.sample(load_file('tv.json'), k=2),
        'Color': color,
        'Gossip': []
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
