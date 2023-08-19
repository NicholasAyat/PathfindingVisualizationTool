/*

Document Name: calculate.js
Last Updated: August 19, 2023

# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- #
# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- NICHOLAS AYAT -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- #
# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- #

*/

/** 
Return a buckets.Dictionary() of came_from 
key => [r,c] value => [r,c]--> r,c that key came from

@param {[][]} grid
@param {[r,c]} start
@param {[r,c]} end
 
 */
function breadthFirstSearch(grid, start, end) {
    let frontier = new buckets.Queue();
    frontier.enqueue(start);

    came_from = new buckets.Dictionary();
    came_from.set(start, null);

    while (!frontier.isEmpty()) {
        let current = frontier.dequeue();

        // End when ending object is found
        if (areEqual(current, end)) {
            break;
        }
        let neighbors = getNeighbors(current, grid);
        for (let i = 0; i < neighbors.length; i++) {
            let next = neighbors[i];
            if (!came_from.containsKey(next)) {
                frontier.enqueue(next);
                came_from.set(next, current);

            }
        }
    }

    return came_from;

}

function bfsVisual(grid, start, end) {
    let stages = [];
    let frontier = new buckets.Queue();
    frontier.enqueue(start);

    came_from = new buckets.Dictionary();
    came_from.set(start, null);

    while (!frontier.isEmpty()) {
        stages.push(frontier.toArray());
        let current = frontier.dequeue();

        // End when ending object is found
        if (areEqual(current, end)) {
            break;
        }
        let neighbors = getNeighbors(current, grid);
        for (let i = 0; i < neighbors.length; i++) {
            let next = neighbors[i];
            if (!came_from.containsKey(next)) {
                frontier.enqueue(next);
                came_from.set(next, current);

            }
        }
    }

    return stages;

}

/**
Generates a path from end to start. of a start point and end points
Returns a 2d Array of cells [[r,c], [r,c] , [r,c]]
@param {buckets.Dictionary()} came_from
@param {[r,c]} start
@param {[r,c]} end

 */
function generatePath(came_from, start, end) {
    let current = end;
    let path = [];
    while (!areEqual(current, start)) {

        path.push(current);
        current = came_from.get(current);
        if (current == undefined) {
            break;
        }
    }
    path.push(start) 
    path.reverse() 
    return path;
}


/**
Gets Valid neighbors of param0
neighbors are up, down, left, right
must be open (0) and inbounds
@param {any} param0
@param {[][]} grid
return a array of neighbors

 */
function getNeighbors([row, col], grid) {
    let d = [
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1]
    ];
    let neighbors = [];

    for (let i = 0; i < d.length; i++) {
        let neighbor = [row + d[i][0], col + d[i][1]];
        if (isInBounds(neighbor, grid) && grid[neighbor[0]][neighbor[1]] == 0) {
            neighbors.push(neighbor);
        }
    }

    // Added graphics
    if ((row + col) % 2 == 0) {
        neighbors = neighbors.reverse();
    }
    return neighbors;

}
/**
Returns true if [r,c] is in bounds of grid. False otherwise
@param {any} param0
@param {any} grid

 */
function isInBounds([row, col], grid) {
    return row < grid.length &&
        col < grid[0].length &&
        row >= 0 &&
        col >= 0;
}

/**
Generates a 2d array 0s of numRows and numCols.
0 = open
1 = wall
@param {int} numRows
@param {int} numCols
returns 2d array
 */

function generateGrid(numRows, numCols) {
    let grid = [];
    for (let r = 0; r < numRows; r++) {
        grid[r] = [];
        for (let c = 0; c < numCols; c++) {
            grid[r][c] = 0;
        }
    }
    return grid;
}

/**
Clears the grid of walls
@param {[][]} grid

 */
function clearMaze(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j] = 0;
        }
    }
}

/**
sets the locations in the grid at locs to 0.
@param {[]} grid
@param {[[r,c], [r,c] ...]} locs

 */
