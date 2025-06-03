from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route("/generate-itinerary", methods=["POST"])
def generate_itinerary():
    data = request.get_json()
    destination = data.get("destination")
    start_date = data.get("startDate")
    end_date = data.get("endDate")
    trip_type = data.get("tripType")

    num_days = (datetime.fromisoformat(end_date) - datetime.fromisoformat(start_date)).days + 1

    prompt = (
        f"אתה מתכנן טיולים. תכנן טיול של {num_days} ימים ב{destination} בסגנון '{trip_type}'. "
        f"הטיול צריך להתחיל עם תיאור כללי קצר של אופי הטיול (1 שורות), "
        f"ואחריו תכנון יומי מסודר (יום 1, יום 2 וכו׳) בנוסף חובה המלצות לאטרקציות, תחבורה ומלונות. "
        f"כתוב בעברית רהוטה, אל תתחיל במילים כמו 'כמובן', 'בהנאה', או 'ברור'. "
        f"תדבר כאילו אתה מדריך טיולים מקצועי, לא כמו צ׳אט."
    )   


    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8,
            max_tokens=1500
        )
        plan = response.choices[0].message.content
        return jsonify({"itinerary": plan})
    except Exception as e:
        print("🔥 שגיאה:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
