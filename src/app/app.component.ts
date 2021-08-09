import {Component, OnInit} from '@angular/core';
import {Map, MinesService} from "./services/mines.service";
import {Coordinates} from "./util/coordinates";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private mines: Coordinates[] = [];
  private size = 10;
  private map: Map = [];
  // @ts-ignore
  dataSource: MatTableDataSource<any>;
  dataSourceArray: any[] = [];
  displayedColumns: string[] = Array.from(Array(this.size).keys()).map(String);
  shownElements: Coordinates[] = [];
  shownFlags: Coordinates[] = [];
  lost: boolean = false;
  win: boolean = false;
  refresh: boolean = false;


  constructor(private minesService: MinesService) {
  }

  ngOnInit(): void {
    this.initGame();
  }

  onCellClick(cell: { element: {}, col: string }) {
    let coordinate: Coordinates = this.getCoordinate(cell);
    this.onLeftClick(coordinate);
    this.refresh = true;
  }

  onLeftClick(coordinate: Coordinates) {
    if (!(this.isShown(coordinate, "numbers") > -1)) {
      let value = this.dataSourceArray[coordinate.y][coordinate.x];
      if (value === 0) {
        this.openNeighbours(coordinate);
      } else if (value === -1) {
        this.lost = true;
      }
      let index = this.isShown(coordinate, "flags");
      let shownIndex = this.isShown(coordinate, "numbers");
      if (index > -1) {
        this.shownFlags.splice(index, 1);
      }
      if (!(shownIndex > -1)) {
        this.shownElements.push(coordinate);
      }
      if (this.shownElements.length === 90) {
        this.win = true;
      }
    }
  }

  onRightClick($event: MouseEvent, cell: { element: {}; col: string }) {
    $event.preventDefault();
    let coordinate: Coordinates = this.getCoordinate(cell);
    let index = this.isShown(coordinate, "numbers");
    let shownIndex = this.isShown(coordinate, "flags");
    if (shownIndex > -1) {
      this.shownFlags.splice(shownIndex, 1,);
    } else if (!(index > -1)) {
      this.shownFlags.push(coordinate);
    }
  }

  onDoubleClick($event: MouseEvent, cell: { element: {}; col: string }) {
    this.openNeighbours(this.getCoordinate(cell));
  }

  showFlag(cell: { element: {}, col: string }): boolean {
    let coordinate: Coordinates = this.getCoordinate(cell);
    return this.isShown(coordinate, "flags") > -1;
  }

  showNumber(cell: { element: {}, col: string }): boolean {
    let coordinate: Coordinates = this.getCoordinate(cell);
    return this.isShown(coordinate, "numbers") > -1;
  }

  isShown(coordinate: Coordinates, arrayType: "flags" | "numbers"): number {
    let array: Coordinates[] = arrayType === "flags" ? this.shownFlags : this.shownElements;
    return array.indexOf(<Coordinates>array.find(element => element.x === coordinate.x && element.y === coordinate.y));
  }

  openNeighbours(coordinate: Coordinates) {
    let i = coordinate.x;
    let j = coordinate.y;
    let rowLimit = this.map.length - 1;
    let columnLimit = this.map[0].length - 1;

    for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
      for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
        if (x !== i || y !== j) {
          if (!(this.isShown(coordinate, "numbers") > -1)) {
            this.shownElements.push(coordinate);
          }
          this.onLeftClick({x, y})
        }
      }
    }
  }

  initGame() {
    this.refresh = false;
    this.dataSourceArray = [];
    this.shownFlags = [];
    this.shownElements = [];
    this.map = this.minesService.generateMap(this.size);
    this.mines = this.minesService.generateCoordinates(this.size);
    this.minesService.activateMines(this.map, this.mines);
    this.minesService.findingNeighbors(this.mines, this.map);
    for (let array of this.map) {
      this.dataSourceArray.push(Object.assign({}, array));
    }
    this.dataSource = new MatTableDataSource(this.dataSourceArray);
    this.lost = false;
    this.win = false;
  }

  getCoordinate(cell: { element: {}, col: string }): Coordinates {
    return {x: +cell.col, y: this.dataSourceArray.indexOf(cell.element)}
  }



}
