<div align="center">

# 🌱 TEE

### Tea Estate Engine

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=2E7D32&center=true&vCenter=true&width=750&lines=AI-Powered+Tea+Estate+Management;Tea+Leaf+Disease+Detection;Smart+Estate+Analytics;Modernizing+Tea+Agriculture" />

<br>

<p>
  <b>🌿 Smarter Estates. Better Decisions. Healthier Tea.</b>
</p>

<p>
TEE is an AI-powered Tea Estate Management System that combines
machine learning, estate management, workforce monitoring and
analytics into a unified platform for modern tea estates.
</p>

<br>

![Contributors](https://img.shields.io/github/contributors/isururx/TEE?style=for-the-badge)
![Commits](https://img.shields.io/github/commit-activity/m/isururx/TEE?style=for-the-badge)
![Last Commit](https://img.shields.io/github/last-commit/isururx/TEE?style=for-the-badge)

</div>

## 👥 Contributors

<p align="center">
  <a href="https://github.com/isururx/TEE/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=isururx/TEE" />
  </a>
</p>

## 📊 Repository Statistics

<div align="center">

### 👥 Contributors

[![Contributors](https://img.shields.io/github/contributors/isururx/TEE?style=for-the-badge)](https://github.com/isururx/TEE/graphs/contributors)

### 📈 Contribution Activity

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/isururx/TEE?style=for-the-badge)

### 📦 Repository Stats

![GitHub repo size](https://img.shields.io/github/repo-size/isururx/TEE?style=for-the-badge)
![GitHub code size](https://img.shields.io/github/languages/code-size/isururx/TEE?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/isururx/TEE?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/isururx/TEE?style=for-the-badge)

</div>


# TEE API Reference

## Base URL

```http
http://localhost:8000
```

---

## Health Check

Checks whether the TEE backend is running.

```http
GET /
```

No parameters are required.

---

## Detect Tea Leaf Disease

Uploads a tea leaf image and returns the predicted disease, confidence, severity, description, and recommendations.

```http
POST /api/detection/detect
```

### Request

The endpoint expects a `multipart/form-data` request.

| Parameter | Type   | Description                                            |
| :-------- | :----- | :----------------------------------------------------- |
| `image`   | `file` | **Required**. Tea leaf image file in JPG or PNG format |

### Example

```http
POST /api/detection/detect
Content-Type: multipart/form-data
```

Form data:

```text
image: <tea_leaf_image.jpg>
```

### Response

| Field             | Type            | Description                                    |
| :---------------- | :-------------- | :--------------------------------------------- |
| `is_healthy`      | `boolean`       | Indicates whether the detected leaf is healthy |
| `disease_name`    | `string`        | Detected disease name                          |
| `confidence`      | `float`         | Model confidence score between 0 and 1         |
| `severity`        | `string`        | Disease severity: Low, Moderate, or High       |
| `description`     | `string`        | Description of the detected condition          |
| `recommendations` | `array[string]` | Recommended actions for the detected condition |

### Possible Disease Names

```text
Healthy
Blister Blight
Brown Blight
Grey Blight
Red Leaf Spot
Algal Leaf Spot
```

### Possible Severity Values

```text
Low
Moderate
High
```

### Example Response

```json
{
  "is_healthy": false,
  "disease_name": "Brown Blight",
  "confidence": 0.94,
  "severity": "Moderate",
  "description": "Brown blight detected on the tea leaf.",
  "recommendations": [
    "Remove affected leaves",
    "Improve field sanitation",
    "Apply recommended treatment"
  ]
}
```
# Appendix

## Appendix A – API Testing Environment

The TEE backend API is developed using FastAPI and runs locally on port `8000`.

### A.1 Base URL

```http
http://localhost:8000
```

### A.2 API Testing Tool

The API endpoints can be tested using **Postman**.

The project repository contains a Postman collection named **TEE API** and a local environment configuration.

| Configuration     | Value                   |
| :---------------- | :---------------------- |
| Environment       | TEE Local               |
| Base URL          | `http://localhost:8000` |
| Testing Tool      | Postman                 |
| Backend Framework | FastAPI                 |
| API Type          | REST API                |

---

## Appendix B – Available API Endpoints

| Method | Endpoint                | Purpose                              |
| :----- | :---------------------- | :----------------------------------- |
| `GET`  | `/`                     | Check whether the backend is running |
| `POST` | `/api/detection/detect` | Detect disease from a tea leaf image |

---

## Appendix C – Disease Detection Request

The disease detection endpoint accepts a tea leaf image through a `multipart/form-data` request.

### C.1 Request Parameter

| Parameter | Type | Required | Description                         |
| :-------- | :--- | :------- | :---------------------------------- |
| `image`   | File | Yes      | Tea leaf image in JPG or PNG format |

### C.2 Request Format

```text
POST /api/detection/detect
Content-Type: multipart/form-data

image = <tea leaf image>
```

---

## Appendix D – Disease Detection Response

The API returns the result of the machine learning model in JSON format.

### D.1 Response Fields

| Field             | Type    | Description                                    |
| :---------------- | :------ | :--------------------------------------------- |
| `is_healthy`      | Boolean | Indicates whether the leaf is healthy          |
| `disease_name`    | String  | Name of the detected disease                   |
| `confidence`      | Float   | Model confidence score from 0 to 1             |
| `severity`        | String  | Severity level of the detected disease         |
| `description`     | String  | Description of the detected condition          |
| `recommendations` | Array   | Recommended actions for the detected condition |

### D.2 Example Response

```json
{
  "is_healthy": false,
  "disease_name": "Brown Blight",
  "confidence": 0.94,
  "severity": "Moderate",
  "description": "Brown blight detected on the tea leaf.",
  "recommendations": [
    "Remove affected leaves",
    "Improve field sanitation",
    "Apply recommended treatment"
  ]
}
```

---

## Appendix E – Supported Disease Classes

The disease detection API currently supports the following classes:

1. Healthy
2. Blister Blight
3. Brown Blight
4. Grey Blight
5. Red Leaf Spot
6. Algal Leaf Spot

---

## Appendix F – Severity Classification

The API categorizes detected disease severity into three levels.

| Severity   | Description                                      |
| :--------- | :----------------------------------------------- |
| `Low`      | Minor symptoms with limited visible impact       |
| `Moderate` | Noticeable disease symptoms requiring attention  |
| `High`     | Severe symptoms requiring immediate intervention |

---

## Appendix G – API Testing Procedure

The following procedure can be used to verify the disease detection API.

### Step 1 – Start the Backend

Run the FastAPI backend locally.

```bash
uvicorn main:app --reload
```

The backend should become available at:

```text
http://localhost:8000
```

### Step 2 – Test the Health Check

Send the following request using Postman:

```http
GET http://localhost:8000/
```

A successful response confirms that the backend is running.

### Step 3 – Test Disease Detection

Create a new `POST` request:

```http
POST http://localhost:8000/api/detection/detect
```

Select:

```text
Body → form-data
```

Add the following parameter:

```text
Key: image
Type: File
Value: <select tea leaf image>
```

Send the request.

### Step 4 – Verify the Response

Verify that the response contains:

```text
is_healthy
disease_name
confidence
severity
description
recommendations
```

The returned disease name and confidence value can then be displayed by the TEE frontend.

---

## Appendix H – Postman Collection

The project includes a Postman API collection named **TEE API** containing the following requests:

* Health Check
* Detect Disease

A local Postman environment is also provided with:

```text
baseUrl = http://localhost:8000
```

This allows the API requests to use the environment variable:

```http
{{baseUrl}}
```

For example:

```http
GET {{baseUrl}}/
```

and

```http
POST {{baseUrl}}/api/detection/detect
```

---

## Appendix I – API Architecture

The disease detection request follows the following flow:

```text
User
  │
  │ Upload Tea Leaf Image
  ▼
React Frontend
  │
  │ POST /api/detection/detect
  ▼
FastAPI Backend
  │
  │ Image Processing
  ▼
Machine Learning Model
  │
  │ Prediction
  ▼
Disease Classification
  │
  │ JSON Response
  ▼
React Frontend
  │
  ▼
Display Detection Result
```

---

## Appendix J – Error Handling

The API should return an appropriate error response when an invalid request is submitted.

Typical error situations include:

| Situation            | Expected Handling        |
| :------------------- | :----------------------- |
| No image uploaded    | Request rejected         |
| Invalid image format | Request rejected         |
| Corrupted image      | Image processing failure |
| Backend unavailable  | Connection error         |
| Model unavailable    | Server-side error        |

These cases should be considered during API testing to ensure the system behaves reliably under invalid or unexpected inputs.

## 🚀 About Me
I'm a full stack developer...


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://katherineoelsner.com/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/)


## License

[MIT](https://choosealicense.com/licenses/mit/)

