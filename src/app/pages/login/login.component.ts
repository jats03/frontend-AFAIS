import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule,CommonModule]
})
export class LoginComponent {
  usuario: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.apiService.login("auth/login", this.usuario, this.password).subscribe({
      next: (response) => {
        const token = response.token;
        this.authService.saveToken(token);

        // Opcional: redireccionar según rol
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const roles = decodedToken.roles || decodedToken.authorities;

        if (roles.includes("ROLE_ADMIN")) {
          this.authService.saveTokenAdmin();
          this.authService.isAdmin.next(true);
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/editor']);
        }
      },
      error: (err) => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    });
  }
}


