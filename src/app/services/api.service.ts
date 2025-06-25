import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/AFAIS'; // URL del backend en Spring Boot

  constructor(private http: HttpClient) {}

  getDatos(url: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/`+url);
  }

  // Método para crear una nueva actividad
  enviarDatos(url: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/`+url, formData); // Enviamos el FormData
  }

  login(url: string, usuario: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/`+url,{usuario, password}); // Enviamos el FormData
  }

  eliminarDatos(url: string) {
    return this.http.delete(`${this.apiUrl}/`+url)
  }

  actualizarDatos(url: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${url}`, data);
  }

  subirDocumento(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/documento`, formData);
  }

  descargarDocumento(id: number): Observable<Blob> {
    const url = `${this.apiUrl}/documento/${id}`;
    return this.http.get(url, { responseType: 'blob' }); // Recibe el archivo como Blob
  }

  getImage(urlGet: string): Observable<Blob> {
    const url = `${this.apiUrl}/${urlGet}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  post(endpoint: string, data: any) {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, data);
  }


}
