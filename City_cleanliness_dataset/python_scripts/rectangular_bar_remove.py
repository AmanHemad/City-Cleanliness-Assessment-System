import cv2
import numpy as np
import os

input_folder = "exp_data"
output_folder = "clean_dataset"

os.makedirs(output_folder, exist_ok=True)


def detect_bottom_bar(img):

    h, w = img.shape[:2]

    # examine bottom 25% of image
    bottom_region = img[int(h*0.75):h, :]

    gray = cv2.cvtColor(bottom_region, cv2.COLOR_BGR2GRAY)

    # detect edges
    edges = cv2.Canny(gray, 50, 150)

    # count horizontal edges
    horizontal_edges = np.sum(edges[:, :] > 0)

    edge_density = horizontal_edges / edges.size

    # watermark bars typically have text/edges
    if edge_density > 0.02:
        return True

    return False


def crop_bar(img):

    h, w = img.shape[:2]

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # detect horizontal edges across whole image
    edges = cv2.Canny(gray, 50, 150)

    # sum edges row-wise
    row_sum = np.sum(edges, axis=1)

    # find strongest horizontal boundary near bottom
    search_start = int(h * 0.70)

    boundary = np.argmax(row_sum[search_start:]) + search_start

    cropped = img[:boundary, :]

    return cropped


for file in os.listdir(input_folder):

    path = os.path.join(input_folder, file)

    img = cv2.imread(path)

    if img is None:
        continue

    if detect_bottom_bar(img):

        print(f"Bottom bar detected → cropping: {file}")

        img = crop_bar(img)

    else:

        print(f"No bottom bar: {file}")

    cv2.imwrite(os.path.join(output_folder, file), img)


print("Finished processing dataset.")