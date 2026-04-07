import cv2
import numpy as np
import os
from tqdm import tqdm
from lama_cleaner.model_manager import ModelManager
from lama_cleaner.schema import Config

INPUT_FOLDER = "clean_dataset"
OUTPUT_FOLDER = "output_images_cleanest"

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# load AI model
model = ModelManager(name="lama", device="cpu")

config = Config(
    ldm_steps=20,
    hd_strategy="Resize",
)

def detect_diagonal_watermark_mask(image):

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # detect edges
    edges = cv2.Canny(gray, 40, 120)

    # detect lines
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, 120,
                            minLineLength=80,
                            maxLineGap=20)

    mask = np.zeros(gray.shape, dtype=np.uint8)

    if lines is not None:
        for line in lines:

            x1,y1,x2,y2 = line[0]

            angle = np.degrees(np.arctan2(y2-y1, x2-x1))

            # detect diagonal lines
            if 30 < abs(angle) < 70:

                cv2.line(mask,(x1,y1),(x2,y2),255,5)

    kernel = np.ones((5,5),np.uint8)
    mask = cv2.dilate(mask,kernel,iterations=3)

    return mask


def enhance_image(img):

    # edge preserving smoothing
    smooth = cv2.edgePreservingFilter(img, flags=1,
                                      sigma_s=60,
                                      sigma_r=0.4)

    # detail enhance
    detail = cv2.detailEnhance(smooth,
                               sigma_s=10,
                               sigma_r=0.15)

    # sharpen
    kernel = np.array([[0,-1,0],
                       [-1,5,-1],
                       [0,-1,0]])

    sharpen = cv2.filter2D(detail,-1,kernel)

    return sharpen


for file in tqdm(os.listdir(INPUT_FOLDER)):

    path = os.path.join(INPUT_FOLDER,file)

    img = cv2.imread(path)

    if img is None:
        continue

    # detect watermark
    mask = detect_diagonal_watermark_mask(img)

    # AI inpainting
    cleaned = model(img, mask, config)

    # restore quality
    restored = enhance_image(cleaned)

    output_path = os.path.join(OUTPUT_FOLDER,file)

    cv2.imwrite(output_path, restored)

print("Processing complete.")