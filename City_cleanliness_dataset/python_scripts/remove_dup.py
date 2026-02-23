import os
from PIL import Image
import imagehash
from tqdm import tqdm

dataset_dir = "cleanliness_dataset"

hashes = {}
duplicates = []

print("Checking duplicates...")

for root, dirs, files in os.walk(dataset_dir):
    
    for file in tqdm(files):
        
        if file.lower().endswith(('.png', '.jpg', '.jpeg')):
            
            path = os.path.join(root, file)
            
            try:
                image = Image.open(path)
                
                # Compute perceptual hash
                hash_value = imagehash.phash(image)
                
                if hash_value in hashes:
                    duplicates.append(path)
                else:
                    hashes[hash_value] = path
                    
            except:
                print("Error reading:", path)

# Delete duplicates
print(f"Found {len(duplicates)} duplicates")

for dup in duplicates:
    os.remove(dup)

print("Duplicates removed.")