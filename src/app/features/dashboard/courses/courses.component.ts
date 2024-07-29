import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';
import { Course } from './models';
import { generateSequentialId } from '../../../shared/utils';
import { CoursesService } from '../../../core/services/courses.service';
import { ConfirmationDialogComponent } from '../mensajes/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent implements OnInit {
  nombreCurso = '';

  displayedColumns: string[] = [
    'id',
    'name',
    'startDate',
    'endDate',
    'actions',
  ];

  dataSource: Course[] = [];

  isLoading = false;

  constructor(
    private matDialog: MatDialog,
    private dialog: MatDialog,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.dataSource = courses;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  openDialog(): void {
    this.matDialog
      .open(CourseDialogComponent)
      .afterClosed()
      .subscribe({
        next: (value) => {

          this.nombreCurso = value.name;
          value['id'] = generateSequentialId(this.dataSource);
          this.isLoading = true;
          this.coursesService.addCourse(value).subscribe({
            next: (courses) => {
              this.dataSource = [...courses];
            },
            complete: () => {
              this.isLoading = false;
            },
          });
        },
      });
  }

  editCourse(editingCourse: Course) {
    this.matDialog
      .open(CourseDialogComponent, { data: editingCourse })
      .afterClosed()
      .subscribe({
        next: (value) => {
          if (!!value) {
            this.coursesService
              .editCourseById(editingCourse.id, value)
              .subscribe({
                next: (courses) => {
                  this.dataSource = [...courses];
                },
              });
          }
        },
      });
  }

  deleteCourseById(id: string) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: '¿Está seguro de que desea eliminar este curso?' },
    });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
            this.isLoading = true;
                  this.coursesService.deleteCourseById(id).subscribe({
                    next: (courses) => {
                      this.dataSource = [...courses];
                    },
                    complete: () => {
                      this.isLoading = false;
                    },
                  });
            }
        });
  }
}
