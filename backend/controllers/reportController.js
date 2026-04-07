const Report = require("../models/Report");
const axios = require("axios");

// ─── Fetch image from Cloudinary and convert to base64 ──────────────────────
async function imageUrlToBase64(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const base64 = Buffer.from(response.data).toString("base64");
  const mimeType = response.headers["content-type"] || "image/jpeg";
  return { base64, mimeType };
}

// ─── Score image using Google Gemini (free tier) ─────────────────────────────
async function scoreImageWithGemini(imageUrl) {
  const { base64, mimeType } = await imageUrlToBase64(imageUrl);

  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: base64,
            },
          },
          {
            text: `You are a city cleanliness inspector AI. Analyze this image and rate the cleanliness/garbage situation.

Reply with ONLY a valid JSON object in this exact format (no extra text, no markdown, no code blocks):
{
  "mlScore": <integer 0-100, where 0=extremely dirty, 100=perfectly clean>,
  "condition": "<BAD|MODERATE|GOOD>",
  "reason": "<one concise sentence explaining what you see>"
}

Scoring guide:
- 0–40  -> BAD      (heavy garbage, open waste, severe littering)
- 41–70 -> MODERATE (some litter, minor dumping, needs attention)
- 71–100 -> GOOD    (clean, no visible garbage, well maintained)`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 150,
    },
  };

  const response = await axios.post(endpoint, payload, {
    headers: { "Content-Type": "application/json" },
  });

  // Extract text from Gemini response
  const raw = response.data.candidates[0].content.parts[0].text.trim();

  // Strip markdown code fences if Gemini wraps in ```json ... ```
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/, "").trim();

  const parsed = JSON.parse(cleaned);

  // Validate and clamp values
  const mlScore = Math.min(100, Math.max(0, Number(parsed.mlScore)));
  const condition = ["BAD", "MODERATE", "GOOD"].includes(parsed.condition)
    ? parsed.condition
    : mlScore > 70 ? "GOOD" : mlScore > 40 ? "MODERATE" : "BAD";
  const reason =
    typeof parsed.reason === "string" && parsed.reason.length > 0
      ? parsed.reason
      : "Unable to determine reason.";

  return { mlScore, condition, reason };
}

// ─── POST /api/report ────────────────────────────────────────────────────────
const createReport = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = req.file.path; // Cloudinary URL from multer-storage-cloudinary

    // AI scoring with Gemini
    let mlScore, condition, reason;
    try {
      ({ mlScore, condition, reason } = await scoreImageWithGemini(imageUrl));
      console.log(`Gemini scored: ${mlScore} | ${condition} | ${reason}`);
    } catch (aiErr) {
      console.error("Gemini scoring failed, using fallback:", aiErr.message);
      mlScore   = 50;
      condition = "MODERATE";
      reason    = "AI scoring unavailable — manual review needed.";
    }

    const report = await Report.create({
      imageBefore: imageUrl,
      latitude:    Number(latitude),
      longitude:   Number(longitude),
      mlScore,
      condition,
      reason,
      status: "OPEN",
    });

    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create report" });
  }
};

// ─── GET /api/report ─────────────────────────────────────────────────────────
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

module.exports = { createReport, getAllReports };