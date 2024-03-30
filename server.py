import copy
from flask import Flask, jsonify, render_template, request

import engine
import models

from sqlalchemy import select
from sqlalchemy.orm import Session

app = Flask(__name__)


@app.route("/word", methods=["POST"])
def post_word():
    x = request.json["x"]
    y = request.json["y"]
    direction = request.json["direction"]
    word = request.json["word"]

    with Session(engine.engine) as session:
        board = session.scalars(
            select(models.Board).where(
                models.Board.x == 0, models.Board.y == 0
            ),
        ).one()

        state_grid = [space for space in board.state]
        start_index = int(x) + int(y) * 15

        if direction == 'a':
            for i in range(len(word)):
                state_grid[start_index + i] = word[i]
        elif direction == 'd':
            for i in range(len(word)):
                state_grid[start_index + 15 * i] = word[i]

        board.state = ''.join(state_grid)
        ret_board = str(board.state)
        ret_updated = board.updated_at;
        session.commit()

    return jsonify({
        'board': ret_board,
        'updated_at': ret_updated,
    })

@app.route("/board", methods=["GET"])
def get_board():
    x = request.args.get('x')
    y = request.args.get('y')

    with Session(engine.engine) as session:
        board = session.scalars(
            select(models.Board).where(
                models.Board.x == 0, models.Board.y == 0
            ),
        ).one()
        ret_updated = str(board.updated_at)
        ret_board = str(board.state)

    return jsonify({
        'board': ret_board,
        'updated_at': ret_updated,
    })

@app.route("/index", methods=["GET"])
def index():
    return render_template('index.html')
