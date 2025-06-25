import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-organigrama',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organigrama.component.html',
  styleUrl: './organigrama.component.css'
})
export class OrganigramaComponent {
  cargos: any[] = [];
  nuevoCargo = { cargo: '', nombre: ''};

  constructor(private apiService: ApiService, public authService: AuthService) {}

  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.authService.checkLoginStatus();
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
    this.cargarCargos();
  }

  cargarCargos(): void {
    this.apiService.getDatos("organigrama").subscribe(
      (data) => {
        this.cargos = data;
      },
      (error) => {
        console.error('Hubo un error al cargar el organigrama', error);
      }
    );
  }

  agregarCargo(): void {
    const formData = new FormData();
    formData.append('cargo', this.nuevoCargo.cargo);
    formData.append('nombre', this.nuevoCargo.nombre);

    this.apiService.enviarDatos("organigrama",formData).subscribe(
      (response) => {
        console.log('Cargo creado exitosamente', response);
        this.cargarCargos();
        this.nuevoCargo = { cargo: '', nombre: ''};
        location.reload();
      },
      (error) => {
        console.error('Error al crear el cargo', error);
      }
    );
  }

  eliminarCargo(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este cargo?')) {
      this.apiService.eliminarDatos(`organigrama/${id}`).subscribe(
        () => {
          console.log(`Cargo eliminado`);
          this.cargos = this.cargos.filter(cargo => cargo.id !== id);
          location.reload();
        },
        (error) => {
          console.error('Error al eliminar el cargo', error);
        }
      );
    }
  }

  editarCargo(cargo: any): void {
      cargo.editando = true;
  }

  guardarEdicion(cargoOrg: any): void {
    console.log("cargo: id = " +cargoOrg.id+"; titulo = " + cargoOrg.titulo);
    this.apiService.actualizarDatos(`organigrama/${cargoOrg.id}`, {
        id: cargoOrg.id,
        cargo: cargoOrg.cargo,
        nombre: cargoOrg.nombre
    }).subscribe(
      () => {
        cargoOrg.editando = false; // Deshabilitar el modo de edición
        this.cargarCargos();
      },
      (error) => {
        console.error('Error al actualizar el organigrama', error);
      }
    );
  }
}
