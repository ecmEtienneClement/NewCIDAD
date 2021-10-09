import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EcmRoutingModule } from './ecm-routing.module';
import { CmpecmComponent } from './cmpecm/cmpecm.component';
import { ViewecmComponent } from './viewecm/viewecm.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ShearedEcmDetailModule } from '../sheared-ecm-detail/sheared-ecm-detail.module';
import { MatCardModule } from '@angular/material/card';
import { NotificationEcmComponent } from './notification-ecm/notification-ecm.component';
import { MatDividerModule } from '@angular/material/divider';
//..........

@NgModule({
  declarations: [CmpecmComponent, ViewecmComponent, NotificationEcmComponent],
  imports: [
    CommonModule,
    EcmRoutingModule,
    MatProgressBarModule,
    ShearedEcmDetailModule,
    MatCardModule,
    MatDividerModule,
  ],
})
export class EcmModule {}
