import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private authService: AuthService, private router: Router) {
  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Obtener el token
    const token = this.authService.getToken();

    // Si no hay token, redirigir al login
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Decodificar el JWT para obtener los roles
    const decodedToken = JSON.parse(atob(token.split('.')[1]));

    const expiration = decodedToken.exp;
    const now = Math.floor(Date.now() / 1000);

    if (expiration < now) {
      this.authService.logout();
      return false;
    }


    const roles = decodedToken.roles || decodedToken.authorities;

    // Verificar si el usuario tiene el rol requerido
    const requiredRoles = next.data['roles'] as Array<string>;

    if (requiredRoles && !requiredRoles.some(role => roles.includes(role))) {
      // Si no tiene el rol requerido, redirigir
      this.router.navigate(['/access-denied']);
      return false;
    }

    return true;  // El usuario tiene el rol necesario, puede acceder
  }
}
