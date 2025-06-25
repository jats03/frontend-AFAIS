import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-proyectos',
  imports: [CommonModule,FormsModule],
  templateUrl: './proyectos.component.html',
  styleUrl: './proyectos.component.css'
})
export class ProyectosComponent implements OnInit {

  proyectos: any[] = [];
  nuevoProyecto = { titulo: '', descripcion: '', UrlImagen: null };
  selectedFile: File | null = null;
  constructor(private apiService: ApiService, public authService: AuthService) {}

    isLoggedIn: boolean = false;

    ngOnInit(): void {
      this.authService.checkLoginStatus();
      this.authService.isLoggedIn().subscribe(status => {
        this.isLoggedIn = status;
      });
      this.cargarProyectos();
    }

  cargarProyectos(): void {
    this.apiService.getDatos("proyectos").subscribe(
      (data) => {
        this.proyectos = data;
      },
      (error) => {
        console.error('Hubo un error al cargar los proyectos', error);
      }
    );
  }

  // Método para manejar el archivo seleccionado
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0]; // Captura el primer archivo
  }

  // Método para crear una nueva actividad
  agregarProyecto(): void {
    if (this.selectedFile) {
      const formData = new FormData(); // Utilizamos FormData para manejar archivos
      formData.append('titulo', this.nuevoProyecto.titulo);
      formData.append('descripcion', this.nuevoProyecto.descripcion);
      formData.append('file', this.selectedFile, this.selectedFile.name); // Añadir el archivo al FormData

      this.apiService.enviarDatos("proyectos",formData).subscribe(
        (response) => {
          console.log('Proyecto creado exitosamente', response);
          this.cargarProyectos(); // Recargar la lista de proyectos
          this.nuevoProyecto = { titulo: '', descripcion: '', UrlImagen: null }; // Limpiar el formulario
          this.selectedFile = null; // Limpiar el archivo seleccionado
          location.reload();
        },
        (error) => {
          console.error('Error al crear el proyecto', error);
        }
      );
    }
  }

  eliminarProyecto(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      this.apiService.eliminarDatos(`proyectos/${id}`).subscribe(
        () => {
          console.log(`Proyecto con ID ${id} eliminado`);
          this.proyectos = this.proyectos.filter(proyecto => proyecto.id !== id);
          location.reload();
        },
        (error) => {
          console.error('Error al eliminar el proyecto', error);
        }
      );
    }
  }

  editarProyecto(proyecto: any): void {
    proyecto.editando = true; // Habilitar el modo de edición
  }

  guardarEdicion(proyecto: any): void {
    this.apiService.actualizarDatos(`proyectos/${proyecto.id}`, {
        id: proyecto.id,
        titulo: proyecto.titulo,
        descripcion: proyecto.descripcion
    }).subscribe(
      () => {
        proyecto.editando = false; // Deshabilitar el modo de edición
        this.cargarProyectos();
      },
      (error) => {
        console.error('Error al actualizar el proyecto', error);
      }
    );
  }


  getImage(id: number): string {
    return `http://localhost:8080/AFAIS/proyectos/${id}/imagen`;
  }

}
