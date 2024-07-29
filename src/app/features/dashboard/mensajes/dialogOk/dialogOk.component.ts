import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogOk',
  templateUrl: './dialogOk.component.html',
  styleUrls: ['./dialogOk.component.scss']
})
export class DialogOkComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogOkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}

