import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { CoursesModule } from './courses/courses.module';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ErrorDialogComponent } from './mensajes/error-dialog/error-dialog.component';
import { InscriptionsComponent } from './inscriptions/inscriptions.component';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { DialogOkComponent } from './mensajes/dialogOk/dialogOk.component';

@NgModule({
  declarations: [
    DashboardComponent, 
    ErrorDialogComponent, 
    InscriptionsComponent, 
    DialogOkComponent,    
  ],
  exports: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    CoursesModule,
    MatListModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule
  ],
})
export class DashboardModule {}
