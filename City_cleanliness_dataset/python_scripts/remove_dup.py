import os
from PIL import Image
import imagehash
from tqdm import tqdm

dataset_dir = "/home/venom/Documents/CSE/CSE_y3s2/Mini_Project/City-Cleanliness-Assessment-System/City_cleanliness_dataset/cleanliness_dataset"

hashes = {}
duplicates = []
threshold = 5  # adjust sensitivity

print("Checking duplicates...")

for root, dirs, files in os.walk(dataset_dir):
    for file in tqdm(files):
        if file.lower().endswith(('.png', '.jpg', '.jpeg')):
            path = os.path.join(root, file)

            try:
                image = Image.open(path).convert('RGB')
                hash_value = imagehash.phash(image)

                duplicate_found = False

                for existing_hash in hashes:
                    if abs(hash_value - existing_hash) <= threshold:
                        duplicates.append(path)
                        duplicate_found = True
                        break

                if not duplicate_found:
                    hashes[hash_value] = path

            except Exception as e:
                print("Error reading:", path, e)

print(f"Found {len(duplicates)} duplicates")

# ⚠️ Always print before deleting!
confirm = input("Delete duplicates? (y/n): ")

if confirm.lower() == 'y':
    for dup in duplicates:
        os.remove(dup)
    print("Duplicates removed.")
else:
    print("No files deleted.")