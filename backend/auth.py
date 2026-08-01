from fastapi import Header , HTTPException
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def get_current_user(authorization: str = Header(...)):
    
    """
    Expects header: Authorization: Bearer <token>
    Verifies the token with Supabase and returns the Supabase user object.
    """
    try:
        token = authorization.replace("Bearer ", "")
        response = supabase.auth.get_user(token)
        if not response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return response.user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
