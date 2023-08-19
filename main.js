/*

Document Name: main.js
Last Updated: August 19, 2023

# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- #
# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- NICHOLAS AYAT -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- #
# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- #

*/

const dimensions = 31; // Only odds
const numRows = dimensions;
const numCols = dimensions;
const rectWidth = 22;
const rectHeight = 22;
const svgWidth = numCols * rectWidth;
const svgHeight = numRows * rectHeight;

var grid = generateGrid(numRows, numCols);
var start;
var end;
var stage = 0;
var running = false;
var came_from;
var path;
var stages;
var numStages;

var container = d3.select('#interactive');
var svg = d3.select('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .style('display', 'block')
    .style('margin', 'auto');

var start = randomCell(numRows, numCols);
var end = randomCell(numRows, numCols);
var grid = generateGrid(numRows, numCols);

generateMaze(grid);
addOuterWalls(grid)
setHole(grid, [start, end]);
var came_from = breadthFirstSearch(grid, start, end);
var path = generatePath(came_from, start, end).reverse();
var stages = bfsVisual(grid, start, end);
var numStages = stages.length;

renderMaze(svg, grid, start, end);
renderConsole(grid, came_from, start, end, path);
renderSearch(svg, grid, start, end, stages[0])

loop(1)

function loop(i) {
    if (i < numStages) {
        setTimeout(function() {
            renderSearch(svg, grid, start, end, stages[i++]);
            loop(i);
        }, 35);
    } else {
        renderPath(svg, grid, start, end, path)
    }
}