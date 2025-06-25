import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mision-fines',
  imports: [CommonModule, FormsModule],
  templateUrl: './mision-fines.component.html',
  styleUrl: './mision-fines.component.css'
})
export class MisionFinesComponent {
    info: any;

    mensajeError = "";

    constructor(private apiService: ApiService, public authService: AuthService) {}

    isLoggedIn: boolean = false;

    ngOnInit(): void {
      this.authService.checkLoginStatus();
      this.authService.isLoggedIn().subscribe(status => {
        this.isLoggedIn = status;
      });
      this.cargarInfo();
      this.info.editando = false;
    }

    cargarInfo(): void {
      this.apiService.getDatos("infoAsociacion").subscribe(
        (data) => {
          this.info = data;
        },
        (error) => {
          console.error('Hubo un error al cargar la informacion de la asociacion', error);
        }
      );
    }

    editarInfo(infoA: any): void {
        infoA.editando = true; // Habilitar el modo de edición
    }

    guardarEdicion(infoA: any): void {
      if (!infoA.somosAfais?.trim() || !infoA.mision?.trim() || !infoA.fines?.trim()) {
        this.mensajeError = "Todos los campos son obligatorios. Por favor, complete toda la información.";
        return;
      }
      this.mensajeError = "";
      this.apiService.actualizarDatos(`infoAsociacion`, {
          id: 1,
          somosAfais: infoA.somosAfais,
          mision: infoA.mision,
          fines: infoA.fines
      }).subscribe(
        () => {
          infoA.editando = false; // Deshabilitar el modo de edición
          this.cargarInfo();
        },
        (error) => {
          console.error('Error al actualizar la info de la asociacion', error);
        }
      );
    }
}
