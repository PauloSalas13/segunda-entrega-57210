import { Pipe, PipeTransform } from '@angular/core';
import { Course } from '../../features/dashboard/courses/models';
import { Inscription } from '../../features/dashboard/inscriptions/models';
import { Student } from '../../features/dashboard/students/models';

@Pipe({
  name: 'courseDetail'
})
export class CourseDetailPipe implements PipeTransform {
  transform(course: Course | undefined, inscriptions: Inscription[], students: Student[]): string {
    if (!course) {
      return 'Curso no encontrado';
    }

    let result = `Course: ${course.name}<br>Start Date: ${course.startDate.toLocaleDateString()}<br>End Date: ${course.endDate.toLocaleDateString()}<br>`;

    const studentsInCourse = inscriptions
      .filter(inscription => inscription.courseId === course.id)
      .map(inscription => {
        const student = students.find(s => s.rut === inscription.studentId);
        return student ? {
          name: student.name,
          surname: student.surname,
          email: student.email,
          phone: student.phone,
          address: student.address,
        } : null;
      })
      .filter(student => student !== null) as Student[];

    if (studentsInCourse.length > 0) {
      result += 'Students:<br>';
      studentsInCourse.forEach(student => {
        if (student) { 
          result += `- ${student.name} ${student.surname}, Email: ${student.email}, Phone: ${student.phone}, Address: ${student.address}<br>`;
        }
      });
    } else {
      result += 'No tiene estudiantes inscritos';
    }

    return result;
  }
}