function setHole(grid, locs) {
    for (let i = 0; i < locs.length; i++) {
        grid[locs[i][0]][locs[i][1]] = 0;
    }
}

// *****Maze Generation section*****

function addOuterWalls(grid) {
    for (let i = 0; i < grid.length; i++) {
        if (i == 0 || i == (grid.length - 1)) {
            for (let j = 0; j < grid[i].length; j++) {
                grid[i][j] = 1;
            }
        } else {
            grid[i][0] = 1;
            grid[i][grid.length - 1] = 1;
        }
    }
}

function addEntrance(grid) {
    let x = randomNumber(1, grid.length - 1);
    grid[grid.length - 1][x] = 0;
    return x;
}

function addInnerWalls(grid, h, minX, maxX, minY, maxY, gate) {
    if (h) {

        if (maxX - minX < 2) {
            return;
        }

        var y = Math.floor(randomNumber(minY, maxY) / 2) * 2;
        addHWall(grid, minX, maxX, y);

        addInnerWalls(grid, !h, minX, maxX, minY, y - 1, gate);
        addInnerWalls(grid, !h, minX, maxX, y + 1, maxY, gate);
    } else {
        if (maxY - minY < 2) {
            return;
        }

        var x = Math.floor(randomNumber(minX, maxX) / 2) * 2;
        addVWall(grid, minY, maxY, x);

        addInnerWalls(grid, !h, minX, x - 1, minY, maxY, gate);
        addInnerWalls(grid, !h, x + 1, maxX, minY, maxY, gate);
    }
}

function addHWall(grid, minX, maxX, y) {
    var hole = Math.floor(randomNumber(minX, maxX) / 2) * 2 + 1;

    for (var i = minX; i <= maxX; i++) {
        if (i == hole) grid[y][i] = 0;
        else grid[y][i] = 1;
    }
}

function addVWall(grid, minY, maxY, x) {
    var hole = Math.floor(randomNumber(minY, maxY) / 2) * 2 + 1;

    for (var i = minY; i <= maxY; i++) {
        if (i == hole) grid[i][x] = 0;
        else grid[i][x] = 1;
    }
}

function generateMaze(grid) {
    clearMaze(grid);
    addOuterWalls(grid);
    var ent = addEntrance(grid);
    addInnerWalls(grid, true, 1, grid.length - 2, 1, grid.length - 2, ent);
    addOuterWalls(grid);
}

// *****Helpful Functions section*****

/**
returns a random cell location [r,c]
@param {int} numRows
@param {int} numCols

 */
function randomCell(numRows, numCols) {

    let r = Math.floor(Math.random() * numRows);
    let c = Math.floor(Math.random() * numCols);
    return [r, c];


}

function randomCellInOpen(numRows, numCols, grid) {
    for (let i = 0; i < numRows * numCols; i++) {
        let [r, c] = randomCell(numRows, numCols);
        if (grid[r][c] == 0) {
            return [r, c]
        }

    }
}
/**
If two cells are equal to each other.
Javascript == does not work on arrays
@param {[r,c]} param0
@param {[r,c]} param1

 */
function areEqual([r1, c1], [r2, c2]) {

    return r1 == r2 && c1 == c2;
}

/**
Returns true of subarr is in arr. False otherwise.
@param {[][]} arr
@param {[]} subarr

 */
function includes(arr, subarr) {

    for (var i = 0; i < arr.length; i++) {
        let checker = false
        for (var j = 0; j < arr[i].length; j++) {
            if (arr[i][j] === subarr[j]) {
                checker = true
            } else {
                checker = false
                break;
            }
        }
        if (checker) {
            return true;
        }
    }
    return false;
}

function isInPath(path, [r, c]) {
    for (let i = 0; i < path.length; i++) {
        if (areEqual(path[i], [r, c])) {
            return i;
        }
    }
    return -1;
}
/**
Return a random int between min(inclusive) and max(exclusive)
@param {int} min
@param {int} max

 */
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}