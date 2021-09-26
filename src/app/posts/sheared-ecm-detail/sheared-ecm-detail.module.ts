import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShearedEcmDetailRoutingModule } from './sheared-ecm-detail-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
//import { CorpFilsModule } from 'src/app/corp-fils/corp-fils.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ShearedEcmDetailRoutingModule],
  exports: [
    MatExpansionModule,
    MatTabsModule,
    MatMenuModule,
    MatButtonModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    //   CorpFilsModule,
  ],
})
export class ShearedEcmDetailModule {}
