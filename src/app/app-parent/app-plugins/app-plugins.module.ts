import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppPluginsRoutingModule } from './app-plugins-routing.module';
import { AppPluginCmpComponent } from './app-plugin-cmp/app-plugin-cmp.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
//import { NgParticlesModule } from 'ng-particles';
import { NotifyAppPluginComponent } from './notify-app-plugin/notify-app-plugin.component';
import { ShearedEcmDetailModule } from 'src/app/posts/sheared-ecm-detail/sheared-ecm-detail.module';
import { UpdateAppPluginComponent } from './update-plugin/update-app-plugin/update-app-plugin.component';
import { DetailsPluginsComponent } from './details-plugin/details-plugins/details-plugins.component';
import { ShearmoduleEnregistreVieoPluginModule } from '../shearmodule-enregistre-vieo-plugin/shearmodule-enregistre-vieo-plugin.module';
@NgModule({
  declarations: [
    AppPluginCmpComponent,
    NotifyAppPluginComponent,
    UpdateAppPluginComponent,
    DetailsPluginsComponent,
  ],
  imports: [
    CommonModule,
    AppPluginsRoutingModule,
    MatProgressBarModule,
    MatDividerModule,
    MatCardModule,
  //  NgParticlesModule,
    ShearedEcmDetailModule,
    ShearmoduleEnregistreVieoPluginModule,
  ],
})
export class AppPluginsModule {}
