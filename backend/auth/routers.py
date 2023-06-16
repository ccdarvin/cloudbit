from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination.cursor import CursorPage
from fastapi_pagination.links import Page

from config.db import get_async_session
from .models import User, CloudApp, CloudAppUser
from .schemas import CloudAppCreate, CloudAppRead, UserRead
from .users import current_active_user


router = APIRouter()

@router.get("/cloud_app/check_code", status_code=200)
async def check_code(code: str, session: AsyncSession = Depends(get_async_session)):
    app_cloud = await session.execute(
        select(CloudApp).filter(CloudApp.code == code)
    )
    app_cloud = app_cloud.scalars().first()
    return {
        "exists": app_cloud is not None,
    }


@router.head('/')
@router.post("/cloud_app", status_code=201)
async def create_cloud_app(
    cloud_app: CloudAppCreate,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
) -> CloudAppRead:
    
    # create could app
    app_cloud = CloudApp(**cloud_app.dict())
    session.add(app_cloud)
    await session.commit()
    # create app user
    app_user = CloudAppUser(
        app_cloud_id=app_cloud.id,
        User_id=user.id,
        is_creator=True
    )
    session.add(app_user)
    await session.commit()

    return CloudAppRead(
        id=app_cloud.id,
        name=app_cloud.name,
        code=app_cloud.code,
        creator=user,
        is_creator=True
    )


@router.get("/cloud_app", status_code=200)
async def get_cloud_apps(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
    #params
) -> Page[CloudAppRead]:
    query = select(
        CloudApp, CloudAppUser).join(
            CloudAppUser).filter(
                CloudAppUser.User_id == user.id).order_by(CloudApp.id)
    
    async def transformer(data: tuple[CloudApp, CloudAppUser]) -> CloudAppRead:
        result = [CloudAppRead(
            id=app_cloud.id,
            name=app_cloud.name,
            code=app_cloud.code,
            creator=UserRead.from_orm(user),
            is_creator=app_user.is_creator
        ) for app_cloud, app_user in data]
        return result
    
    return await paginate(session, query, transformer=transformer)
