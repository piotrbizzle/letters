const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.font = "16px sansserif";

let CELL_SIZE = 30;
let GRID_DIMENSION = 15;
let TILE_BUFFER = 8;

let GRID = [];

for (let i = 0; i < GRID_DIMENSION; i++) {
    GRID.push([]);
    for (let j = 0; j < GRID_DIMENSION; j++) {
	GRID[i].push('');
    }
}

let TILES = ['A', 'B', 'C', 'D', 'E', 'F'];

let SELECTED = null;

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // board
    ctx.fillStyle = "Black";
    for (let i = 0; i < GRID_DIMENSION; i++) {
	for (let j = 0; j < GRID_DIMENSION; j++) {
	    ctx.beginPath();
	    ctx.rect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
	    if (GRID[j][i] !== '') {
		ctx.fillText(
		    GRID[j][i],
		    i * CELL_SIZE + CELL_SIZE / 3,
		    (j + 1) * CELL_SIZE - CELL_SIZE / 3,
		);
	    }
	    ctx.stroke();
	}
    }

    // tiles
    for (let i = 0; i < TILES.length; i++) {
	if (TILES[i] == '') {
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
	}
	ctx.fillText(
	    TILES[i],
	    i * (CELL_SIZE + TILE_BUFFER) + CELL_SIZE / 3,
	    CELL_SIZE * (GRID_DIMENSION + 2) - CELL_SIZE / 3,
	);
	ctx.stroke();
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

function handleMouseDown(e) {
    // get current mouse position
    var rect = canvas.getBoundingClientRect();
    const mouseX = parseInt(e.clientX) - rect.left;
    const mouseY = parseInt(e.clientY) - rect.top;

    // click on tiles
    if (mouseY >= (GRID_DIMENSION + 1) * CELL_SIZE &&
	mouseY <= (GRID_DIMENSION + 2) * CELL_SIZE) {
	if (mouseX < TILES.length * (CELL_SIZE + TILE_BUFFER)) {
	    const idx = Math.floor(mouseX / (CELL_SIZE + TILE_BUFFER));
	    SELECTED = idx;
	}
    }

    // click on grid
    if (mouseY <= GRID_DIMENSION * CELL_SIZE) {
	let i = Math.floor(mouseX / CELL_SIZE);
	let j = Math.floor(mouseY / CELL_SIZE);
	if (SELECTED !== null && GRID[j][i] == '') {
	    GRID[j][i] = TILES[SELECTED];
	    TILES[SELECTED] = '';
	    SELECTED = null;
	}
    }

    // click submit or cancel
    if (mouseY >= (GRID_DIMENSION + 3) * CELL_SIZE && mouseY <= (GRID_DIMENSION + 4) * CELL_SIZE) {
	// submit
	if (mouseX <= (CELL_SIZE + TILE_BUFFER) * 2) {
	    console.log("SUBMIT");
	}
	// cancel
	if (mouseX >= (CELL_SIZE + TILE_BUFFER) * 2 + TILE_BUFFER && mouseX <= (CELL_SIZE + TILE_BUFFER) * 4 + TILE_BUFFER * 3) {
	    console.log("CANCEL");
	}
    }

    drawCanvas();
}

// event listeners
canvas.addEventListener("mousedown", handleMouseDown);


drawCanvas();
			  
