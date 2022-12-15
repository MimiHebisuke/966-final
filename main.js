const MAZE_LEN=8;
const BLOCK_PROB = 0.35; 
const RANDOM_WALK = 0.00;


const NEIGHBOR_DIRS = [
    [0,1], [0,-1], [1,0], [-1, 0]
]

const MAZE = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

function generateMaze(){
    var x = new Array(MAZE_LEN)
    for (var i = 0; i < x.length; i++) {
        x[i] = new Array(MAZE_LEN);
        for(var j = 0; j < x[i].length; j++)
        {
            var temp = Math.random();
            if(temp < BLOCK_PROB){
                x[i][j] = 1;
            }
            else{
                x[i][j] = 0;
            }
        }
      }
    return x;
}


function is_valid(x, y)
{
    return (x >= 0) && (x < MAZE_LEN) && (y >= 0) && (y < MAZE_LEN);
}

function find_distance_dijkstra()
{
    distance[END[0]][END[1]] = 0;
    var q = [END];
    while(q.length > 0)
    {
        var curr_position = q.shift();
        if(curr_position[0] == START[0] && curr_position[1] == START[1]){
            break;
        }
        var curr_distance = distance[curr_position[0]][curr_position[1]];
        for(var i = 0; i < NEIGHBOR_DIRS.length; i ++)
        {
            
            var new_x = curr_position[0] + NEIGHBOR_DIRS[i][0];
            var new_y = curr_position[1] + NEIGHBOR_DIRS[i][1];

            if(is_valid(new_x, new_y)&& maze[new_x][new_y] != 1 && curr_distance + 1 < distance[new_x][new_y])
            {
                distance[new_x][new_y] = curr_distance + 1;
                q.push([new_x, new_y]);
            }
        }
    }
}
function find_distance_AStar()
{
    distance_AStar[END[0]][END[1]] = 0;
    var openList = [[END,0]]; //START F value = 0
    var closeList = new Set();

    while(openList.length > 0)
    {
        // TODO FIND THE THING WITH THE LOWEST VALUE
        var curr_index = 0;

        for(var i = 0; i < openList.length; i++)
        {
            if(openList[i][1] < openList[curr_index][1])
            {
                curr_index = i;
            }
        }
        
        var curr_position = openList[curr_index][0];

        openList.splice(curr_index, 1);
        closeList.add(curr_position);

        if(curr_position[0] == START[0] && curr_position[1] == START[1]){
            break;
        }

        var curr_distance = distance_AStar[curr_position[0]][curr_position[1]];
        for(var i = 0; i < NEIGHBOR_DIRS.length; i ++)
        {
            
            var new_x = curr_position[0] + NEIGHBOR_DIRS[i][0];
            var new_y = curr_position[1] + NEIGHBOR_DIRS[i][1];

            if(is_valid(new_x, new_y)&& maze[new_x][new_y] != 1 && !closeList.has([new_x, new_y]) )
            {
                
                var d = curr_distance + 1;
                if(d < distance_AStar[new_x][new_y]){
                    var expected_distance = Math.abs(new_x - START[0]) + Math.abs(new_y - START[1]);
                    distance_AStar[new_x][new_y] = d;
                    openList.push([[new_x, new_y], expected_distance + distance_AStar[new_x][new_y]]);
                }
            }
        }
    }
}
function get_path(distance, isAStar){
    var curr = START;
    var path = Array(0);
    while(curr[0] != END[0] || curr[1] != END[1])
    {
        //probability of not going the shortest path
        var isRandom = Math.random() < RANDOM_WALK;
        var bestPath = Array(0);
        var badPath = Array(0); 
        for(var i = 0; i < NEIGHBOR_DIRS.length; i ++)
        {
            
            var new_x = curr[0] + NEIGHBOR_DIRS[i][0];
            var new_y = curr[1] + NEIGHBOR_DIRS[i][1];

            if(is_valid(new_x, new_y)&& maze[new_x][new_y] != 1)
            {
                if(distance[curr[0]][curr[1]] > distance[new_x][new_y])
                {
                    bestPath.push(i);
                }
                else{
                    badPath.push(i); // Should this exclude unexplore? 
                }
            }
        }
        // console.log(curr);
        // console.log(bestPath, badPath);
        var next;
        if(!isAStar){
            //Disjtra random random
            if(bestPath.length == 0 || (isRandom && badPath.length != 0)){
                next = badPath[Math.floor(Math.random() * badPath.length)];
            }
            else{
                next = bestPath[Math.floor(Math.random() * bestPath.length)];
            }
        }else
        {
            if(!isRandom && bestPath.length != 0)
            {
                next = bestPath[Math.floor(Math.random() * bestPath.length)];
            }
            else{ //pick the more likely possible path 
                var min_expected_distance = MAZE_LEN*MAZE_LEN;
                next = 0;
                for(var i = 0; i < NEIGHBOR_DIRS.length; i ++)
                {
                    var new_x = curr[0] + NEIGHBOR_DIRS[i][0];
                    var new_y = curr[1] + NEIGHBOR_DIRS[i][1];
                    var expected_distance = Math.abs(new_x - END[0]) + Math.abs(new_y - END[1]);
                    if(is_valid(new_x, new_y)&& maze[new_x][new_y] != 1)
                    {
                        if(min_expected_distance > distance[new_x][new_y] + expected_distance)
                        {
                           next = i;
                           min_expected_distance = distance[new_x][new_y] + expected_distance;
                        }
            
                    }
                }
            }
        }
        switch(next){
            case 0:
                path.push("R");
                break;
            case 1:
                path.push("L");
                break;
            case 2:
                path.push("D");
                break;
            case 3:
                path.push("U");
                break;
        }
        curr = [curr[0] + NEIGHBOR_DIRS[next][0], curr[1] + NEIGHBOR_DIRS[next][1]];
        
        
    }
    return path; 
}
var START = [Math.floor(Math.random() * MAZE_LEN), Math.floor(Math.random() * MAZE_LEN)];
var END = [Math.floor(Math.random() * MAZE_LEN), Math.floor(Math.random() * MAZE_LEN)];

var distance = new Array(MAZE_LEN);
for (var i = 0; i < distance.length; i++) {
    distance[i] = new Array(MAZE_LEN).fill(Infinity);
}
var distance_AStar = new Array(MAZE_LEN);
for (var i = 0; i < distance_AStar.length; i++) {
    distance_AStar[i] = new Array(MAZE_LEN).fill(Infinity);
}

while(distance[START[0]][START[1]] == Infinity || distance[START[0]][START[1]] <= 8)
{
    START = [Math.floor(Math.random() * MAZE_LEN), Math.floor(Math.random() * MAZE_LEN)];
    END = [Math.floor(Math.random() * MAZE_LEN), Math.floor(Math.random() * MAZE_LEN)];
    for (var i = 0; i < distance.length; i++) {
        distance[i] = new Array(MAZE_LEN).fill(Infinity);
        distance_AStar[i] = new Array(MAZE_LEN).fill(Infinity);
    }
    var maze = generateMaze();
    //var maze = MAZE;
    maze[START[0]][START[1]] = 0;
    maze[END[0]][END[1]] = 0;
    find_distance_dijkstra();
    
}
find_distance_AStar();
console.log(maze)
console.log(START, END)
// console.log(distance)
console.log(get_path(distance, false))
// console.log(distance_AStar)
// console.log(get_path(distance_AStar, true))

// module.exports = {
//     myAdd: get_path()
// };

// module.exports = {
//     myAdd: function(x, y) { return x + y; }
//   };