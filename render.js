/*

Document Name: render.js
Last Updated: August 19, 2023

# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- #
# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- NICHOLAS AYAT -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- #
# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- #

*/

// *****Color Pairing*****

const startColor = d3.schemeTableau10[4]; //green
const endColor = d3.schemeTableau10[2]; //red
const colorScale = d3.scaleLinear().domain([0, 1]).range([startColor, endColor])

const wallColor = hair_1;
const openColor = d3.schemeTableau10[9];
const visitedColor = 'yellow'
const frontierColor = d3.interpolateViridis;
const pathColorScheme = d3.interpolateCool;


// *****Render to Screen*****

function renderMaze(selection, grid, start, end) {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            selection.append('rect')
                .attr('transform', `translate(${c * rectWidth}, ${r * rectHeight})`)
                .attr('width', rectWidth)
                .attr('height', rectHeight)
                .attr('fill', function(d, i) {
                    if (areEqual([r, c], start)) {
                        return startColor;
                    }

                    if (areEqual([r, c], end)) {
                        return endColor;
                    }
                    if (grid[r][c] == 1) {
                        return wallColor;
                    } else {
                        return openColor;
                    }
                })
                .attr('r', r)
                .attr('c', c)


        }
    }


}

function renderSearch(selection, grid, start, end, frontier) {
    //renderMaze(selection, grid, start, end);
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            let row = "[r=\"" + r + "\"]"
            let col = "[c=\"" + c + "\"]"
            if (areEqual(start, [r, c])) {
                selection.selectAll(row + col)
                    .attr('fill', startColor);
            } else if (areEqual(end, [r, c])) {
                selection.selectAll(row + col)
                    .attr('fill', endColor);
            } else if (isInPath(frontier, [r, c]) > -1) {
                //let index = isInPath(frontier, [r, c])
                selection.select(row + col)

                .transition().duration(125)
                    .attr('fill', frontierColor(0))
                    .transition().duration(125)
                    .attr('fill', frontierColor(0.25))
                    .transition().duration(125)
                    .attr('fill', frontierColor(.5))
                    .transition().duration(125)
                    .attr('fill', frontierColor(.75))
                    .transition().duration(125)
                    .attr('fill', frontierColor(1))
                    .attr('fill', visitedColor);

            }
        }
    }
}

function renderPath(selection, grid, start, end, path) {
    let duration = 500;
    /*  for (let r = grid.length - 1; r > -1; r--) {
        for (let c = grid[r].length - 1; c > - 1; c--) { */
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            let row = "[r=\"" + r + "\"]"
            let col = "[c=\"" + c + "\"]"
            if (areEqual(start, [r, c])) {
                selection.selectAll(row + col)
                    .attr('fill', startColor);
            } else if (areEqual(end, [r, c])) {
                selection.selectAll(row + col)
                    .attr('fill', endColor);
            } else if (isInPath(path, [r, c]) > -1) {
                let index = isInPath(path, [r, c]);
                let color = d3.color(getColor(path.length, index, pathColorScheme, false));
                // color.opacity = 0.75

                selection.select(row + col)
                    .transition().duration(75 * (path.length - index))
                    .attr('fill', color);
            }
        }
    }
}

function getColor(length, index, colorScheme, inverse) {
    const scale = d3.scaleLinear().domain([0, length]).range([0, 1]);
    // Inverse == bool
    return colorScheme(Math.abs((+inverse) - scale(index)));


}

// *****Render to Console*****

var regularArrows = ['←', '→', '↑', '↓'];
var dashedArrows = ['⇠', '⇢', '⇡', '⇣'];

//Rendering

/*
Return a arrow point to the direction of [r,c]
arrows array must represent: 
arrows[0] = left
arrows[1] = right
arrows[2] = up
arrows[3] = down

 */

function toArrow([r, c], arrows) {
    // Left 
    if (r == 0 && c == -1) {
        return arrows[0];
    }
    // Right
    else if (r == 0 && c == 1) {
        return arrows[1];
    }
    // Up
    else if (r == -1 && c == 0) {
        return arrows[2];
    }
    // Down
    else if (r == 1 && c == 0) {
        return arrows[3];
    }
}

/**
[*][⇠][→]
[↑][↑][■]
[→][■][ ]
@param {any} grid
@param {any} came_from

 */
function renderConsole(grid, came_from, start, end, path) {
    let output = ""
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            output += "["
            let prev = came_from.get([r, c]);

            if (r == start[0] &&
                c == start[1]) {
                output += "S"
            } else if (r == end[0] &&
                c == end[1]) {
                output += "E"
            } else if (grid[r][c] == 1) {
                output += "■";
            } else if (prev == null) {
                output += " ";
            } else {
                let dir = [prev[0] - r, prev[1] - c];

                if (includes(path, [r, c])) {
                    output += toArrow(dir, regularArrows);;
                } else {
                    output += " ";
                }

            }
            output += "]";
        }
        output += "\n";
    }

    console.log(output);
}