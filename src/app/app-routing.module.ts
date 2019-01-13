import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


/* Archivo de rutas principal de la aplicación */

const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full'  },
    { path: 'basics', loadChildren: 'app/basics/basics.module#BasicsModule' },
    { path: 'abouts', component: PageNotFoundComponent },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
