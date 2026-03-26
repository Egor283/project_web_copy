from requests import get

print(get("https://127.0.0.1:5000/api/jobs").json())
print(get("https://127.0.0.1:5000/api/jobs/1").json())
print(get("https://127.0.0.1:5000/api/jobs/-12").json())
print(get("https://127.0.0.1:5000/api/jobs/x").json())