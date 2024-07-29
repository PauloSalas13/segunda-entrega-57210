import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { StudentsService } from '../../../core/services/students.service';
import { ConfirmationDialogComponent } from '../mensajes/confirmation-dialog/confirmation-dialog.component';
import { Student } from './models';
import { ChangeDetectorRef } from '@angular/core';
import { ErrorDialogComponent } from '../mensajes/error-dialog/error-dialog.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  loading = false;
  isModalOpen = false;
  displayedColumns = ['rut', 'name', 'surname', 'registrationDate', 'address', 'phone', 'email', 'active', 'actions'];
  studentForm: FormGroup;

  editingStudent: Student | null = null;

  constructor(
    private fb: FormBuilder,
    private studentsService: StudentsService,
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.studentForm = this.fb.group({
      rut: [null, [Validators.required]],
      name: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      registrationDate: [null, [Validators.required]],
      address: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      email: [null, [Validators.required]],
      active: [false],
    });
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.loading = true;
    this.studentsService.getStudents().subscribe({
      next: (studentsFromDB) => {
        console.log('lectura de estudiantes del servicio:', studentsFromDB);
        this.students = studentsFromDB;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error leyendo estudiantes:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.dialog.open(ErrorDialogComponent, {
        data: {
          title: 'Formulario inválido',
          message: 'Por favor, complete todos los campos requeridos correctamente.'
        }
      });
    } else {
      if (this.editingStudent) {
        this.studentsService.editStudentByRut(this.editingStudent.rut, this.studentForm.value);
        this.editingStudent = null;
      } else {
        this.studentsService.createStudent(this.studentForm.value);
      }

      this.loadStudents();
      this.studentForm.reset();
      this.closeModal();
    }
  }

  onDelete(rut: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: '¿Está seguro de que desea eliminar este estudiante?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentsService.deleteStudentByRut(rut);
        this.loadStudents();
      }
    });
  }

  onEdit(editingStudent: Student) {
    this.editingStudent = editingStudent;
    this.studentForm.patchValue(editingStudent);
    this.openModal(); 
  }

  openModal(): void {
    this.isModalOpen = true;
    setTimeout(() => {
      this.changeDetectorRef.detectChanges();
    }, 0);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingStudent = null;
    this.studentForm.reset();
    this.changeDetectorRef.detectChanges();
  }
}
