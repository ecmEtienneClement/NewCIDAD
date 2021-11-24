import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnregistreVideoRoutingModule } from './enregistre-video-routing.module';
import { ShearmoduleEnregistreVieoPluginModule } from '../shearmodule-enregistre-vieo-plugin/shearmodule-enregistre-vieo-plugin.module';
import { EnrgistreVideoCmpComponent } from './enrgistre-video-cmp/enrgistre-video-cmp.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
@NgModule({
  declarations: [EnrgistreVideoCmpComponent],
  imports: [
    CommonModule,
    EnregistreVideoRoutingModule,
    ShearmoduleEnregistreVieoPluginModule,
    MatSelectModule,
    MatTabsModule,
  
  ],
})
export class EnregistreVideoModule {}
