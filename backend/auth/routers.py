from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, Update

from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination.links import Page

from config.db import get_async_session
from .models import User, CloudApp, CloudAppUser
from .schemas import (
    CloudAppCreate, CloudAppUpdate,
    CloudAppRead, UserRead
)
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
    data: CloudAppCreate,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
) -> CloudAppRead:
    
    # create could app
    cloud_app = CloudApp(**data.dict())
    session.add(cloud_app)
    await session.commit()
    # create app user
    app_user = CloudAppUser(
        app_cloud_id=cloud_app.id,
        user_id=user.id,
        is_creator=True
    )
    session.add(app_user)
    await session.commit()

    return CloudAppRead(
        id=cloud_app.id,
        name=cloud_app.name,
        code=cloud_app.code,
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
                CloudAppUser.user_id == user.id).order_by(CloudApp.id)
    
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


@router.get("/cloud_app/{code}", status_code=200)
async def get_cloud_app(
    code: str,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> CloudAppRead:
    query = select(
        CloudApp, CloudAppUser).join(
            CloudAppUser).filter(
                CloudApp.code == code, 
                CloudAppUser.user_id == user.id
            )
    
    result = await session.execute(query)
    cloud_app, cloud_app_user = result.first()
    return CloudAppRead(
        id=cloud_app.id,
        code=cloud_app.code,
        name=cloud_app.name,
        creator=UserRead.from_orm(user),
        is_creator=cloud_app_user.is_creator  
    )


@router.patch("/cloud_app/{code}", status_code=200)
async def update_cloud_app(
    code: str,
    data: CloudAppUpdate,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
) -> CloudAppRead:
    # update cloud app 
    stmt = Update(CloudApp).where(CloudApp.code == code).values(**data.dict(exclude_unset=True))
    try:
        await session.execute(stmt)
        await session.commit()
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
    # get cloud app
    query = select(
        CloudApp, CloudAppUser).join(
            CloudAppUser).filter(
                CloudApp.code == code, 
                CloudAppUser.user_id == user.id
            )
    
    result = await session.execute(query)
    cloud_app, cloud_app_user = result.first()
    
    return CloudAppRead(
        id=cloud_app.id,
        code=cloud_app.code,
        name=cloud_app.name,
        creator=UserRead.from_orm(user),
        is_creator=cloud_app_user.is_creator
    )