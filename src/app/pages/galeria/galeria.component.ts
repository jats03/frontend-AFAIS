import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-galeria',
  imports: [CommonModule, FormsModule],
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit, AfterViewInit {
  @ViewChild('slidesContainer', { static: false }) slidesContainer!: ElementRef;
  currentSlide = 0;
  totalSlides = 0;
  slideWidth = 274;
  imagenes: any[] = [];
  todasImagenes: any[] = [];
  nuevaImagen = { UrlImagen: null };
  selectedFile: File | null = null;
  imagenesPorVista = 0;
  numImgs = 0;
  ocultarPrev = false;
  ocultarNext = false;

  @HostListener('window:resize')
  updateImagesPerView() {
    if (window.matchMedia('(max-width: 576px)').matches) {
      this.imagenesPorVista = 0; // Pantallas pequeñas
    } else if (window.matchMedia('(max-width: 992px)').matches) {
      this.imagenesPorVista = 1; // Pantallas medianas
    } else {
      this.imagenesPorVista = 2; // Pantallas grandes
    }
  }

  constructor(private apiService: ApiService, public authService: AuthService) {}

  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.authService.checkLoginStatus();
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
    this.cargarImagenes();
    this.updateImagesPerView();
  }

  ngAfterViewInit(): void {
    if ( this.slidesContainer ) {
      this.showSlide(this.currentSlide);
    }
  }

  showSlide(current: number): void {
    console.log("[DEBUG] - num imagenes = " + this.numImgs);
    console.log("[DEBUG] - actual = " + (this.currentSlide) + " y quiero " + current);
    console.log("[DEBUG] - imagenes por vista = " + this.imagenesPorVista + " / img totales = " + this.todasImagenes.length);
    if (current <= 0) {
      this.ocultarPrev = true;
      if ( this.todasImagenes.length < this.imagenesPorVista ) this.ocultarNext = true;
      else this.ocultarNext = false;
      this.currentSlide = 0;
      console.log("[DEBUG] - current <= 0? -> " + current);
      for ( let i = 0 ; i <= this.imagenesPorVista && i < this.todasImagenes.length; ++i ) {
        this.imagenes[i] = this.todasImagenes[i]
      }
    } else {
      if ( current >= this.todasImagenes.length-this.imagenesPorVista) {
          this.ocultarPrev = false;
          this.ocultarNext = true;
          console.log("[DEBUG] - current (" + current + ") >= this.totalSlides-("+ this.imagenesPorVista + ")" + (this.todasImagenes.length-this.imagenesPorVista) + ")");
          for ( let i = 0 ; i <= this.imagenesPorVista ; ++i ) {
            this.imagenes[i] = this.todasImagenes[this.todasImagenes.length+i-this.imagenesPorVista-1];
          }
      } else {
        if ( current > this.currentSlide) {
          this.ocultarPrev = false;
          if ( current+1 >= this.todasImagenes.length-this.imagenesPorVista) this.ocultarNext = true;
          else this.ocultarNext = false;
          console.log("[DEBUG] - current (" + current + ") > this.currentSlide(" + this.currentSlide + ")");
          this.currentSlide = current;
          for ( let i = 0 ; i <= this.imagenesPorVista ; ++i ) {
            this.imagenes[i] = this.todasImagenes[current+i];
          }
        } else {
          this.ocultarPrev = false;
          this.ocultarNext = false;
          console.log("[DEBUG] - current (" + current + ") <= this.currentSlide(" + this.currentSlide + ")");
          this.currentSlide = current;
          this.imagenes[2] = this.todasImagenes[current+2];
          this.imagenes[1] = this.todasImagenes[current+1];
          this.imagenes[0] = this.todasImagenes[current]
        }
      }

    }
  }

  nextSlide(): void {
    console.log("NEXT")
    this.showSlide(this.currentSlide + 1);
  }

  prevSlide(): void {
    console.log("PREV")
    this.showSlide(this.currentSlide - 1);
  }

  cargarImagenes(): void {
    this.apiService.getDatos("imagenesGaleria").subscribe(
      (data) => {
        this.todasImagenes = data;
        this.totalSlides = this.todasImagenes.length;
        this.imagenes[0] = this.todasImagenes[0];
        this.imagenes[1] = this.todasImagenes[1];
        this.imagenes[2] = this.todasImagenes[2];
        this.currentSlide = 0;
        this.ocultarPrev = true;
        this.numImgs = this.todasImagenes.length;
        console.log("[DEBUG-cargar] - num imgs = " + this.numImgs);
        if ( this.numImgs == 3 ) this.ocultarNext = true;
      },
      (error) => {
        console.error('Hubo un error al cargar las imágenes', error);
      }
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  agregarImagen(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.apiService.enviarDatos("imagenesGaleria", formData).subscribe(
        (response) => {
          console.log('Imagen añadida exitosamente',response);
          this.cargarImagenes();
          this.nuevaImagen = { UrlImagen: null };
          this.selectedFile = null;
          location.reload();
          this.showSlide(this.currentSlide);
          confirm('Imagen añadida');
          this.numImgs += 1;
        },
        (error) => {
          console.error('Error al añadir la imagen', error);
        }
      );
    }
  }

  eliminarImagen(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      this.apiService.eliminarDatos(`imagenesGaleria/${id}`).subscribe(
        () => {
          console.log("[DEBUG-eliminar] - num imagenes = " + this.numImgs);
          console.log('Imagen eliminada');
          this.cargarImagenes();
          window.location.reload();
        },
        (error) => {
          console.error('Error al eliminar la imagen', error);
        }
      );
    }
  }

  getImage(id: number): string {
    return `http://localhost:8080/AFAIS/imagenesGaleria/${id}`;
  }

}
