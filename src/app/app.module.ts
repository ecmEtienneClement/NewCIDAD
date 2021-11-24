import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcceuilleComponent } from './MesComponents/acceuille/acceuille.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { AvantInscriptionComponent } from './MesComponents/avant-inscription/avant-inscription.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GardGuard } from './Mes_Services/gard.guard';
import { ShearedModuleGeneralModule } from './sheared-module-general/sheared-module-general.module';
import { CorpFilsModule } from './corp-fils/corp-fils.module';
import { PostsModule } from './posts/posts.module';
import { ProfilUserComponent } from './MesComponents/profil-user/profil-user.component';
import { EditUserComponent } from './MesComponents/edit-user/edit-user.component';
import { ParametreComponent } from './MesComponents/parametre/parametre.component';
import { MatSelectModule } from '@angular/material/select';
import { AlertDialogueCodeComponent } from './MesComponents/alert-dialogue-code/alert-dialogue-code.component';
import { ModelReauthVueDialogComponent } from './MesComponents/model-reauth-vue-dialog/model-reauth-vue-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { HttpClientModule } from '@angular/common/http';
import { AppParentModule } from './app-parent/app-parent.module';
import { NotFoundComponent } from './MesComponents/not-found/not-found.component';
import { GardDetailGuard } from './Mes_Services/gard-detail.guard';
import { GardUpdateGuardBug } from './Mes_Services/gard-update-bug.guard';
import { GardDetailsPluginGuard } from './Mes_Services/gard-details-plugin.guard';
import { GuardUpdatePluginGuard } from './Mes_Services/guard-update-plugin.guard';
import { LocalModule } from './local/local.module';

const routes: Routes = [
  { path: '', component: AcceuilleComponent },
  {
    path: 'inscription',
    loadChildren: () =>
      import('./inscription/inscription.module').then(
        (mod) => mod.InscriptionModule
      ),
  },

  {
    path: 'connexion',
    loadChildren: () =>
      import('./connexion/connexion.module').then((mod) => mod.ConnexionModule),
  },
  {
    path: 'ecm',
    canActivate: [GardGuard],
    loadChildren: () =>
      import('./posts/posts.module').then((mod) => mod.PostsModule),
  },
  {
    path: 'ecm/details/:indice',
    canActivate: [GardGuard, GardDetailGuard],
    loadChildren: () =>
      import('./posts/posts.module').then((mod) => mod.PostsModule),
  },
  {
    path: 'ecm/:idUser/modifier/:indice/:idBug',
    canActivate: [GardGuard, GardUpdateGuardBug],
    loadChildren: () =>
      import('./posts/posts.module').then((mod) => mod.PostsModule),
  },

  {
    path: 'enregistre',
    canActivate: [GardGuard],
    loadChildren: () =>
      import('./posts/posts.module').then((mod) => mod.PostsModule),
  },

  {
    path: 'profilUser',
    canActivate: [GardGuard],
    component: ProfilUserComponent,
  },
  {
    path: 'editUser',
    canActivate: [GardGuard],
    component: EditUserComponent,
  },
  {
    path: 'parametre',
    canActivate: [GardGuard],
    component: ParametreComponent,
  },
  {
    path: 'appVideo',
    canActivate: [GardGuard],
    loadChildren: () =>
      import('./app-parent/app-parent.module').then(
        (mod) => mod.AppParentModule
      ),
  },
  {
    path: 'appPlugin',
    canActivate: [GardGuard],
    loadChildren: () =>
      import('./app-parent/app-parent.module').then(
        (mod) => mod.AppParentModule
      ),
  },
  {
    path: 'EnregistreVideo',
    canActivate: [GardGuard],
    loadChildren: () =>
      import('./app-parent/app-parent.module').then(
        (mod) => mod.AppParentModule
      ),
  },
  {
    path: 'EnregistrePlugin',
    canActivate: [GardGuard],
    loadChildren: () =>
      import('./app-parent/app-parent.module').then(
        (mod) => mod.AppParentModule
      ),
  },
  {
    path: 'details/Pluging/:idPlugin',
    canActivate: [GardGuard, GardDetailsPluginGuard],
    loadChildren: () =>
      import('./app-parent/app-parent.module').then(
        (mod) => mod.AppParentModule
      ),
  },
  {
    path: 'update/:idUser/Pluging/:idPlugin',
    canActivate: [GardGuard, GuardUpdatePluginGuard],
    loadChildren: () =>
      import('./app-parent/app-parent.module').then(
        (mod) => mod.AppParentModule
      ),
  },
  {
    path: 'local/init/EcmBd',
    canActivate: [GardGuard],
    loadChildren: () =>
      import('./local/local-routing.module').then(
        (mod) => mod.LocalRoutingModule
      ),
  },
  {
    path: 'local/init/EcmBd/BdPourc',
    canActivate: [GardGuard],
    loadChildren: () =>
      import('./local/local-routing.module').then(
        (mod) => mod.LocalRoutingModule
      ),
  },
  { path: 'not-found', component: NotFoundComponent },
  {
    path: '**',
    redirectTo: '/not-found',
  },
];
@NgModule({
  declarations: [
    //  {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue:{appearance: 'fill'}},
    AppComponent,
    AcceuilleComponent,
    //  ParametreComponent,
    AvantInscriptionComponent,
    ProfilUserComponent,
    EditUserComponent,
    ParametreComponent,
    AlertDialogueCodeComponent,
    ModelReauthVueDialogComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    DragDropModule,
    MatSelectModule,
    MatGridListModule,
    MatButtonModule,
    MatDialogModule,
    MatSidenavModule,
    NgxUsefulSwiperModule,
    ShearedModuleGeneralModule,
    PostsModule,
    CorpFilsModule,
    FontAwesomeModule,
    AppParentModule,
    LocalModule,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
