from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import text
from database import engine
from auth import get_current_user
from database import get_db
from CRUD import get_or_create_user
from sqlalchemy.orm import Session
from models import MasterChecklist
from pydantic import BaseModel

class ChecklistCreate(BaseModel):
    title: str

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
def get_me(user=Depends(get_current_user), db: Session = Depends(get_db)):
    db_user = get_or_create_user(db, user)
    return {
        "id": db_user.id,
        "supabase_id": db_user.supabase_id,
        "name": db_user.name,
        "role": db_user.role,
        "team_id": db_user.team_id
    }
@app.get("/manager-only")
def manager_only(user=Depends(get_current_user), db: Session = Depends(get_db)):
    db_user = get_or_create_user(db, user)

    if db_user.role != "manager":
        raise HTTPException(status_code=403, detail="Managers only")

    return {"message": f"Welcome, manager {db_user.name}"}

@app.post("/checklists")
def create_checklist(
    checklist: ChecklistCreate,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = get_or_create_user(db, user)

    if db_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can create checklists")

    new_checklist = MasterChecklist(
        title=checklist.title,
        created_by=db_user.id
    )
    db.add(new_checklist)
    db.commit()
    db.refresh(new_checklist)

    return {
        "id": new_checklist.id,
        "title": new_checklist.title,
        "created_by": new_checklist.created_by,
        "created_at": new_checklist.created_at
    }
