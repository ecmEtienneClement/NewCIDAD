import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalRoutingModule } from './local-routing.module';
import { InitialisationComponent } from './initialisation/initialisation.component';
import { SelectBDetPourcComponent } from './select-bdet-pourc/select-bdet-pourc.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    InitialisationComponent,
    SelectBDetPourcComponent,
   
  ],
  imports: [

    CommonModule,
    
    LocalRoutingModule,
    FormsModule,
    MatSelectModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 300,
    }),
  ],
})
export class LocalModule {}
