import os
from icrawler.builtin import GoogleImageCrawler

# dataset_dir = "cleanliness_dataset"
# os.makedirs(dataset_dir, exist_ok=True)

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

dataset_dir = os.path.join(base_dir, "cleanliness_dataset")
os.makedirs(dataset_dir, exist_ok=True)

keywords1 = [
    "clean urban street india",
    "dirty urban street garbage india",
    "clean village road india",
    "dirty village street garbage india",
    "garbage dump roadside india",
    "street sanitation india",
    "rural sanitation india",
    "urban waste pollution india"
]

keywords2 = [

    # Clean urban
    "clean urban street india",
    "clean city road india daylight",
    "well maintained street india",
    "clean residential area india",
    "clean public area india",

    # Dirty urban
    "dirty urban street garbage india",
    "city street litter india",
    "garbage on roadside india",
    "urban waste pollution india",
    "overflowing dustbin street india",

    # Clean rural
    "clean village road india",
    "clean rural street india",
    "well maintained village surroundings india",
    "clean rural residential area india",

    # Dirty rural
    "dirty village street garbage india",
    "rural garbage dump india",
    "village waste pollution india",
    "unsanitary rural area india",

    # Garbage specific
    "garbage dump roadside india",
    "open garbage landfill india",
    "street garbage pile india",
    "plastic waste roadside india",

    # Mixed realism
    "public place cleanliness india",
    "street sanitation india",
    "environment cleanliness india",
    "urban sanitation india",
    "rural sanitation india"
]

images_per_keyword = 300

for keyword in keywords2:
    
    folder_name = keyword.replace(" ", "_")
    folder_path = os.path.join(dataset_dir, folder_name)
    
    os.makedirs(folder_path, exist_ok=True)
    
    print(f"Downloading: {keyword}")
    
    crawler = GoogleImageCrawler(storage={'root_dir': folder_path})
    
    crawler.crawl(
        keyword=keyword,
        max_num=images_per_keyword
    )

print("Download complete.")