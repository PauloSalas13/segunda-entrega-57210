import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { HighlightNoStudentsDirective } from './directives/highlight-no-students.directive';
import { CourseDetailPipe } from './pipes/course-detail.pipe';
import { ValidateRutPipe } from './pipes/validate-rut.pipe';

import { ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from './utils/custom-validators';

@NgModule({
  declarations: [
    HighlightNoStudentsDirective,
    CourseDetailPipe,
    ValidateRutPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    HighlightNoStudentsDirective,
    CourseDetailPipe,
    ValidateRutPipe
  ],
  providers: [
    {
      provide: CustomValidators,
      useFactory: (validateRutPipe: ValidateRutPipe) => new CustomValidators(validateRutPipe),
      deps: [ValidateRutPipe]
    }
  ],
})
export class SharedModule {}
