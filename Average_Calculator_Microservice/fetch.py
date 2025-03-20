import requests

url = "http://20.244.56.144/test/register"
data = {
    "companyName": "SRM University",
    "ownerName": "Dhruv Gupta",
    "rollNo": "RA2211030010201",
    "ownerEmail": "dg7950@srmist.edu.in",
    "accessCode": "SUfGJv"
}

response = requests.post(url, json=data)

print("Response Status Code:", response.status_code)
print("Response Body:", response.json())




