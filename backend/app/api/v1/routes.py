from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user import User
from app.models.user import User as UserModel
from app.db.session import get_session
from sqlalchemy.future import select

router = APIRouter()

@router.get("/users", response_model=list[User])
async def get_users(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(UserModel))
    return result.scalars().all()
