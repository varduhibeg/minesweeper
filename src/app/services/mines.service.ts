import {Injectable} from '@angular/core';
import {Coordinates} from "../util/coordinates";

export type Map = Array<Array<number>>;

@Injectable({
  providedIn: 'root'
})
export class MinesService {

  constructor() {
  }

  generateCoordinates(quantity: number): Coordinates[] {
    let coordinates = new Array<Coordinates>();
    while (coordinates.length !== quantity) {
      let x = ~~(Math.random() * 10);
      let y = ~~(Math.random() * 10);
      let newCoordinate: Coordinates = {x, y};
      if (!coordinates.find(coordinate => coordinate.x === newCoordinate.x && coordinate.y === coordinate.y)) {
        coordinates.push(newCoordinate);
      }
    }
    return coordinates;
  }

  generateMap(size: number): Map {
    return (new Array(size)).fill(0).map(function () {
      return new Array(size).fill(0);
    });
  }

  activateMines(map: Map, mines: Coordinates[]): Map {
    for (let x = 0; x < map.length; x++) {
      for (let y = 0; y < map.length; y++) {
        if (mines.find(coordinate => coordinate.x === x && coordinate.y === y)) {
          map[x][y] = -1
        }
      }
    }
    return map;
  }


  findingNeighbors(mines: Coordinates[], map: Map): Map {
    for (let mine of mines) {
      let i = mine.x;
      let j = mine.y;
      let rowLimit = map.length - 1;
      let columnLimit = map[0].length - 1;

      for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
        for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
          if (x !== i || y !== j) {
            if (map[x][y] !== -1)
              map[x][y]++;
          }
        }
      }
    }
    return map;
  }

}
