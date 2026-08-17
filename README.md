# 🔧 Machine Risk Detector

<div align="center">

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React.js-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat-square&logo=numpy&logoColor=white)
![Random Forest](https://img.shields.io/badge/Random%20Forest-228B22?style=flat-square&logoColor=white)

**A Machine Learning-powered web application that predicts industrial machine health status based on real-time operational parameters — helping prevent failures before they happen.**

</div>

---

## 📌 Problem Statement

Unexpected machine failures in industrial environments cause costly downtime and safety risks. This project uses a supervised ML model to **predict machine risk levels** from operational sensor data, enabling proactive maintenance decisions.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🟢 🟡 🔴 Risk Prediction | Classifies machine health as **Low**, **Medium**, or **High** risk |
| 📊 Health Score | Numerical score representing overall machine condition |
| 📋 Health Report | Detailed breakdown of machine parameter status |
| 🔧 Maintenance Recommendation | Actionable next steps based on predicted risk level |
| ⚛️ React Interface | Clean, user-friendly frontend for real-time input and output |

---

## 🛠️ Tech Stack

**Frontend**
- React.js

**Machine Learning & Backend**
- Python, Scikit-Learn (Random Forest Classifier)
- Pandas, NumPy

---

## ⚙️ Machine Parameters (Input)

| Parameter | Description |
|---|---|
| 🌡️ Temperature | Operating temperature of the machine (°C) |
| ⏱️ Runtime | Total hours the machine has been running |
| 📳 Vibration | Vibration level detected by sensors |
| 🛢️ Oil Level | Current lubrication/oil level percentage |

---

## 📤 Output

```
Risk Level     →  Low / Medium / High
Health Score   →  0 to 100
Recommendation →  "Machine is healthy. Continue regular monitoring."
                  "Schedule maintenance soon."
                  "Immediate inspection required!"
```

---

## 🧠 ML Model Details

- **Algorithm:** Random Forest Classifier
- **Task:** Multi-class Classification (Low / Medium / High Risk)
- **Libraries:** Scikit-learn, Pandas, NumPy
- **Evaluation Metrics:** Accuracy, Precision, Recall, F1-Score

---

## 🚀 How to Run

```bash
# 1. Clone the repository
git clone https://github.com/priyahub20/machine-risk-detector.git
cd machine-risk-detector

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Run the ML model
python model.py

# 4. Start the React frontend
cd frontend
npm install
npm start
```

---

## 🔮 Future Improvements

- [ ] Flask API Integration for live model serving
- [ ] Real-time Prediction from IoT sensor feeds
- [ ] Database Support for logging machine history
- [ ] PDF Report Generation for maintenance teams

---

## 👩‍💻 Author

**Mohana Priya R**
B.E. Computer Science & Engineering | DMI College of Engineering | CGPA: 8.4

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/mohana-priya-r7b4363284)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/priyahub20)
[![Email](https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:mohanapriya162020@gmail.com)
