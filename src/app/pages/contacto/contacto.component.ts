import { RecaptchaModule } from 'ng-recaptcha-2';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  imports: [RecaptchaModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  recaptchaResponse: string = '';
  mensajeExito: boolean = false;
  mensajeEnviado: boolean = false;

  onCaptchaResolved(response: string | null) {
    this.recaptchaResponse = response ?? '';
    console.log("Captcha resuelto con token:", this.recaptchaResponse);
  }

  enviarFormulario(form: NgForm) {
    if (form.invalid) return; // Evita enviar si el formulario es inválido

    this.mensajeEnviado = true;

    // Crear FormData
    const formData = new FormData();
    formData.append('nombre', form.value.nombre);
    formData.append('email', form.value.email);
    formData.append('consulta', form.value.consulta);
    formData.append('mensaje', form.value.mensaje);
    formData.append('honeypot', form.value.honeypot);
    formData.append('recaptchaResponse', this.recaptchaResponse); // Incluir la respuesta de reCAPTCHA

    // Enviar la petición usando fetch
    fetch('http://localhost:8080/AFAIS/contacto', {
      method: 'POST',
      body: formData // `FormData` se maneja automáticamente por el navegador
    })
    .then(response => response.text()) // O `.json()` si el backend devuelve JSON
    .then(data => {
      this.mensajeExito = true; // Muestra el mensaje de éxito
      form.resetForm(); // Resetea el formulario
    })
    .catch(error => console.error("Error al enviar el formulario:", error));
  }


}
