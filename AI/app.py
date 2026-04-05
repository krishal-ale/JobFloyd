from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pdfplumber
import requests
import re
import io
import warnings
warnings.filterwarnings("ignore")

# ML imports
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

app = Flask(__name__)
CORS(app)


print("Training model...")

df = pd.read_csv("resume_dataset.csv")

columns = ["Experience", "Skills", "Achievements", "Education"]
for col in columns:
    df[col] = df[col].fillna("")

df = df[df["Score"].notna()].copy()

df["combined_Columns"] = (
    df["Experience"].astype(str) + " " +
    df["Skills"].astype(str) + " " +
    df["Achievements"].astype(str) + " " +
    df["Education"].astype(str)
)

x = df["combined_Columns"]
y = df["Score"]

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

tfidf = TfidfVectorizer(max_features=1000, stop_words="english")
x_train_tfidf = tfidf.fit_transform(x_train)
x_test_tfidf = tfidf.transform(x_test)

# Train all 3 models
dt_model = DecisionTreeRegressor(max_depth=8, random_state=42)
dt_model.fit(x_train_tfidf, y_train)

rf_model = RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42)
rf_model.fit(x_train_tfidf, y_train)

lr_model = LinearRegression()
lr_model.fit(x_train_tfidf, y_train)

# Pick best model
r2_dt = r2_score(y_test, dt_model.predict(x_test_tfidf))
r2_rf = r2_score(y_test, rf_model.predict(x_test_tfidf))
r2_lr = r2_score(y_test, lr_model.predict(x_test_tfidf))

best_r2 = max(r2_dt, r2_rf, r2_lr)
if best_r2 == r2_rf:
    best_model = rf_model
    best_model_name = "Random Forest"
elif best_r2 == r2_dt:
    best_model = dt_model
    best_model_name = "Decision Tree"
else:
    best_model = lr_model
    best_model_name = "Linear Regression"

print(f"Best model: {best_model_name} with R2: {best_r2:.3f}")

# =====================
# HELPER FUNCTIONS
# =====================

def clean_text(text):
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[•●▪–-]', ' ', text)
    text = re.sub(r'[^a-z0-9,. ]', ' ', text)
    return text.strip()

def extract_text_from_pdf_url(url):
    try:
        response = requests.get(url, timeout=10)
        pdf_file = io.BytesIO(response.content)
        text = ""
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + " "
        return text.strip()
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

# =====================
# API ROUTE
# =====================

@app.route("/rank-resumes", methods=["POST"])
def rank_resumes():
    try:
        data = request.json

        # expects: [{ name, email, resumeUrl }]
        applicants = data.get("applicants", [])

        if not applicants:
            return jsonify({"success": False, "message": "No applicants provided"}), 400

        results = []

        for applicant in applicants:
            name = applicant.get("name", "Unknown")
            email = applicant.get("email", "")
            resume_url = applicant.get("resumeUrl", "")

            if not resume_url:
                results.append({
                    "name": name,
                    "email": email,
                    "score": 0,
                    "error": "No resume"
                })
                continue

            # Extract and clean text
            raw_text = extract_text_from_pdf_url(resume_url)
            cleaned = clean_text(raw_text)

            if not cleaned:
                results.append({
                    "name": name,
                    "email": email,
                    "score": 0,
                    "error": "Could not read resume"
                })
                continue

            # Predict score
            tfidf_vec = tfidf.transform([cleaned])
            score = best_model.predict(tfidf_vec)[0]

            results.append({
                "name": name,
                "email": email,
                "score": round(float(score), 2),
                "error": None
            })

        # Sort by score descending
        results.sort(key=lambda x: x["score"], reverse=True)

        # Add rank
        for i, r in enumerate(results):
            r["rank"] = i + 1

        return jsonify({
            "success": True,
            "model_used": best_model_name,
            "ranked": results
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"success": True, "message": "AI server running", "model": best_model_name})


if __name__ == "__main__":
    app.run(port=5001, debug=True)


