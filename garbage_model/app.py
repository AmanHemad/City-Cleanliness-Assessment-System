from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
import base64

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("best.pt")


# 🔥 Adaptive color based on background
def get_contrasting_color(img, x1, y1, x2, y2):
    roi = img[y1:y2, x1:x2]

    if roi.size == 0:
        return (255, 255, 255)

    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    brightness = np.mean(gray)

    return (255, 255, 255) if brightness < 127 else (0, 0, 0)


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        np_img = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        if img is None:
            return JSONResponse(content={"error": "Invalid image"}, status_code=400)

        h, w, _ = img.shape

        # 🔥 Adaptive scaling
        scale = min(w, h)
        font_scale = max(0.4, scale / 1000)
        box_thickness = max(1, int(scale / 300))
        text_thickness = max(1, int(scale / 500))

        # Predict
        results = model.predict(img, conf=0.25)
        r = results[0]

        box_count = len(r.boxes)
        boxes_data = []

        # 🔥 Grid
        grid_size = 6
        cell_w = w // grid_size
        cell_h = h // grid_size
        grid = [[0]*grid_size for _ in range(grid_size)]

        total_conf = 0

        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])
            total_conf += conf

            boxes_data.append({
                "box": [x1, y1, x2, y2],
                "confidence": conf
            })

            # Grid update
            for i in range(x1 // cell_w, min(grid_size, x2 // cell_w + 1)):
                for j in range(y1 // cell_h, min(grid_size, y2 // cell_h + 1)):
                    grid[j][i] = 1

            # Adaptive color
            color = get_contrasting_color(img, x1, y1, x2, y2)

            label = f"problem {conf:.2f}"

            # Draw box
            cv2.rectangle(img, (x1, y1), (x2, y2), color, box_thickness)

            # Text size
            (tw, th), _ = cv2.getTextSize(
                label,
                cv2.FONT_HERSHEY_SIMPLEX,
                font_scale,
                text_thickness
            )

            # Background rectangle
            cv2.rectangle(
                img,
                (x1, y1 - th - 6),
                (x1 + tw, y1),
                color,
                -1
            )

            # Text color opposite
            text_color = (0, 0, 0) if color == (255, 255, 255) else (255, 255, 255)

            cv2.putText(
                img,
                label,
                (x1, y1 - 3),
                cv2.FONT_HERSHEY_SIMPLEX,
                font_scale,
                text_color,
                text_thickness
            )

        # Coverage
        coverage_cells = sum(sum(row) for row in grid)
        coverage = coverage_cells / (grid_size * grid_size)

        # Confidence
        avg_conf = total_conf / max(1, box_count)

        # Spread
        spread_score = min(1, box_count / 10)

        # Final score
        cleanliness_score = 100 - (
            0.6 * coverage +
            0.3 * spread_score +
            0.1 * avg_conf
        ) * 100

        cleanliness_score = max(0, round(cleanliness_score, 2))

        # Condition
        if cleanliness_score >= 80:
            condition = "Clean"
            severity = "Low"
        elif cleanliness_score >= 50:
            condition = "Moderate"
            severity = "Medium"
        elif cleanliness_score >= 20:
            condition = "Dirty"
            severity = "High"
        else:
            condition = "Very Dirty"
            severity = "Critical"

        # 🔥 Show score on image (adaptive)
        cv2.putText(
            img,
            f"Score: {cleanliness_score}",
            (20, int(40 * font_scale + 20)),
            cv2.FONT_HERSHEY_SIMPLEX,
            font_scale * 1.2,
            (255, 255, 255),
            text_thickness + 1
        )

        # Encode image
        _, buffer = cv2.imencode(".jpg", img)
        img_base64 = base64.b64encode(buffer).decode("utf-8")

        return {
            "image": img_base64,
            "cleanliness_score": cleanliness_score,
            "condition": condition,
            "severity": severity,
            "coverage": round(coverage, 3),
            "total_boxes": box_count,
            "avg_confidence": round(avg_conf, 3),
            "boxes": boxes_data
        }

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)