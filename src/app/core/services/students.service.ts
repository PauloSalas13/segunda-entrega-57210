import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Student } from '../../features/dashboard/students/models';

@Injectable({
  providedIn: 'root'
})
export class StudentsService implements OnDestroy {
  private students = new BehaviorSubject<Student[]>([]);
  private studentsUrl = 'assets/students.json';
  private subscription!: Subscription;

  constructor(private http: HttpClient) {
    this.loadStudentsFromJson();
  }

  private loadStudentsFromJson() {
    this.subscription = this.http.get<Student[]>(this.studentsUrl).subscribe({
      next: (studentsFromJson) => {
        console.log('Estudiantes leidos correctamente:', studentsFromJson);
        this.students.next(studentsFromJson);
      },
      error: (error) => {
        console.error('Error al leer Estudiantes:', error);
      }
    });
  }

  getStudents(): Observable<Student[]> {
    return this.students.asObservable();
  }

  createStudent(student: Student) {
    const currentValue = this.students.value;
    this.students.next([...currentValue, student]);
  }

  editStudentByRut(rut: string, updatedStudent: Student) {
    const students = this.students.value.map(student =>
      student.rut === rut ? { ...student, ...updatedStudent } : student
    );
    this.students.next(students);
  }

  deleteStudentByRut(rut: string) {
    const updatedStudents = this.students.value.filter(student => student.rut !== rut);
    this.students.next(updatedStudents);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
