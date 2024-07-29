import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  login() {
    localStorage.setItem('token', 'lksfdjglfdkgjklfdkjgldfjisdhfjsdfsdk');
    this.router.navigate(['dashboard', 'courses', 'inscriptions','students']);
  }

  verificarToken() {}

  obtenerUsuarioAutenticado() {}

  obtenerUsuarioObservable(): Observable<any> {
    return new Observable((observer) => {
      setInterval(() => {
        observer.next({
          name: 'Name Joel Salas',
          email: 'paulo.maestro@gmail.com',
        });
      }, 2000);
    });
  }

  obtenerUsuarioPromise(): Promise<any> {
    return new Promise((resolve, reject) => {
      reject('Error desconocido');

      setTimeout(() => {
        resolve({
          name: 'Name Joel Salas',
          email: 'paulo.maestro@gmail.com',
        });
      }, 2000);
    });
  }
}
