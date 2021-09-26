import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsRoutingModule } from './details-routing.module';
import { CpmdetailsComponent } from './cpmdetails/cpmdetails.component';
import { ViewdetailsComponent } from './viewdetails/viewdetails.component';
import { ShearedEcmDetailModule } from '../sheared-ecm-detail/sheared-ecm-detail.module';

@NgModule({
  declarations: [CpmdetailsComponent, ViewdetailsComponent],
  imports: [CommonModule, DetailsRoutingModule, ShearedEcmDetailModule],
})
export class DetailsModule {}
