import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncriptioMongoComponent } from './incriptio-mongo/incriptio-mongo.component';
import { IncriptionComponent } from './incription/incription.component';

const routes: Routes = [
  { path: '', component: IncriptionComponent },
  { path: 'inscriptionMongo', component: IncriptioMongoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InscriptionRoutingModule {}
