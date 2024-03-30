const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.font = "16px sansserif";

let CELL_SIZE = 30;
let GRID_DIMENSION = 15;
let TILE_BUFFER = 8;

let GRID = [];

const url_base='http://localhost:5000/';

// TOCO: render board and placed tiles separately
async function fetchBoard() {
    const response = await fetch(url_base + 'board?x=0&y=0');
    const responseJson = await response.json();
    const board = responseJson.board;
    const updatedDate = new Date(responseJson.updated_at);
    if (LAST_UPDATE == null || LAST_UPDATE < updatedDate) {
	GRID = [];
	LAST_UPDATE = updatedDate;
	for (let i = 0; i < GRID_DIMENSION; i++) {
	    GRID.push([]);
	    for (let j = 0; j < GRID_DIMENSION; j++) {
		let gridChar = board.charAt(i * GRID_DIMENSION + j);
		GRID[i].push(gridChar);
	    }
	}
	drawCanvas();
    }
}

async function submitWord() {
    if (WORD.length == 0) {
	return;
    }
    const response = await fetch(
	url_base + 'word',
	{
	    method: 'POST',
	    headers: {
		"Content-Type": "application/json",
	    },
	    body: JSON.stringify({
		x: START_Y, // fix this
		y: START_X,
		direction: DIRECTION,
		word: WORD,
	    }),
	},
    );
    const responseJson = await response.json();
    const board = responseJson.board;
    for (let i = 0; i < GRID_DIMENSION; i++) {
	GRID.push([]);
	for (let j = 0; j < GRID_DIMENSION; j++) {
	    let gridChar = board.charAt(i * GRID_DIMENSION + j);
	    GRID[i].push(gridChar);
	}
    }
}

let TILES = ['A', 'B', 'C', 'D', 'E', 'F'];

let SELECTED = null;
let PLACED = [];
let START_X = null;
let START_Y = null;
let DIRECTION = 'a';
let WORD = '';
let LAST_UPDATE = null;

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // board
    ctx.fillStyle = "Black";
    for (let i = 0; i < GRID_DIMENSION; i++) {
	for (let j = 0; j < GRID_DIMENSION; j++) {
	    ctx.beginPath();
	    ctx.rect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
	    if (GRID[j][i] !== '_') {
		ctx.fillText(
		    GRID[j][i],
		    i * CELL_SIZE + CELL_SIZE / 3,
		    (j + 1) * CELL_SIZE - CELL_SIZE / 3,
		);		
	    } else if (PLACED.length == 1) {
		if ((j == START_X + 1 && i == START_Y) ||
		    (i == START_Y + 1 && j == START_X)) {
		    ctx.fillStyle = "#DDDDDD";
		    ctx.fill();
		    ctx.fillStyle = "Black";
		}
	    } else if (PLACED.length > 1) {
		if ((DIRECTION == 'd' &&
		     j == START_X + PLACED.length &&
		     i == START_Y) ||
		    (DIRECTION == 'a' &&
		     j == START_X &&
		     i == START_Y + PLACED.length)
		   ) {
		    ctx.fillStyle = "#DDDDDD";
		    ctx.fill();
		    ctx.fillStyle = "Black";
		}
	    }
	    ctx.stroke();
	}
    }

    // tiles
    for (let i = 0; i < TILES.length; i++) {
	if (TILES[i] == '_') {
	    continue;
	}
	ctx.beginPath();
	ctx.rect(
	    i * (CELL_SIZE + TILE_BUFFER),
	    CELL_SIZE * (GRID_DIMENSION + 1),
	    CELL_SIZE,
	    CELL_SIZE,
	);
	if (i == SELECTED) {
	    ctx.fillStyle = "#BBBBBB";
	    ctx.fill();
	    ctx.fillStyle = "Black";
	} else if (PLACED.includes(i)) {
	    ctx.fillStyle = "#BBBBBB";
	    ctx.strokeStyle = "#BBBBBB";
	}
	ctx.fillText(
	    TILES[i],
	    i * (CELL_SIZE + TILE_BUFFER) + CELL_SIZE / 3,
	    CELL_SIZE * (GRID_DIMENSION + 2) - CELL_SIZE / 3,
	);
	ctx.stroke();
	ctx.fillStyle = "Black";
	ctx.strokeStyle = "Black";
    }

    // submit button
    ctx.beginPath();
    ctx.rect(
	0,
	CELL_SIZE * (GRID_DIMENSION + 3),
	(CELL_SIZE + TILE_BUFFER) * 2,
	CELL_SIZE,
    );
    ctx.fillText(
	"SUBMIT",
	TILE_BUFFER,
	CELL_SIZE * (GRID_DIMENSION + 3) + CELL_SIZE * 2 / 3,
    );

    // cancel button
    ctx.rect(
	(CELL_SIZE + TILE_BUFFER) * 2 + TILE_BUFFER * 2,
	CELL_SIZE * (GRID_DIMENSION + 3),
	(CELL_SIZE + TILE_BUFFER) * 2,
	CELL_SIZE,
    )
    ctx.fillText(
	"CANCEL",
(CELL_SIZE + TILE_BUFFER) * 2 + TILE_BUFFER * 3,
	CELL_SIZE * (GRID_DIMENSION + 3) + CELL_SIZE * 2 / 3,
    );
    ctx.stroke();    		 
}

