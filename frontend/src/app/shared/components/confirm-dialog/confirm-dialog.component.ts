import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button color="warn" (click)="onYesClick()">Delete</button>
    </mat-dialog-actions>
  `,
    styles: [`
    mat-dialog-actions {
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class ConfirmDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
    ) { }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    onYesClick(): void {
        this.dialogRef.close(true);
    }
} 