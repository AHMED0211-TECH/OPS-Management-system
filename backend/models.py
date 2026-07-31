from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)

    team = relationship("Team")


class MasterChecklist(Base):
    __tablename__ = "master_checklists"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    checklist_id = Column(Integer, ForeignKey("master_checklists.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    frequency = Column(String, nullable=False)       # "daily", "weekly", "monthly", "every_x_hours"
    interval_hours = Column(Integer, nullable=True)  # only used if frequency = "every_x_hours"

    checklist = relationship("MasterChecklist")
    team = relationship("Team")