function placeTile(mouseX, mouseY) {
    let i = Math.floor(mouseX / CELL_SIZE);
    let j = Math.floor(mouseY / CELL_SIZE);

    // validate move
    if (SELECTED === null) {
	return;
    }
    if (GRID[j][i] != '_') {
	return;
    }

    // TODO: clean this all up
    if (PLACED.length == 1) {
	if (j == START_X + 1 && i == START_Y) {
	    DIRECTION = 'd';
	} else if (i == START_Y + 1 && j == START_X) {
	    DIRECTION = 'a';
	} else {
	    return;
	}
    }
    if (PLACED.length > 1) {
	if (!((DIRECTION == 'd' &&
	       j == START_X + PLACED.length &&
	       i == START_Y) ||
	      (DIRECTION == 'a' &&
	       j == START_X &&
	       i == START_Y + PLACED.length)
	     )) {
	    return;
	}
    }

    GRID[j][i] = TILES[SELECTED];
    PLACED.push(SELECTED);
    WORD += TILES[SELECTED];
    if (PLACED.length == 1) {
	START_X = j;
	START_Y = i;
    }
    SELECTED = null;

}

async function handleMouseDown(e) {
    // get current mouse position
    var rect = canvas.getBoundingClientRect();
    const mouseX = parseInt(e.clientX) - rect.left;
    const mouseY = parseInt(e.clientY) - rect.top;

    // click on tiles
    if (mouseY >= (GRID_DIMENSION + 1) * CELL_SIZE &&
	mouseY <= (GRID_DIMENSION + 2) * CELL_SIZE) {
	if (mouseX < TILES.length * (CELL_SIZE + TILE_BUFFER)) {
	    const idx = Math.floor(mouseX / (CELL_SIZE + TILE_BUFFER));
	    if (!PLACED.includes(idx)) {
		SELECTED = idx;
	    }
	}
    }

    // click on grid
    if (mouseY <= GRID_DIMENSION * CELL_SIZE) {
	placeTile(mouseX, mouseY);
    }

    // click submit or cancel
    if (mouseY >= (GRID_DIMENSION + 3) * CELL_SIZE && mouseY <= (GRID_DIMENSION + 4) * CELL_SIZE) {
	// submit
	if (mouseX <= (CELL_SIZE + TILE_BUFFER) * 2) {
	    await submitWord();
	    await fetchBoard();
	    PLACED = [];
	    SELECTED = null;
	    START_X = null;
	    START_Y = null;
	    WORD = '';
	}

	// cancel
	if (mouseX >= (CELL_SIZE + TILE_BUFFER) * 2 + TILE_BUFFER && mouseX <= (CELL_SIZE + TILE_BUFFER) * 4 + TILE_BUFFER * 3) {
	    PLACED = [];
	    SELECTED = null;
	    START_X = null;
	    START_Y = null;
	    WORD = '';
	    await fetchBoard();
	}
    }

    drawCanvas();
}

async function refresh() {
    if (PLACED.length != 0) {
	return;
    }
    await fetchBoard();
    setTimeout(refresh, 10000);
}

// event listeners
canvas.addEventListener("mousedown", (e) => handleMouseDown(e));

await refresh();

