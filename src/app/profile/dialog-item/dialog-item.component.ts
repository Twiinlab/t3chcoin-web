import {Component, Inject, Optional} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'dialog-item',
  templateUrl: 'dialog-item.component.html',
  styleUrls: ['./dialog-item.component.css']
})
export class DialogItemComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogItemComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
