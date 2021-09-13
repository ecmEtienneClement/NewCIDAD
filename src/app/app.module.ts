import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcceuilleComponent } from './MesComponents/acceuille/acceuille.component';
import { InscriptionComponent } from './MesComponents/inscription/inscription.component';
import { ConnexionComponent } from './MesComponents/connexion/connexion.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './Mes_Services/auth.Service';
import { EcmComponent } from './MesComponents/ecm/ecm.component';
import { ParametreComponent } from './MesComponents/parametre/parametre.component';
import { EnregistreComponent } from './MesComponents/enregistre/enregistre.component';
import { BugService } from './Mes_Services/bug.Service';
import { DetailsComponent } from './MesComponents/details/details.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ModelVueDialogComponent } from './MesComponents/model-vue-dialog/model-vue-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { AvantInscriptionComponent } from './MesComponents/avant-inscription/avant-inscription.component';
import { ViewReponseBugComponent } from './Views_Components/view-reponse-bug/view-reponse-bug.component';
import { ViewBugComponent } from './Views_Components/view-bug/view-bug.component';
import { ReponseBugService } from './Mes_Services/reponseBug.Service';
import { EmitEvent } from './Mes_Services/emitEvent.service';
import { ModifierBugComponent } from './MesComponents/modifier-bug/modifier-bug.component';
import { AlertComponent } from './MesComponents/alert/alert.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GardGuard } from './Mes_Services/gard.guard';
import { UserService } from './Mes_Services/user.Service';
const routes: Routes = [
  { path: '', canActivate: [GardGuard], component: AcceuilleComponent },
  {
    path: 'inscription',
    component: InscriptionComponent,
  },
  {
    path: 'ecminscription',
    component: InscriptionComponent,
  },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'ecm', canActivate: [GardGuard], component: EcmComponent },
  {
    path: 'ecm/details/:indice',
    canActivate: [GardGuard],
    component: DetailsComponent,
  },
  {
    path: 'ecm/modifier/:indice',
    canActivate: [GardGuard],
    component: ModifierBugComponent,
  },
  {
    path: 'enregistre',
    canActivate: [GardGuard],
    component: EnregistreComponent,
  },
  {
    path: 'parametre',
    canActivate: [GardGuard],
    component: ParametreComponent,
  },
];
@NgModule({
  declarations: [
    //  {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue:{appearance: 'fill'}},
    AppComponent,
    AcceuilleComponent,
    InscriptionComponent,
    ConnexionComponent,
    EcmComponent,
    ParametreComponent,
    EnregistreComponent,
    DetailsComponent,

    ModelVueDialogComponent,
    AvantInscriptionComponent,
    ViewReponseBugComponent,
    ViewBugComponent,
    ModifierBugComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    MatSelectModule,
    MatButtonModule,
    MatStepperModule,
    MatGridListModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatDialogModule,
    MatBadgeModule,
    MatSidenavModule,
  ],
  providers: [
    AuthService,
    BugService,
    ReponseBugService,
    UserService,
    EmitEvent,
    MatSnackBar,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
