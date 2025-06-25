import { Component } from '@angular/core';

@Component({
  selector: 'app-access-denied',
  template: `<div><h1>Acceso Denegado</h1><p>No tienes permiso para ver esta página.</p></div>`,
  styles: [
    `h1 {
      text-align: center;
      font-size: 50px;
      color: red;
    }`,
    `p {
      text-align: center;
      color: black;
      font-size: 20px;
    }`,
    `div {
      max-width: 500px;
      margin: 200px auto;
      text-align: center;
    }`
  ]
})
export class AccessDeniedComponent { }
