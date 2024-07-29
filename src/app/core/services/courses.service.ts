import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subscription } from 'rxjs';
import { Course } from '../../features/dashboard/courses/models';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CoursesService implements OnDestroy {
  private MY_DATABASE: Course[] = [];
  private readonly JSON_URL = 'assets/courses.json';
  private subscription: Subscription | null = null;

  constructor(private http: HttpClient) {
    this.loadCoursesFromJSON();
  }

  private loadCoursesFromJSON(): void {
    this.subscription = this.http.get<Course[]>(this.JSON_URL).subscribe(data => {
      this.MY_DATABASE = data.map(course => ({
        ...course,
        startDate: new Date(course.startDate),
        endDate: new Date(course.endDate)
      }));
    });
  }

  private saveCoursesToJSON(): Observable<void> {
    return this.http.put<void>(this.JSON_URL, this.MY_DATABASE).pipe(
      catchError((error) => {
        console.error('Error al guardar Cursos:', error);
        throw error;
      })
    );
  }

  getCourses(): Observable<Course[]> {
    return new Observable(observer => {
      if (this.MY_DATABASE.length === 0) {
        this.loadCoursesFromJSON();
        this.subscription = this.http.get<Course[]>(this.JSON_URL).subscribe(data => {
          this.MY_DATABASE = data.map(course => ({
            ...course,
            startDate: new Date(course.startDate),
            endDate: new Date(course.endDate)
          }));
          observer.next(this.MY_DATABASE);
          observer.complete();
        });
      } else {
        observer.next(this.MY_DATABASE);
        observer.complete();
      }
    });
  }

  getCourseById(id: string): Observable<Course | undefined> {
    return this.getCourses().pipe(
      map(todosLosCursos => todosLosCursos.find(el => el.id === id))
    );
  }

  addCourse(course: Course): Observable<Course[]> {
    this.MY_DATABASE.push(course);
    this.saveCoursesToJSON().subscribe();
    return this.getCourses();
  }

  editCourseById(id: string, update: Course): Observable<Course[]> {
    this.MY_DATABASE = this.MY_DATABASE.map(el =>
      el.id === id ? { ...update, id } : el
    );
    this.saveCoursesToJSON().subscribe();
    return this.getCourses();
  }

  deleteCourseById(id: string): Observable<Course[]> {
    this.MY_DATABASE = this.MY_DATABASE.filter(el => el.id != id);
    this.saveCoursesToJSON().subscribe();
    return this.getCourses();
  }

  searchCoursesByName(search: string): Observable<Course[]> {
    return this.getCourses().pipe(
      map(todosCursos =>
        todosCursos.filter(curso =>
          curso.name.toLowerCase().includes(search.toLowerCase())
        )
      )
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

