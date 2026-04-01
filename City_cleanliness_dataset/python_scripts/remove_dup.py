import os
import hashlib
from tqdm import tqdm
from PIL import Image
import matplotlib.pyplot as plt

dataset_dir = "/home/venom/Documents/CSE/CSE_y3s2/Mini_Project/City-Cleanliness-Assessment-System/City_cleanliness_dataset/cleanliness_dataset"

review_folder = os.path.join(dataset_dir, "manual_review")
os.makedirs(review_folder, exist_ok=True)

hashes = {}
duplicates = []

print("🔍 Scanning for exact duplicates (SHA256)...\n")

def get_file_hash(path):
    hasher = hashlib.sha256()
    with open(path, 'rb') as f:
        while chunk := f.read(8192):
            hasher.update(chunk)
    return hasher.hexdigest()

# Step 1: Detect exact duplicates
for root, dirs, files in os.walk(dataset_dir):
    for file in tqdm(files):
        if file.lower().endswith(('.png', '.jpg', '.jpeg')):
            path = os.path.join(root, file)

            try:
                file_hash = get_file_hash(path)

                if file_hash in hashes:
                    duplicates.append((path, hashes[file_hash]))
                else:
                    hashes[file_hash] = path

            except Exception as e:
                print("Error reading:", path, e)

total = len(duplicates)
print(f"\n✅ Found {total} exact duplicate candidates.\n")

# Step 2: Interactive Review
for idx, (dup_path, original_path) in enumerate(duplicates, start=1):

    print("\n" + "="*60)
    print(f"Duplicate {idx} / {total}")
    print("Duplicate :", dup_path)
    print("Original  :", original_path)

    dup_class = os.path.basename(os.path.dirname(dup_path))
    orig_class = os.path.basename(os.path.dirname(original_path))

    print(f"Duplicate Class: {dup_class}")
    print(f"Original Class : {orig_class}")

    try:
        img1 = Image.open(original_path)
        img2 = Image.open(dup_path)

        # Display side-by-side
        plt.figure(figsize=(10, 5))

        plt.subplot(1, 2, 1)
        plt.imshow(img1)
        plt.title("Original")
        plt.axis("off")

        plt.subplot(1, 2, 2)
        plt.imshow(img2)
        plt.title("Duplicate")
        plt.axis("off")

        plt.tight_layout()
        plt.show()

    except Exception as e:
        print("Error displaying image:", e)

    choice = input("\n[d] Delete  |  [k] Keep  |  [m] Move to review  |  [q] Quit : ").lower()

    if choice == 'd':
        os.remove(dup_path)
        print("🗑 Deleted.")

    elif choice == 'm':
        new_path = os.path.join(review_folder, os.path.basename(dup_path))
        os.rename(dup_path, new_path)
        print("📁 Moved to manual_review.")

    elif choice == 'q':
        print("⛔ Stopping review.")
        break

    else:
        print("✔ Kept.")

print("\n🎯 Duplicate review completed.")