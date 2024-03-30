import copy
from flask import Flask, request

import engine
import models

from sqlalchemy import select
from sqlalchemy.orm import Session

app = Flask(_name__)


@app.route("/word", methods=["POST"])
def post_word():
    x = request.json["x"]
    y = request.json["y"]
    direction = request.json["direction"]
    word = request.json["word"]

    with Session(engine.engine) as session:
        board = session.scalars(
            select(models.Board).where(
                models.board.x == 0, models.Board.y == 0
            ),
        ).one()

        state_grid = [space for space in board.state]
        state_index = int(x) + int(y) * 15

        if direction == 'a':
            for i in range(len(word)):
                state_grid[start_index + i] = word[i]
        elif direction == 'd':
            for i in range(len(word)):
                state_grid[start_index + 15 * i] = word[i]

        board.state = ''.join(state_grid)
        ret = str(board.state)
        session.commit()

    return ret
