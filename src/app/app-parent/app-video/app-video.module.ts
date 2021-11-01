import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppVideoRoutingModule } from './app-video-routing.module';
import { AppVideoCmpComponent } from './app-video-cmp/app-video-cmp.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
@NgModule({
  declarations: [AppVideoCmpComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    AppVideoRoutingModule,
    NgxPaginationModule,
    MatProgressBarModule,
  ],
})
export class AppVideoModule {}
