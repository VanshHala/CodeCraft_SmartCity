import urllib.request
import json

BASE_URL = "http://localhost:8080"

def req(path, data=None, method="GET", token=None):
    url = BASE_URL + path
    headers = {}
    if data is not None:
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    req_data = json.dumps(data).encode('utf-8') if data else None
    request = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request) as response:
            res_body = response.read().decode('utf-8')
            return response.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        try:
            body = json.loads(e.read().decode('utf-8'))
        except:
            body = e.read().decode('utf-8')
        return e.code, body
    except Exception as e:
        return 500, str(e)

import random
R = str(random.randint(10000, 99999))
status, body = req("/auth/register", {"name": "Cit", "email": f"cit{R}@x.com", "password": "p", "role": "CITIZEN"}, "POST")
print("Reg status:", status, "Body:", body)

status, body = req("/auth/login", {"email": f"cit{R}@x.com", "password": "p"}, "POST")
print("Login status:", status, "Body:", body)
