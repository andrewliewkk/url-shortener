from typing import Optional
from . import schemas, models
from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from .database import SessionLocal, engine
from sqlalchemy.orm import Session
import uuid

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def index():
    return {"Hello": "World"}

@app.get("/{uuid}", status_code=300)
def redirect(uuid:str,  db: Session = Depends(get_db)): 
    url = db.query(models.Url).filter(models.Url.shortened == uuid).first()
    return RedirectResponse(f"http://{url.url}")

@app.post("/")
def create_url(url: schemas.URL, db: Session = Depends(get_db)):
    if (db.query(models.Url).filter(models.Url.url == url.url).first()):
        return db.query(models.Url).filter(models.Url.url == url.url).first()
    shortened = uuid.uuid4().hex
    while (db.query(models.Url).filter(models.Url.shortened == shortened).first()):
        shortened = uuid.uuid4().hex
    new_url_map = models.Url(url=url.url, shortened=shortened)
    db.add(new_url_map)
    db.commit()
    db.refresh(new_url_map)
    return new_url_map