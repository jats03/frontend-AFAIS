import { ApiService } from './../../services/api.service';
import { Component, AfterViewInit, Renderer2, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements AfterViewInit, OnInit {

  datos: any = [];

  isLoggedIn: boolean = false;

  constructor(private renderer: Renderer2, private el: ElementRef, public authService: AuthService, public apiService: ApiService) {}

  ngOnInit() {
    this.authService.checkLoginStatus();
    this.authService.isLoggedIn().subscribe(status => {
        this.isLoggedIn = status;
    });
  }

  ngAfterViewInit() {
    // Cargar el script de Instagram si no está en la página
    if (!document.querySelector('script[src="https://www.instagram.com/embed.js"]')) {
      const script = this.renderer.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      this.renderer.appendChild(document.body, script);

      script.onload = () => {
        this.processInstagramEmbeds();
      };
    } else {
      // Si ya está cargado, solo procesamos los embeds
      this.processInstagramEmbeds();
    }
  }

  private processInstagramEmbeds() {
    if ((window as any).instgrm && (window as any).instgrm.Embeds) {
      (window as any).instgrm.Embeds.process();
    }
  }

}
