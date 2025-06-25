import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  imports: [FormsModule,CommonModule]
})
export class RegistroComponent implements OnInit{
  usuario: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  users: any[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  constructor(private apiService: ApiService, private router: Router) {}

  register() {
    location.reload();
    const payload = {
      usuario: this.usuario,
      password: this.password,
    };

    this.apiService.post('auth/register', payload).subscribe({
      next: () => {
        this.successMessage = 'Usuario registrado correctamente.';
        this.errorMessage = '';
        // Redirigir si quieres automáticamente:
        // this.router.navigate(['/login']);
      }
    });
  }

  loadUsers() {
    this.apiService.getDatos(`usuarios`).subscribe(
      (users: any[]) => {
        this.users = users;
      },
      error => {
        this.errorMessage = 'Error al cargar los usuarios';
      }
    );
  }

  deleteUser(user: any) {
    if ( user.rol == "ADMIN" ) {
      this.errorMessage = "Error al eliminar usuario.\n"+
                          "Causa: no se puede eliminar un ADMIN.";
    } else {
      this.apiService.eliminarDatos(`usuarios/${user.usuario}`).subscribe(
        response => {
          this.successMessage = 'Usuario eliminado con éxito';
          this.loadUsers(); // Recargar la lista después de eliminar
        },
        error => {
          this.errorMessage = 'Error al eliminar el usuario';
        }
      );
    }
  }

  updateRole(user: any) {
    if ( user.rol == "EDITOR" ) {
      this.errorMessage = "Error al cambiar de Rol.\n"+
                          "Causas:\n"+
                          "  1. No se puede pasar de ADMIN a EDITOR.\n"+
                          "  2. Ya eres EDITOR.";
    } else {
      this.errorMessage = "";
      this.apiService.actualizarDatos(`usuarios/${user.usuario}`, user.rol).subscribe(
        response => {
          this.successMessage = 'Rol actualizado con éxito';
          this.loadUsers(); // Recargar la lista después de la actualización
        },
        error => {
          this.errorMessage = 'Error al actualizar el rol';
        }
      );
    }

  }
}
