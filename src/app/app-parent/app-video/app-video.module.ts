import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppVideoRoutingModule } from './app-video-routing.module';
import { AppVideoCmpComponent } from './app-video-cmp/app-video-cmp.component';

@NgModule({
  declarations: [AppVideoCmpComponent],
  imports: [CommonModule, AppVideoRoutingModule],
})
export class AppVideoModule {}
