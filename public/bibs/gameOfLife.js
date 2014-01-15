define({
  generateEvolver : function(width, height, startLivingPositions){
    var computeNeighborPositions = function(position){
      return [{x: position.x,
               y: position.y - 1 < 0 ? height - 1 : position.y - 1},
              {x: position.x + 1 > width ? 0 : position.x + 1,
               y: position.y - 1 < 0 ? height - 1 : position.y - 1},
              {x: position.x + 1 > width ? 0 : position.x + 1,
               y: position.y},
              {x: position.x + 1 > width ? 0 : position.x + 1,
               y: position.y + 1 > height ? 0 : position.y + 1},
              {x: position.x,
               y: position.y + 1 > height ? 0 : position.y + 1},
              {x: position.x - 1 < 0 ? width - 1 : position.x - 1,
               y: position.y + 1 > height ? 0 : position.y + 1},
              {x: position.x - 1 < 0 ? width - 1 : position.x - 1,
               y: position.y},
              {x: position.x - 1 < 0 ? width - 1 : position.x - 1,
               y: position.y - 1 < 0 ? height - 1 : position.y - 1}];
    };

    var isEqualPosition = function(a, b){
      return a.x === b.x && a.y === b.y;
    };

    var isPositionInCollection = function(position, collection){
      var found = false
      collection.forEach(function(p){
        if (isEqualPosition(p, position)){
          found = true;
        }
      });

      return found;
    };

    var partitionNeighbors = function(neighborPositions, livingCellsCollection){
      var living = [],
      dead = [];

      neighborPositions.forEach(function(neighborPosition){
        if (isPositionInCollection(neighborPosition, livingCellsCollection)){
          living.push(neighborPosition);
        }else{
          dead.push(neighborPosition);
        }
      });

      return {
        living: living,
        dead: dead
      };
    };

    var livingCells;

    // startLivingPositions is array of {x, y}
    if (startLivingPositions == undefined){
      livingCells = [];
    }else{
      livingCells = startLivingPositions;
    }

    return function(){
      livingCells = livingCells.reduce(function(result, cell){
        var neighborPositions = computeNeighborPositions(cell),
        partitions = partitionNeighbors(neighborPositions, livingCells),
        livingCount = partitions.living.length;
        if(livingCount == 2 || livingCount == 3){
          result.push(cell);
        }

        partitions.dead.forEach(function(dead){
          var neighborPositions = computeNeighborPositions(dead),
          partitions = partitionNeighbors(neighborPositions, livingCells),
          livingCount = partitions.living.length;

          if (livingCount == 3 && !isPositionInCollection(dead, result)){
            result.push(dead);
          }
        });

        return result;
      }, []);

      
      return livingCells;
    }
  },

  makeGlider: function(center_x, center_y){
    return [{x:center_x, y:center_y - 1}, 
            {x:center_x + 1, y:center_y}, 
            {x:center_x - 1, y:center_y + 1}, 
            {x:center_x, y:center_y + 1}, 
            {x:center_x + 1, y:center_y + 1}];
  },

  makeNoise: function(width, height, count){
    var result = [];

    for (var i = 0; i < count; i++) {
      result.push({
        x: Math.floor(Math.random() * width), 
        y: Math.floor(Math.random() * height)});
    }

    return result;
  }
}
);
