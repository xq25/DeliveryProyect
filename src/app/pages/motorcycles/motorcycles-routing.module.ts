import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { TrackComponent } from './track/track.component'; // 👈 Importar

const routes: Routes = [
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'view/:id',
    component: ManageComponent
  },
  {
    path: 'update/:id',
    component: ManageComponent
  },
  {
    path: 'create',
    component: ManageComponent
  },
  {
    path: 'track/:plate', // 👈 Nueva ruta
    component: TrackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MotorcyclesRoutingModule { }