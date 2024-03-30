from sqlalchemy import URL, create_engine

import models

engine = create_engine(
    URL.create(
        "postgresql",
        username="postgres",
        password="password",
        host="localhost",
        datebase="letters",
    )
)
