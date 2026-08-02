from sqlalchemy.orm import Session
from models import User

def get_or_create_user(db: Session, supabase_user):
    user = db.query(User).filter(User.supabase_id == supabase_user.id).first()
    if  user:
        return user     
    
    new_user = User( 
        supabase_id=supabase_user.id,
        name=supabase_user.email,
        role="team_member",
        team_id=None 
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user