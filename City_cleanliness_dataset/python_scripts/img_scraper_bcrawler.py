import os
from icrawler.builtin import BingImageCrawler
from tqdm import tqdm

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

<<<<<<< HEAD

images_per_keyword = 200

for keyword in keywords2:
    folder_name = keyword.replace(" ", "_")
    folder_path = os.path.join(dataset_dir, folder_name)

    os.makedirs(folder_path, exist_ok=True)

    print(f"Downloading: {keyword}")

    crawler = BingImageCrawler(storage={'root_dir': folder_path})

    crawler.crawl(
        keyword=keyword,
        max_num=images_per_keyword
    )
=======
keys_main = [
    "plastic_waste",
    "paper_waste",
    "metal_waste",
    "glass_waste",
    "food_waste",
    "bottle",
    "packaging_waste",
    "disposable_items",
    "garbage_bag",
    "trash_pile",
    "dustbin_overflow",
    "pothole",
    "sewage",
    "dirty_water",
    "dustbin"
]

main_keys_keywords = { 
"plastic_waste" : [
    "plastic litter on street",
    "plastic waste roadside pile",
    "plastic wrappers scattered ground",
    "plastic trash roadside dump",
    "plastic garbage pile street corner",
    "discarded plastic packaging litter",
    "plastic waste in public area",
    "plastic trash scattered pavement",
    "plastic garbage dumped roadside",
    "plastic litter near dustbin",
    "plastic waste ground pollution",
    "plastic bottles and plastic litter street",
    "plastic trash pile near garbage bin",
    "plastic waste accumulation roadside",
    "plastic garbage street pollution",
    "plastic litter urban sidewalk",
    "plastic trash scattered roadside",
    "plastic waste dumping public place",
    "plastic garbage heap roadside",
    "plastic litter city street ground"
],
"paper_waste" : [
    "paper litter on street",
    "crumpled paper trash roadside",
    "paper garbage scattered pavement",
    "paper waste roadside pile",
    "discarded newspapers litter street",
    "paper trash pile public place",
    "paper waste scattered ground",
    "paper garbage near dustbin",
    "paper litter city sidewalk",
    "paper trash roadside dumping",
    "paper waste urban pollution",
    "paper garbage pile street corner",
    "discarded cardboard litter ground",
    "paper trash scattered roadside",
    "paper waste accumulation pavement",
    "paper litter public street area",
    "paper garbage near garbage bin",
    "paper waste dumped roadside",
    "paper trash urban sidewalk",
    "paper litter street pollution"
],

"metal_waste" : [
    "metal scrap roadside waste",
    "discarded metal cans litter street",
    "metal junk pile roadside",
    "rusted metal garbage heap",
    "scrap metal waste ground",
    "metal trash roadside dumping",
    "discarded tin cans litter pavement",
    "metal garbage near dustbin",
    "metal scrap waste street corner",
    "rusty metal junk roadside",
    "metal debris litter ground",
    "metal waste scattered pavement",
    "metal scrap trash pile",
    "discarded metal containers garbage",
    "metal waste roadside pollution",
    "rusted metal trash urban street",
    "metal scrap accumulation roadside",
    "metal junk pile public place",
    "discarded metal litter sidewalk",
    "metal garbage street pollution"
],

"glass_waste" : [
    "broken glass litter street",
    "glass bottle shards pavement",
    "broken glass trash roadside",
    "glass fragments scattered ground",
    "glass bottle pieces litter sidewalk",
    "glass trash pile roadside",
    "broken glass near dustbin",
    "glass waste pavement pollution",
    "glass fragments roadside dumping",
    "shattered glass litter street",
    "broken bottles garbage ground",
    "glass debris roadside waste",
    "glass shards scattered pavement",
    "glass waste near garbage bin",
    "broken glass pollution sidewalk",
    "glass fragments urban street",
    "shattered glass trash pile",
    "glass waste dumped roadside",
    "broken bottle pieces litter ground",
    "glass trash scattered street"
],

"food_waste" : [
    "food waste dumped street",
    "rotten food garbage pile",
    "food scraps litter roadside",
    "discarded food waste ground",
    "spoiled food trash street corner",
    "food waste near dustbin",
    "food garbage scattered pavement",
    "food waste public street pollution",
    "food scraps pile roadside",
    "rotten vegetables garbage ground",
    "food waste roadside dumping",
    "discarded food litter sidewalk",
    "spoiled food waste near trash bin",
    "food waste urban street pollution",
    "food scraps scattered ground",
    "rotten food trash pile",
    "food garbage dumped roadside",
    "food waste litter public place",
    "discarded fruit waste roadside",
    "food scraps near garbage bin"
],

"bottle" : [
    "plastic bottles litter street",
    "empty bottles roadside waste",
    "discarded bottles garbage pile",
    "drink bottles scattered pavement",
    "bottle trash roadside dumping",
    "empty plastic bottles litter ground",
    "bottles garbage near dustbin",
    "discarded drink bottles sidewalk",
    "plastic bottle litter urban street",
    "bottle trash pile roadside",
    "empty bottles scattered ground",
    "used bottles garbage pile",
    "plastic bottles waste roadside",
    "discarded soda bottles litter",
    "bottle waste near garbage bin",
    "drink bottles trash pavement",
    "plastic bottle trash street corner",
    "bottle litter public place",
    "empty bottle garbage roadside",
    "bottle waste street pollution"
],

"packaging_waste" : [
    "plastic packaging litter street",
    "food wrappers garbage ground",
    "packaging waste roadside pile",
    "discarded packaging trash pavement",
    "plastic wrappers litter sidewalk",
    "packaging waste near dustbin",
    "wrappers trash pile roadside",
    "packaging garbage street corner",
    "plastic packaging pollution ground",
    "discarded packaging waste roadside",
    "packaging litter public place",
    "wrappers garbage scattered street",
    "plastic packaging trash pile",
    "food packaging waste roadside",
    "packaging litter urban sidewalk",
    "discarded plastic packaging garbage",
    "wrappers waste near garbage bin",
    "packaging trash dumped roadside",
    "packaging garbage scattered ground",
    "plastic packaging street pollution"
],

"disposable_items" : [
    "disposable cups litter street",
    "used disposable plates roadside",
    "single use plastic litter pavement",
    "disposable items garbage pile",
    "plastic cups trash ground",
    "disposable utensils litter sidewalk",
    "used disposable cups roadside",
    "disposable waste near dustbin",
    "single use items garbage pile",
    "disposable tableware trash ground",
    "plastic plates litter street",
    "disposable items roadside dumping",
    "used disposable plates garbage",
    "disposable plastic trash pavement",
    "single use cups litter ground",
    "disposable waste scattered street",
    "disposable tableware roadside waste",
    "used plastic cutlery litter",
    "disposable items trash pile",
    "single use plastic garbage roadside"
],

"garbage_bag" : [
    "black garbage bags roadside",
    "garbage bags piled street",
    "overflowing garbage bags ground",
    "trash bags roadside dump",
    "garbage bag pile street corner",
    "plastic trash bags roadside",
    "garbage bags near dustbin",
    "garbage bags scattered pavement",
    "black trash bags roadside waste",
    "garbage bags dumping public place",
    "garbage bag heap street",
    "trash bags garbage pile",
    "garbage bags roadside pollution",
    "overflowing trash bags near bin",
    "garbage bags accumulation roadside",
    "trash bags dumped pavement",
    "garbage bags litter sidewalk",
    "black trash bags street corner",
    "garbage bag waste roadside",
    "trash bags ground pollution"
],

"trash_pile" : [
    "garbage pile roadside",
    "trash heap street corner",
    "street garbage dump pile",
    "mixed trash pile ground",
    "public trash dumping pile",
    "garbage heap roadside",
    "trash mound pavement",
    "garbage pile near dustbin",
    "trash accumulation roadside",
    "street dumping garbage pile",
    "urban trash heap ground",
    "garbage pile public street",
    "trash mound roadside waste",
    "mixed garbage pile pavement",
    "street waste heap corner",
    "trash dumping roadside pile",
    "garbage accumulation ground",
    "street garbage mound",
    "trash pile urban pollution",
    "garbage heap sidewalk"
],

"dustbin_overflow" : [
    "overflowing dustbin garbage",
    "trash bin overflow street",
    "dustbin garbage spilling out",
    "overflowing trash can litter",
    "garbage overflowing bin roadside",
    "overfilled dustbin garbage pile",
    "dustbin overflow public street",
    "garbage bin overflowing pavement",
    "trash bin garbage spill street",
    "overflowing garbage bin sidewalk",
    "dustbin waste spilling ground",
    "public bin overflowing garbage",
    "trash can overflowing waste",
    "garbage bin overflow roadside",
    "dustbin waste pile overflow",
    "overflowing street dustbin trash",
    "garbage spill from dustbin",
    "public dustbin garbage overflow",
    "overfilled garbage container street",
    "dustbin overflow pollution"
],
"pothole" : [
    "pothole damaged road closeup",
    "water filled pothole road",
    "large pothole asphalt road",
    "broken road pothole street",
    "deep pothole city road",
    "pothole on urban street",
    "pothole damage asphalt pavement",
    "road pothole filled with water",
    "large pothole traffic road",
    "broken asphalt pothole city",
    "pothole road surface damage",
    "pothole urban road hazard",
    "deep pothole street pavement",
    "damaged road pothole closeup",
    "pothole cracked asphalt street",
    "road pothole urban infrastructure",
    "pothole street safety hazard",
    "pothole asphalt road damage",
    "pothole on city pavement",
    "large pothole street closeup"
],
"sewage" : [
    "sewage water street overflow",
    "open sewage drain street",
    "sewage spill roadside drain",
    "dirty sewage flowing street",
    "sewage leak road drain",
    "sewage overflow public street",
    "sewage water puddle roadside",
    "open sewer drain street",
    "sewage water flooding road",
    "sewage spill pavement drain",
    "sewage leak urban road",
    "dirty sewer water street",
    "sewage drain overflow pavement",
    "sewage water pollution street",
    "open drain sewage roadside",
    "sewage flow roadside gutter",
    "sewer water leaking road",
    "sewage spill urban pavement",
    "dirty sewage roadside puddle",
    "sewage drainage overflow street"
],

"dirty_water" : [
    "dirty water puddle street",
    "stagnant dirty water road",
    "polluted water puddle roadside",
    "muddy water street puddle",
    "contaminated water roadside puddle",
    "dirty water flooding street",
    "polluted water puddle pavement",
    "stagnant water roadside pollution",
    "muddy water road flooding",
    "dirty water accumulation street",
    "contaminated water puddle sidewalk",
    "polluted street water puddle",
    "dirty water roadside gutter",
    "stagnant water street puddle",
    "muddy roadside water puddle",
    "polluted water street drain",
    "dirty water urban street",
    "contaminated puddle roadside",
    "dirty water pooling road",
    "polluted puddle pavement"
],

"dustbin" : [
    "public dustbin street garbage",
    "street trash bin closeup",
    "municipal dustbin roadside",
    "public garbage bin street",
    "dustbin with garbage waste",
    "public trash bin sidewalk",
    "street garbage container closeup",
    "municipal waste bin roadside",
    "public waste bin pavement",
    "dustbin urban street environment",
    "trash bin public place",
    "garbage container street corner",
    "public bin waste collection",
    "dustbin street infrastructure",
    "municipal trash bin pavement",
    "public garbage container roadside",
    "dustbin waste management street",
    "street waste bin close view",
    "public trash container urban street",
    "dustbin garbage disposal street"
]

}

for key in tqdm(main_keys_keywords.keys(),desc="Main Keys"):
    dataset_dir_for_key = os.path.join(dataset_dir,key)
    os.makedirs(dataset_dir_for_key, exist_ok=True)
    images_per_keyword = 50

    for keyword in tqdm(main_keys_keywords[key],desc=key):
        folder_name = keyword.replace(" ", "_")
        folder_path = os.path.join(dataset_dir_for_key, folder_name)

        os.makedirs(folder_path, exist_ok=True)

        print(f"Downloading: {keyword}")

        crawler = BingImageCrawler(storage={'root_dir': folder_path})

        crawler.crawl(
            keyword=keyword,
            max_num=images_per_keyword
        )
    
    print(f"Download complete for key:{key}")
>>>>>>> 20a9bbaeda5940567666d88112ef952e2d210fa7

print("Download complete.")