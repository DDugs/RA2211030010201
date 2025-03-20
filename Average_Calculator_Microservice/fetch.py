import requests

url = "http://20.244.56.144/test/register"
data = {
    "companyName": "company",
    "ownerName": "name",
    "rollNo": "roll",
    "ownerEmail": "email",
    "accessCode": "token"
}

response = requests.post(url, json=data)

print("Response Status Code:", response.status_code)
print("Response Body:", response.json()) 


