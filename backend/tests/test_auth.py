
import pytest



@pytest.fixture
async def login(client):
    response = await client.post("/auth/jwt/login", data={
        "username": "cc.darvin@gmail.com",
        "password": "password"
    }, headers={"Content-Type": "application/x-www-form-urlencoded"})
    return response.json()


@pytest.mark.anyio
async def test_register(client):
    response = await client.post("/auth/register", json={
        "email": "cc.darvin@gmail.com",
        "password": "password"
    })
    assert response.status_code == 201
    assert response.json()["id"] != None
    assert response.json()["is_active"]


@pytest.mark.anyio
async def test_login(client):
    response = await client.post("/auth/jwt/login", data={
        "username": "cc.darvin@gmail.com",
        "password": "password"
    }, headers={"Content-Type": "application/x-www-form-urlencoded"})
    assert response.status_code == 200


@pytest.mark.anyio
async def test_login_fail(client):
    response = await client.post("/auth/jwt/login", data={
        "username": "fail@email.com",
        "password": "password"
    }, headers={"Content-Type": "application/x-www-form-urlencoded"})
    assert response.status_code == 400
    assert response.json()["detail"] == "LOGIN_BAD_CREDENTIALS"


@pytest.mark.anyio
async def test_me(client, login):
    response = await client.get("/auth/me", 
                                headers={"Authorization": f"Bearer {login['access_token']}"})
    assert response.status_code == 200
    assert response.json()["email"] == "cc.darvin@gmail.com"


@pytest.mark.anyio
async def test_update_me(client, login):
    response = await client.patch("/auth/me", json={
        "first_name": "Darvin",
    }, headers={"Authorization": f"Bearer {login['access_token']}"})
    assert response.status_code == 200
    assert response.json()["first_name"] == "Darvin"

############################################################################################################
# Create AppCloud
############################################################################################################


@pytest.mark.anyio
async def test_app_cloud_code(client):
    response = await client.get("/cloud_app/check_code", params={
        "code": "test_app_cloud"
    })
    assert response.status_code == 200
    assert response.json()["exists"] == False

@pytest.mark.anyio
async def test_create_app_cloud(client, login):
    response = await client.post("/cloud_app", json={
        "name": "Test App Cloud",
        "code": "test_app_cloud"
    }, headers={"Authorization": f"Bearer {login['access_token']}"})
    assert response.status_code == 201
    assert response.json()["name"] == "Test App Cloud"
    ## creck if user is creator
    assert response.json()["is_creator"] == True


@pytest.mark.anyio
async def test_app_cloud_code_fail(client):
    response = await client.get("/cloud_app/check_code", params={
        "code": "test_app_cloud"
    })
    assert response.status_code == 200
    assert response.json()["exists"] == True



@pytest.mark.anyio
async def test_app_cloud_list(client, login):
    response = await client.get("/cloud_app", headers={"Authorization": f"Bearer {login['access_token']}"})
    assert response.status_code == 200
    print(response.json())
    assert len(response.json()) > 0
