import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-objetivos',
  imports: [CommonModule, FormsModule],
  templateUrl: './objetivos.component.html',
  styleUrl: './objetivos.component.css'
})
export class ObjetivosComponent {
  objetivos: any[] = [];
  nuevoObjetivo = { titulo: '', descripcion: ''};

  constructor(private apiService: ApiService, public authService: AuthService) {}

  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.authService.checkLoginStatus();
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
    this.cargarObjetivos();
  }

  cargarObjetivos(): void {
    this.apiService.getDatos("objetivos").subscribe(
      (data) => {
        this.objetivos = data;
      },
      (error) => {
        console.error('Hubo un error al cargar los objetivos', error);
      }
    );
  }

  agregarObjetivo(): void {
    const formData = new FormData();
    formData.append('titulo', this.nuevoObjetivo.titulo);
    formData.append('descripcion', this.nuevoObjetivo.descripcion);

    this.apiService.enviarDatos("objetivos",formData).subscribe(
      (response) => {
        console.log('Objetivo creado exitosamente', response);
        this.cargarObjetivos();
        this.nuevoObjetivo = { titulo: '', descripcion: ''};
        location.reload();
      },
      (error) => {
        console.error('Error al crear el objetivo', error);
      }
    );
  }

  eliminarObjetivo(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este objetivo?')) {
      this.apiService.eliminarDatos(`objetivos/${id}`).subscribe(
        () => {
          console.log(`Objetivo eliminado`);
          this.objetivos = this.objetivos.filter(objetivo => objetivo.id !== id);
          location.reload();
        },
        (error) => {
          console.error('Error al eliminar el objetivo', error);
        }
      );
    }
  }

  editarObjetivo(objetivo: any): void {
      objetivo.editando = true; // Habilitar el modo de edición
  }

  guardarEdicion(objetivo: any): void {
    console.log("objetivo: id = " +objetivo.id+"; titulo = " + objetivo.titulo);
    this.apiService.actualizarDatos(`objetivos/${objetivo.id}`, {
        id: objetivo.id,
        titulo: objetivo.titulo,
        descripcion: objetivo.descripcion
    }).subscribe(
      () => {
        objetivo.editando = false; // Deshabilitar el modo de edición
        this.cargarObjetivos();
      },
      (error) => {
        console.error('Error al actualizar el objetivo', error);
      }
    );
  }
}
