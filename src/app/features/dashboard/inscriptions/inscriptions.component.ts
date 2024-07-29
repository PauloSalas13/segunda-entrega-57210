import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../../core/services/students.service';
import { CoursesService } from '../../../core/services/courses.service';
import { InscriptionsService } from '../../../core/services/inscriptions.service';
import { Student } from '../students/models';
import { Course } from '../courses/models';
import { Inscription } from './models';
import { DialogOkComponent } from '../mensajes/dialogOk/dialogOk.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../mensajes/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-inscriptions',
  templateUrl: './inscriptions.component.html',
  styleUrls: ['./inscriptions.component.scss']
})
export class InscriptionsComponent implements OnInit {
  students: Student[] = [];
  courses: Course[] = [];
  selectedStudent: Student | null = null;
  selectedCourses: Set<string> = new Set<string>();
  inscriptions: Inscription[] = [];
  loadingInscriptions = true;

  constructor(
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private inscriptionsService: InscriptionsService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadStudents()
      .pipe(
        switchMap(() => this.loadCourses()),
        switchMap(() => this.loadInscriptions())
      )
      .subscribe({
        next: () => {
          console.log('Leyo estudiantes');
        },
        error: (err) => {
          console.error('Error leyendo estudiantes:', err);
        }
      });
  }

  loadStudents(): Observable<Student[]> {
    return this.studentsService.getStudents().pipe(
      catchError((err) => {
        console.error('Error leyendo estudiantes:', err);
        return of([]);
      }),
      tap((students) => {
        this.students = students;
        console.log('se leyo ok:', this.students);
      })
    );
  }

  loadCourses(): Observable<Course[]> {
    return this.coursesService.getCourses().pipe(
      catchError((err) => {
        console.error('Error leyendo cursos:', err);
        return of([]);
      }),
      tap((courses) => {
        this.courses = courses;
        console.log('Curso Leidos:', this.courses);
      })
    );
  }

  loadInscriptions(): Observable<Inscription[]> {
    return this.inscriptionsService.getInscriptions().pipe(
      catchError((err) => {
        console.error('Error leyendo inscripciones:', err);
        return of([]); 
      }),
      tap((inscriptions) => {
        this.inscriptions = inscriptions;
        console.log('Inscripciones leidas:', this.inscriptions);
        this.loadingInscriptions = false;
        this.cdr.detectChanges();
      })
    );
  }

  getStudentName(studentId: string): string {
    const student = this.students.find(student => student.rut === studentId);
    return student ? `${student.name} ${student.surname}` : 'Desconocido';
  }

  getCourseName(courseId: string): string {
    const course = this.courses.find(course => course.id === courseId);
    return course ? course.name : 'Desconocido';
  }

  toggleCourseSelection(courseId: string): void {
    if (this.selectedCourses.has(courseId)) {
      this.selectedCourses.delete(courseId);
    } else {
      this.selectedCourses.add(courseId);
    }
  }

  assignCoursesToStudent(): void {
    if (this.selectedStudent) {
      let alreadyAssignedCourses = this.inscriptions
        .filter(inscription => inscription.studentId === this.selectedStudent!.rut)
        .map(inscription => inscription.courseId);

      let newAssignments = Array.from(this.selectedCourses).filter(courseId => !alreadyAssignedCourses.includes(courseId));

      if (newAssignments.length === 0) {
        this.dialog.open(DialogOkComponent, {
          data: { message: 'El estudiante ya está inscrito en todos los cursos seleccionados.' }
        });
        return;
      }

      newAssignments.forEach((courseId) => {
        this.inscriptionsService.addInscription(this.selectedStudent!.rut, courseId).subscribe((inscriptions) => {
          this.inscriptions = inscriptions;
        });
      });

      this.selectedCourses.clear();
      this.selectedStudent = null;
      this.dialog.open(DialogOkComponent, {
        data: { message: 'Cursos asignados correctamente' }
      });
    }
  }

  deleteInscription(inscription: Inscription): void {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: '¿Está seguro de que desea eliminar esta inscripción?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.inscriptionsService.deleteInscription(inscription.studentId, inscription.courseId).subscribe((inscriptions) => {
            this.inscriptions = inscriptions;
            this.cdr.detectChanges();
          });
      }
    });


  }
}

