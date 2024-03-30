from sqlalchemy import URL, create_engine

import models

engine = create_engine(
    URL.create(
        "postgresql",
        username="pbestoso",
        password="password",
        host="localhost",
        database="postgres",
    )
)
