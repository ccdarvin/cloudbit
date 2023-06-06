
import pytest
from sqlalchemy.sql import text


@pytest.mark.anyio
async def test_root(client):
    response = await client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "version": "0.0.1",
        "name": "cloudbit.app",
        "https": "https://cloudbit.app"
    }
