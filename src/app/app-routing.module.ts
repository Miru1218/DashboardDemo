import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartComponent } from './features/chart/pages/chart.component';

const routes: Routes = [
  {
    path: 'chart',
    component: ChartComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
