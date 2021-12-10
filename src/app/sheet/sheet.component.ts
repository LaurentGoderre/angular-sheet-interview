import { Component, OnInit } from '@angular/core';

interface Operation {
  previousValue: any;
  newValue: any;
  rowIndex: number;
  colIndex: number;
}

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss']
})
export class SheetComponent implements OnInit {

  public rows = 10;
  public cols = 10;

  public matrix: any[];
  public undoQueue: Operation[] = [];
  public redoQueue: Operation[] = [];

  constructor() {
    this.matrix = new Array(this.rows);
    for (let row = 0; row < this.rows; row++) {
      this.matrix[row] = new Array(this.cols);
      for (let col = 0; col < this.cols; col++) {
        this.matrix[row][col] = Symbol();
      }
    }
  }

  ngOnInit(): void {
  }

  onEdit(newValue: any, rowIndex: number, colIndex: number) {
    const previousValue = this.matrix[rowIndex][colIndex];
    this.matrix[rowIndex][colIndex] = newValue;
    this.undoQueue.push({
      previousValue,
      newValue,
      rowIndex,
      colIndex
    });
    this.redoQueue.splice(0, this.redoQueue.length);
  }

  onUndo(): void {
    const lastOperation = this.undoQueue.pop();
    this.matrix[lastOperation!.rowIndex][lastOperation!.colIndex] = lastOperation!.previousValue;
    this.redoQueue.push(this.invertOperation(lastOperation!));
  }

  onRedo(): void {
    const lastOperation = this.redoQueue.pop();
    this.matrix[lastOperation!.rowIndex][lastOperation!.colIndex] = lastOperation!.previousValue;
    this.undoQueue.push(this.invertOperation(lastOperation!))
  }

  private invertOperation(operation: Operation): Operation {
    return {
      ...operation,
      previousValue: operation.newValue,
      newValue: operation.previousValue,
    };
  }

}
