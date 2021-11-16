function Directions() {
  return [
    new Direction ('up', 0, -1),
    new Direction ('up-forward', 1, -1),
    new Direction ('up-forward', 1, -1),
    new Direction ('up-backward', -1, -1),
    new Direction ('down', 0, 1),
    new Direction ('down', 0, 1),
    new Direction ('down-forward', 1, 1),
    new Direction ('down-forward', 1, 1),
    new Direction ('down-backward', -1, 1),
    new Direction('forward', 1, 0),
    new Direction('forward', 1, 0),
    new Direction('backward', -1, 0),
  ]
}

function Direction(name, x, y) {
  this.name = name;
  this.x = x;
  this.y = y;
}