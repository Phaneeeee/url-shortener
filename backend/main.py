from fastapi import FastAPI
from pydantic import BaseModel
import string

app = FastAPI()

# In-memory storage (temporary)
url_db = {}
counter = 1

# Base62 characters
BASE62 = string.ascii_letters + string.digits


# Request model
class URLRequest(BaseModel):
    url: str


# Base62 encoding function
def encode_base62(num):
    base = len(BASE62)
    encoded = []

    while num > 0:
        num, rem = divmod(num, base)
        encoded.append(BASE62[rem])

    return ''.join(reversed(encoded)) or "0"


# API to shorten URL
@app.post("/shorten")
def shorten_url(request: URLRequest):
    global counter

    short_code = encode_base62(counter)
    url_db[short_code] = request.url

    counter += 1

    return {
        "short_url": f"http://127.0.0.1:8000/{short_code}"
    }


# Redirect API
from fastapi.responses import RedirectResponse

@app.get("/{short_code}")
def redirect_url(short_code: str):
    if short_code in url_db:
        original_url = url_db[short_code]
        return RedirectResponse(url=original_url)
    
    return {"error": "URL not found"}