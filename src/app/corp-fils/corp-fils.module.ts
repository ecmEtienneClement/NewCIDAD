import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorpFilsRoutingModule } from './corp-fils-routing.module';
import { GardGuard } from '../Mes_Services/gard.guard';
import { AuthService } from '../Mes_Services/auth.Service';
import { BugService } from '../Mes_Services/bug.Service';
import { ReponseBugService } from '../Mes_Services/reponseBug.Service';
import { UserService } from '../Mes_Services/user.Service';
import { EmitEvent } from '../Mes_Services/emitEvent.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Notification } from '../Mes_Services/notification.service';
import { UserMoogoService } from '../Mes_Services/userMongo.Service';
import { AppPlugingService } from '../Mes_Services/appPlugin.Service';
import { AppVideoService } from '../Mes_Services/appVideo.Service';
import { ErrorService } from '../Mes_Services/error.Service';
import { GardDetailGuard } from '../Mes_Services/gard-detail.guard';
import { GardUpdateGuardBug } from '../Mes_Services/gard-update-bug.guard';
import { GardDetailsPluginGuard } from '../Mes_Services/gard-details-plugin.guard';
import { GuardUpdatePluginGuard } from '../Mes_Services/guard-update-plugin.guard';
import { InterceptorReqService } from '../Mes_Services/interceptor-req.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, CorpFilsRoutingModule],
  providers: [
    InterceptorReqService,
    AuthService,
    GardDetailGuard,
    GardDetailsPluginGuard,
    BugService,
    GuardUpdatePluginGuard,
    GardUpdateGuardBug,
    ReponseBugService,
    UserService,
    EmitEvent,
    GardGuard,
    MatSnackBar,
    Notification,
    UserMoogoService,
    AppVideoService,
    AppPlugingService,
    ErrorService,
  ],
})
export class CorpFilsModule {}
