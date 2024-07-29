import { Component } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../../models';
import { Inscription } from '../../../inscriptions/models';
import { Student } from '../../../students/models';
import { CoursesService } from '../../../../../core/services/courses.service';
import { InscriptionsService } from '../../../../../core/services/inscriptions.service';
import { StudentsService } from '../../../../../core/services/students.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent {
  curso$: Observable<Course | undefined>;
  inscriptions$: Observable<Inscription[]>;
  students$: Observable<Student[]>;
  courseDetail$: Observable<{ course: Course | undefined, inscriptions: Inscription[], students: Student[] }>;

  constructor(
    private coursesService: CoursesService,
    private inscriptionsService: InscriptionsService,
    private studentsService: StudentsService,
    private activatedRoute: ActivatedRoute
  ) {
    const courseId = this.activatedRoute.snapshot.params['id'];

    this.curso$ = this.coursesService.getCourseById(courseId);
    this.inscriptions$ = this.inscriptionsService.getInscriptionsByCourse(courseId);
    this.students$ = this.studentsService.getStudents();

    this.courseDetail$ = combineLatest([this.curso$, this.inscriptions$, this.students$]).pipe(
      map(([course, inscriptions, students]) => ({ course, inscriptions, students }))
    );
  }
}
