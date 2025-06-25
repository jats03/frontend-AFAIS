import { ApiService } from '../../services/api.service';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-actividades',
  imports: [CommonModule,FormsModule],
  templateUrl: './actividades.component.html',
  styleUrl: './actividades.component.css'
})
export class ActividadesComponent implements OnInit {

  actividades: any[] = [];
  nuevaActividad = { titulo: '', descripcion: '', UrlImagen: null }; // Modelo para nueva actividad
  selectedFile: File | null = null; // Para almacenar el archivo seleccionado

  constructor(private apiService: ApiService, public authService: AuthService) {}

  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.cargarActividades();
    this.authService.checkLoginStatus();
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  // Método para cargar las actividades desde el backend
  cargarActividades(): void {
    this.apiService.getDatos("actividades").subscribe(
      (data) => {
        this.actividades = data;
      },
      (error) => {
        console.error('Hubo un error al cargar las actividades', error);
      }
    );
  }

  // Método para manejar el archivo seleccionado
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0]; // Captura el primer archivo
  }

  // Método para crear una nueva actividad
  agregarActividad(): void {
    if (this.selectedFile) {
      const formData = new FormData(); // Utilizamos FormData para manejar archivos
      formData.append('titulo', this.nuevaActividad.titulo);
      formData.append('descripcion', this.nuevaActividad.descripcion);
      formData.append('file', this.selectedFile, this.selectedFile.name); // Añadir el archivo al FormData

      this.apiService.enviarDatos("actividades",formData).subscribe(
        (response) => {
          console.log('Actividad creada exitosamente', response);
          this.cargarActividades(); // Recargar la lista de actividades
          this.nuevaActividad = { titulo: '', descripcion: '', UrlImagen: null }; // Limpiar el formulario
          this.selectedFile = null; // Limpiar el archivo seleccionado
          location.reload();
        },
        (error) => {
          console.error('Error al crear la actividad', error);
        }
      );
    }
  }

    eliminarActividad(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      this.apiService.eliminarDatos(`actividades/${id}`).subscribe(
        () => {
          console.log(`Actividad: {{actividad.titulo}} eliminado`);
          this.actividades = this.actividades.filter(actividad => actividad.id !== id);
          location.reload();
        },
        (error) => {
          console.error('Error al eliminar la actividad', error);
        }
      );
    }
  }


  editarActividad(actividad: any): void {
    actividad.editando = true; // Habilitar el modo de edición
  }

  guardarEdicion(actividad: any): void {
    console.log("actividad: id = " +actividad.id+"; titulo = " + actividad.titulo);
    this.apiService.actualizarDatos(`actividades/${actividad.id}`, {
        id: actividad.id,
  titulo: actividad.titulo,
  descripcion: actividad.descripcion
    }).subscribe(
      () => {
        actividad.editando = false; // Deshabilitar el modo de edición
        this.cargarActividades();
      },
      (error) => {
        console.error('Error al actualizar la actividad', error);
      }
    );
  }

  getImage(id: number): string {
    return `http://localhost:8080/AFAIS/actividades/${id}/imagen`;
  }

}
