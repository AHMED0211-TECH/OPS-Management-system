from fastapi import FastAPI, Depends
from sqlalchemy import text
from database import engine
from auth import get_current_user

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/db-check")
def db_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"database_connected": result.scalar() == 1}
@app.get("/me")
def get_me(user=Depends(get_current_user)):
    return {"id": user.id, "email": user.email}

