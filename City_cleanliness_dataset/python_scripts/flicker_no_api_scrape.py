from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import requests
import os
import hashlib

# 🔹 Ask user where to save images
base_path = input("Enter full path where images should be saved: ").strip()

if not os.path.exists(base_path):
    os.makedirs(base_path)

# 🔹 Keywords for dataset
keywords = [
    "city garbage",
    "street litter",
    "clean street",
    "dustbin overflow",
    "clean urban street india",
    "dirty urban street garbage india",
    "clean village road india",
    "dirty village street garbage india",
    "garbage dump roadside india",
    "street sanitation india",
    "rural sanitation india",
    "urban waste pollution india"
]

# 🔹 Chrome options
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")

driver = webdriver.Chrome(options=options)

# 🔹 SHA256 duplicate checker
def is_duplicate(image_content, folder):
    img_hash = hashlib.sha256(image_content).hexdigest()
    hash_file = os.path.join(folder, "hashes.txt")

    # If hash file exists, check duplicate
    if os.path.exists(hash_file):
        with open(hash_file, "r") as f:
            existing_hashes = f.read().splitlines()
            if img_hash in existing_hashes:
                return True

    # Otherwise append new hash
    with open(hash_file, "a") as f:
        f.write(img_hash + "\n")

    return False


for keyword in keywords:

    print(f"\n🔎 Searching for: {keyword}")

    folder_name = keyword.replace(" ", "_")
    keyword_folder = os.path.join(base_path, folder_name)
    os.makedirs(keyword_folder, exist_ok=True)

    search_url = f"https://www.flickr.com/search/?text={keyword.replace(' ', '%20')}"
    driver.get(search_url)

    time.sleep(5)

    # Scroll to load dynamic content
    for _ in range(3):
        driver.find_element(By.TAG_NAME, "body").send_keys(Keys.END)
        time.sleep(3)

    images = driver.find_elements(By.TAG_NAME, "img")

    count = 0

    for img in images:
        src = img.get_attribute("src")

        if src and "live.staticflickr.com" in src:

            try:
                img_data = requests.get(src, timeout=5).content

                if not is_duplicate(img_data, keyword_folder):

                    file_path = os.path.join(keyword_folder, f"{count}.jpg")

                    with open(file_path, "wb") as f:
                        f.write(img_data)

                    print(f"Downloaded: {file_path}")
                    count += 1

                if count >= 20:
                    break

            except:
                continue

    print(f"✅ Finished downloading for {keyword}")

driver.quit()
print("\n🎯 All downloads completed.")