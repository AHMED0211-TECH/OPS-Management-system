from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import text
from database import engine
from auth import get_current_user
from database import get_db
from CRUD import get_or_create_user
from sqlalchemy.orm import Session
from models import MasterChecklist, Task, TaskInstance
from pydantic import BaseModel
from datetime import date, datetime

class ChecklistCreate(BaseModel):
    title: str

class TaskCreate(BaseModel):
    title: str
    checklist_id: int
    team_id: int
    frequency: str
    interval_hours: int | None = None

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

@app.get("/my-tasks")
def get_my_tasks(user=Depends(get_current_user), db: Session = Depends(get_db)):
    db_user = get_or_create_user(db, user)

    if db_user.team_id is None:
        raise HTTPException(status_code=400, detail="User is not assigned to a team")

    tasks = db.query(Task).filter(Task.team_id == db_user.team_id).all()

    return [
        {
            "id": t.id,
            "title": t.title,
            "checklist_id": t.checklist_id,
            "frequency": t.frequency,
            "interval_hours": t.interval_hours
        }
        for t in tasks
    ]

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
    
@app.post("/tasks")
def create_task(
    task: TaskCreate,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = get_or_create_user(db, user)

    if db_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can create tasks")

    new_task = Task(
        title=task.title,
        checklist_id=task.checklist_id,
        team_id=task.team_id,
        frequency=task.frequency,
        interval_hours=task.interval_hours
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return {
        "id": new_task.id,
        "title": new_task.title,
        "checklist_id": new_task.checklist_id,
        "team_id": new_task.team_id,
        "frequency": new_task.frequency,
        "interval_hours": new_task.interval_hours
    }

@app.post("/generate-daily-tasks")
def generate_daily_tasks(
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = get_or_create_user(db, user)

    if db_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can generate tasks")

    today = date.today()

    daily_tasks = db.query(Task).filter(Task.frequency == "daily").all()

    created_count = 0

    for task in daily_tasks:
        existing = db.query(TaskInstance).filter(
            TaskInstance.task_id == task.id,
            TaskInstance.due_date == today
        ).first()

        if existing:
            continue

        new_instance = TaskInstance(
            task_id=task.id,
            due_date=today,
            status="pending"
        )
        db.add(new_instance)
        created_count += 1

    db.commit()

    return {"message": f"Generated {created_count} task instance(s) for {today}"}

@app.post("/task-instances/{instance_id}/complete")
def complete_task(
    instance_id: int,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = get_or_create_user(db, user)

    instance = db.query(TaskInstance).filter(TaskInstance.id == instance_id).first()

    if not instance:
        raise HTTPException(status_code=404, detail="Task instance not found")

    task = db.query(Task).filter(Task.id == instance.task_id).first()

    if task.team_id != db_user.team_id:
        raise HTTPException(status_code=403, detail="You can only complete your own team's tasks")

    if instance.status == "locked":
        raise HTTPException(status_code=400, detail="This task is locked and can no longer be completed")

    instance.status = "completed"
    instance.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(instance)

    return {
        "id": instance.id,
        "task_id": instance.task_id,
        "status": instance.status,
        "completed_at": instance.completed_at
    }

@app.post("/lock-overdue-tasks")
def lock_overdue_tasks(
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = get_or_create_user(db, user)

    if db_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can lock overdue tasks")

    today = date.today()

    overdue_instances = db.query(TaskInstance).filter(
        TaskInstance.status == "pending",
        TaskInstance.due_date < today
    ).all()

    for instance in overdue_instances:
        instance.status = "locked"

    db.commit()

    return {"message": f"Locked {len(overdue_instances)} overdue task instance(s)"}

@app.get("/manager/overdue-tasks")
def get_overdue_tasks(
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = get_or_create_user(db, user)

    if db_user.role != "manager":
        raise HTTPException(status_code=403, detail="Managers only")

    overdue_tasks = (
        db.query(TaskInstance, Task)
        .join(Task, Task.id == TaskInstance.task_id)
        .filter(TaskInstance.status == "locked")
        .all()
    )

    return [
        {
            "task_instance_id": instance.id,
            "task_title": task.title,
            "team_id": task.team_id,
            "due_date": instance.due_date,
            "status": instance.status
        }
        for instance, task in overdue_tasks
    ]