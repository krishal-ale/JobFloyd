import os
import re
import io
import traceback
import requests
import pdfplumber
import pandas as pd

from flask import Flask, request, jsonify
from flask_cors import CORS

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "resume_dataset.csv")

tfidf_vectorizer = None
best_model = None
best_model_name = None


def load_and_train_model():
    global tfidf_vectorizer, best_model, best_model_name

    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at: {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)

    columns = ["Experience", "Skills", "Achievements", "Education"]
    for col in columns:
        if col not in df.columns:
            df[col] = ""
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

    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.2, random_state=42
    )

    tfidf_vectorizer = TfidfVectorizer(max_features=1000, stop_words="english")
    x_train_tfidf = tfidf_vectorizer.fit_transform(x_train)
    x_test_tfidf = tfidf_vectorizer.transform(x_test)

    dt_model = DecisionTreeRegressor(max_depth=8, random_state=42)
    dt_model.fit(x_train_tfidf, y_train)
    dt_score = r2_score(y_test, dt_model.predict(x_test_tfidf))

    rf_model = RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42)
    rf_model.fit(x_train_tfidf, y_train)
    rf_score = r2_score(y_test, rf_model.predict(x_test_tfidf))

    lr_model = LinearRegression()
    lr_model.fit(x_train_tfidf, y_train)
    lr_score = r2_score(y_test, lr_model.predict(x_test_tfidf))

    scores = {
        "Decision Tree": (dt_model, dt_score),
        "Random Forest": (rf_model, rf_score),
        "Linear Regression": (lr_model, lr_score),
    }

    best_model_name, (best_model, _) = max(scores.items(), key=lambda item: item[1][1])

    print(f"Best model loaded: {best_model_name}")


def clean_basic(text):
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[•●▪–-]", " ", text)
    text = re.sub(r"[^a-z0-9,. ]", " ", text)
    return text.strip()


def remove_unwanted(text):
    remove_words = [
        "about me", "summary", "objective",
        "hobbies", "interests",
        "linkedin", "github", "facebook", "twitter",
        "contact", "personal details"
    ]
    for word in remove_words:
        text = text.replace(word, "")
    return text


def extract_section(text, keywords, stopwords):
    text_lower = text.lower()
    for key in keywords:
        if key in text_lower:
            start = text_lower.index(key)
            end = len(text)
            for stop in stopwords:
                stop_pos = text_lower.find(stop, start + 1)
                if stop_pos != -1:
                    end = min(end, stop_pos)
            return text[start:end]
    return ""


def extract_all_sections(text):
    experience = extract_section(
        text,
        ["experience", "work experience", "employment"],
        ["education", "skills", "projects", "achievements"]
    )
    skills = extract_section(
        text,
        ["skills", "technical skills"],
        ["experience", "education", "projects"]
    )
    education = extract_section(
        text,
        ["education", "academic"],
        ["skills", "experience", "projects"]
    )
    achievements = extract_section(
        text,
        ["projects", "achievements", "certifications"],
        ["education", "skills", "experience"]
    )

    combined = f"{experience} {skills} {education} {achievements}".strip()
    return combined if combined else text


def extract_text_from_pdf_url(pdf_url):
    response = requests.get(pdf_url, timeout=10)
    response.raise_for_status()

    pdf_file = io.BytesIO(response.content)
    text = ""

    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "

    return text.strip()


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "success": True,
        "message": "AI service is running",
        "best_model": best_model_name
    })


@app.route("/rank-resumes", methods=["POST"])
def rank_resumes():
    try:
        data = request.get_json()
        resumes = data.get("resumes", [])

        if not resumes:
            return jsonify({
                "success": False,
                "message": "No resumes provided"
            }), 400

        processed_results = []

        for item in resumes:
            name = item.get("name", "Unknown Candidate")
            resume_url = item.get("resumeUrl", "")
            applicant_id = item.get("applicantId")
            application_id = item.get("applicationId")
            resume_name = item.get("resumeName", "Resume.pdf")

            if not resume_url:
                processed_results.append({
                    "applicationId": application_id,
                    "applicantId": applicant_id,
                    "name": name,
                    "resumeUrl": resume_url,
                    "resumeName": resume_name,
                    "score": 0,
                    "error": "Resume URL not found"
                })
                continue

            try:
                raw_text = extract_text_from_pdf_url(resume_url)
                cleaned_text = clean_basic(raw_text)
                filtered_text = remove_unwanted(cleaned_text)
                final_text = extract_all_sections(filtered_text)

                vector = tfidf_vectorizer.transform([final_text])
                predicted_score = float(best_model.predict(vector)[0])

                processed_results.append({
                    "applicationId": application_id,
                    "applicantId": applicant_id,
                    "name": name,
                    "resumeUrl": resume_url,
                    "resumeName": resume_name,
                    "score": round(predicted_score, 2),
                    "error": None
                })

            except Exception as e:
                processed_results.append({
                    "applicationId": application_id,
                    "applicantId": applicant_id,
                    "name": name,
                    "resumeUrl": resume_url,
                    "resumeName": resume_name,
                    "score": 0,
                    "error": str(e)
                })

        processed_results.sort(key=lambda x: x["score"], reverse=True)

        ranked_results = []
        for index, item in enumerate(processed_results, start=1):
            item["rank"] = index
            ranked_results.append(item)

        return jsonify({
            "success": True,
            "message": "Resume ranking completed",
            "modelUsed": best_model_name,
            "results": ranked_results
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "success": False,
            "message": "AI ranking failed",
            "error": str(e)
        }), 500


if __name__ == "__main__":
    load_and_train_model()
    app.run(host="0.0.0.0", port=5001, debug=True)