import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscriptionRoutingModule } from './inscription-routing.module';
import { IncriptionComponent } from './incription/incription.component';

import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ShearedModuleGeneralModule } from '../sheared-module-general/sheared-module-general.module';
//import { IncriptioMongoComponent } from './incriptio-mongo/incriptio-mongo.component';
@NgModule({
  declarations: [IncriptionComponent],
  imports: [
    CommonModule,
    InscriptionRoutingModule,
    ShearedModuleGeneralModule,

    MatStepperModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class InscriptionModule {}
