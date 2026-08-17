from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
import ollama
import urllib.parse

from database import Post, get_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateRequest(BaseModel):
    topic: str
    platform: str
    tone: str


class SavePostRequest(BaseModel):
    topic: str
    platform: str
    tone: str
    generated_content: str


@app.get("/")
def read_root():
    return {"message": "AI Social Media Generator backend is running!"}


@app.post("/generate")
def generate_post(request: GenerateRequest):
    prompt = f"""Generate a {request.tone} {request.platform} post about: {request.topic}
    
Keep it appropriate for the platform (concise for X/Twitter, engaging for Instagram, professional for LinkedIn)."""

    response = ollama.chat(
        model="llama3.2",
        messages=[{"role": "user", "content": prompt}]
    )

    generated_text = response["message"]["content"]

    return {"generated_content": generated_text}


@app.post("/posts")
def save_post(request: SavePostRequest, db: Session = Depends(get_db)):
    new_post = Post(
        topic=request.topic,
        platform=request.platform,
        tone=request.tone,
        generated_content=request.generated_content,
        created_at=datetime.utcnow()
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post


@app.get("/posts")
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).order_by(Post.created_at.desc()).all()
    return posts


@app.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
    return {"message": "Post deleted successfully"}

@app.post("/generate-image")
def generate_image(request: GenerateRequest):
    prompt = f"{request.topic}, professional, high quality, social media style"
    encoded_prompt = urllib.parse.quote(prompt)
    
    image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=512&height=512&nologo=true"
    
    return {"image_url": image_url}