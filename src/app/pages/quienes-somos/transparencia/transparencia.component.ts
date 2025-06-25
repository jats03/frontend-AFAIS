import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transparencia',
  imports: [CommonModule, FormsModule],
  templateUrl: './transparencia.component.html',
  styleUrl: './transparencia.component.css'
})
export class TransparenciaComponent implements OnInit{
    info: any;

    mensajeError = "";

    documentos: any[] = [];

    archivoSeleccionado!: File;
    mensaje: string = '';

    constructor(private apiService: ApiService, public authService: AuthService) {}

    isLoggedIn: boolean = false;

    ngOnInit(): void {
      this.authService.checkLoginStatus();
      this.authService.isLoggedIn().subscribe(status => {
        this.isLoggedIn = status;
      });
      this.cargarDocumentos();
    }

    cargarDocumentos(): void {
      this.apiService.getDatos(`documentos`).subscribe(
        (data) => {
          this.documentos = data;
        },
        (error) => {
          console.error('Error al cargar documentos', error);
        }
      );
    }

    subirArchivo() {
      if (!this.archivoSeleccionado) {
        this.mensaje = "Por favor, seleccione un archivo.";
        return;
      }

      this.apiService.subirDocumento(this.archivoSeleccionado).subscribe(
        (response) => {
          location.reload();
        },
        (error) => {
          this.mensaje = "Error al subir el documento.";
          console.error(error);
        }
      );
    }


    seleccionarArchivo(event: any) {
      this.archivoSeleccionado = event.target.files[0];
    }

    eliminarDocumento(id: number) {
      this.apiService.eliminarDatos(`documentos/${id}`).subscribe(
          () => {
            console.log(`Documento con ID ${id} eliminado`);
            this.documentos = this.documentos.filter(doc => doc.id !== id);
            location.reload();
          },
          (error) => {
            console.error('Error al eliminar el proyecto', error);
          }
        );
    }

    descargarDocumento(id: number, nombre: string) {
      this.apiService.descargarDocumento(id).subscribe(blob => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = `${nombre}`;
        a.click();
        URL.revokeObjectURL(objectUrl);
      }, error => {
        console.error('Error al descargar el archivo:', error);
      });
    }
}
