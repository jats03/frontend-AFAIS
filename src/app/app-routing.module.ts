import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InicioComponent } from './pages/inicio/inicio.component';
import { ActividadesComponent } from './pages/actividades/actividades.component';
import { ProyectosComponent } from './pages/proyectos/proyectos.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { GaleriaComponent } from './pages/galeria/galeria.component';
import { OrganigramaComponent } from './pages/quienes-somos/organigrama/organigrama.component';
import { ObjetivosComponent } from './pages/quienes-somos/objetivos/objetivos.component';
import { BrowserModule } from '@angular/platform-browser';
import { MisionFinesComponent } from './pages/quienes-somos/mision-fines/mision-fines.component';
import { LoginComponent } from './pages/login/login.component';
import { TransparenciaComponent } from './pages/quienes-somos/transparencia/transparencia.component';
import { AuthGuard } from './services/auth.guard';
import { AccessDeniedComponent } from './components/AccessDenied.component';
import { RegistroComponent } from './pages/registro/registro.component';

export const routes: Routes = [
  { path: 'inicio', component: InicioComponent},
  { path: 'actividades', component: ActividadesComponent },
  { path: 'proyectos', component: ProyectosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: 'organigrama', component: OrganigramaComponent },
  { path: 'objetivos', component: ObjetivosComponent },
  { path: 'mision-fines', component: MisionFinesComponent},
  { path: 'transparencia', component: TransparenciaComponent},
  { path: 'login', component: LoginComponent},

  //{ path: 'admin/login', component: LoginComponent},

  {
    path: 'registro',
    component: RegistroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }  // Sólo los usuarios con rol ROLE_ADMIN pueden acceder
  },

  { path: 'access-denied', component: AccessDeniedComponent },

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio'} // Redirección en caso de ruta no encontrada

];


@NgModule({
  imports: [RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
