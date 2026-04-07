import requests
import base64

url = "http://127.0.0.1:8000/predict/"

# Image path
image_path = "/home/venom/Documents/CSE/CSE_y3s2/Mini_Project/City-Cleanliness-Assessment-System/City_cleanliness_dataset/cleanliness_dataset/city_street_litter_india/000009.jpg"

# Send request
with open(image_path, "rb") as f:
    files = {"file": f}
    response = requests.post(url, files=files)

data = response.json()

# Decode image
img_data = base64.b64decode(data["image"])

# Save output
with open("output.jpg", "wb") as f:
    f.write(img_data)

print("Saved output.jpg")
for k in data.keys():
    if k == "image":
        continue
    print(data[k])