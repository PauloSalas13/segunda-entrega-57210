import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Inscription } from '../../features/dashboard/inscriptions/models';

@Injectable({
  providedIn: 'root',
})
export class InscriptionsService {
  private inscriptions: Inscription[] = [];
  private readonly JSON_URL = 'assets/inscriptions.json';
  private subscription: Subscription | null = null;

  constructor(private http: HttpClient) {
    this.loadInscriptionsFromJSON();
  }

  private loadInscriptionsFromJSON(): void {
    this.subscription = this.http.get<Inscription[]>(this.JSON_URL).subscribe(
      (data) => {
        this.inscriptions = data.map((inscription) => ({
          ...inscription,
          date: new Date(inscription.date),
        }));
      },
      (error) => {
        console.error('Error al leer inscripciones:', error);
      }
    );
  }

  private saveInscriptionsToJSON(): Observable<void> {
    return this.http.put<void>(this.JSON_URL, this.inscriptions).pipe(
      catchError((error) => {
        console.error('Error al guardar inscripciones:', error);
        throw error;
      })
    );
  }

  getInscriptions(): Observable<Inscription[]> {
    return new Observable((observer) => {
      observer.next([...this.inscriptions]);
      observer.complete();
    });
  }

  addInscription(studentId: string, courseId: string): Observable<Inscription[]> {
    const newInscription: Inscription = {
      studentId,
      courseId,
      date: new Date(),
    };
    this.inscriptions.push(newInscription);
    this.saveInscriptionsToJSON().subscribe();
    return this.getInscriptions();
  }

  deleteInscription(studentId: string, courseId: string): Observable<Inscription[]> {
    this.inscriptions = this.inscriptions.filter(
      (inscription) => !(inscription.studentId === studentId && inscription.courseId === courseId)
    );
    this.saveInscriptionsToJSON().subscribe();
    return this.getInscriptions();
  }

  getInscriptionsByStudent(studentId: string): Observable<Inscription[]> {
    return new Observable((observer) => {
      observer.next(this.inscriptions.filter((inscription) => inscription.studentId === studentId));
      observer.complete();
    });
  }

  getInscriptionsByCourse(courseId: string): Observable<Inscription[]> {
    return new Observable((observer) => {
      observer.next(this.inscriptions.filter((inscription) => inscription.courseId === courseId));
      observer.complete();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
