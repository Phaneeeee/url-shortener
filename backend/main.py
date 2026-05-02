from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from fastapi.responses import RedirectResponse
from mangum import Mangum
from sqlalchemy.orm import Session
from typing import Optional
import os
import string
from database import engine, SessionLocal, Base
from models import URL
from fastapi.middleware.cors import CORSMiddleware


BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:8000").rstrip("/")
CORS_ORIGIN = os.getenv("CORS_ORIGIN", "http://localhost:3000")
CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGIN.split(",") if origin.strip()]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

BASE62 = string.ascii_letters + string.digits

class URLRequest(BaseModel):
    url: str
    custom_code: Optional[str] = None

def encode_base62(num):
    base = len(BASE62)
    encoded = []

    while num > 0:
        num, rem = divmod(num, base)
        encoded.append(BASE62[rem])

    return ''.join(reversed(encoded)) or "0"


def build_short_url(short_code: str) -> str:
    return f"{BASE_URL}/{short_code}"


@app.post("/shorten")
def shorten_url(request: URLRequest, db: Session = Depends(get_db)):

    if request.custom_code:
        existing = db.query(URL).filter(URL.short_code == request.custom_code).first()

        if existing:
            raise HTTPException(status_code=400, detail="Custom code already taken")

        short_code = request.custom_code

        new_url = URL(
            original_url=request.url,
            short_code=short_code
        )

        db.add(new_url)
        db.commit()

        return {
            "short_url": build_short_url(short_code)
        }

    new_url = URL(original_url=request.url)

    db.add(new_url)
    db.commit()
    db.refresh(new_url)

    short_code = encode_base62(new_url.id)

    new_url.short_code = short_code
    db.commit()

    return {
        "short_url": build_short_url(short_code)
    }


@app.get("/{short_code}")
def redirect_url(short_code: str, db: Session = Depends(get_db)):
    url = db.query(URL).filter(URL.short_code == short_code).first()

    if url:
        url.click_count += 1
        db.commit()
        return RedirectResponse(url=url.original_url)

    raise HTTPException(status_code=404, detail="URL not found")

@app.get("/stats/{short_code}")
def get_stats(short_code: str, db: Session = Depends(get_db)):
    url = db.query(URL).filter(URL.short_code == short_code).first()

    if not url:
        raise HTTPException(status_code=404, detail="URL not found")

    return {
        "original_url": url.original_url,
        "short_code": url.short_code,
        "clicks": url.click_count
    }


handler = Mangum(app)
