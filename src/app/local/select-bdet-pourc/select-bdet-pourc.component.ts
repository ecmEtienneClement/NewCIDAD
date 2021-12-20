import {
  Component,
  AfterViewInit,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import gsap from 'gsap';

import { AppPlugingService } from 'src/app/Mes_Services/appPlugin.Service';
import { AppVideoService } from 'src/app/Mes_Services/appVideo.Service';
import { BugService } from 'src/app/Mes_Services/bug.Service';
import { ErrorService } from 'src/app/Mes_Services/error.Service';
import { LocalService } from 'src/app/Mes_Services/local.Service';
import { TextPlugin } from 'gsap/TextPlugin';
import { Router } from '@angular/router';

gsap.registerPlugin(TextPlugin);
@Component({
  selector: 'app-select-bdet-pourc',
  templateUrl: './select-bdet-pourc.component.html',
  styleUrls: ['./select-bdet-pourc.component.css'],
})
export class SelectBDetPourcComponent implements OnInit, AfterViewInit {
  pourcentageBug: any = 0;
  teste: any = 80;
  pourcentagePlugin: any = 0;
  pourcentageVideo: any = 0;
  checkedPost: boolean = false;
  checkedPluging: boolean = false;
  checkedVideo: boolean = false;
  AnnimationSuccess: boolean = false;
  @ViewChild('bd') itemBd: ElementRef;
  constructor(
    private bugService: BugService,
    private pluginService: AppPlugingService,
    private videoService: AppVideoService,
    private localService: LocalService,
    private alertError: ErrorService,
    private route: Router
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.animBd();
  }
  animBd() {
    let instance = gsap.timeline();
    instance.from(this.itemBd.nativeElement.childNodes, {
      ease: 'back',
      y: -400,
      opacity: 0,
      stagger: 1,
      duration: 2,
    });

    instance.from('.col-btn', {
      opacity: 0,
      duration: 1.5,
    });
    instance.to(this.itemBd.nativeElement.childNodes, {
      ease: 'back',
      y: -15,
      stagger: 1,
      repeat: -1,
      duration: 2,
    });
  }
  //Methode pour le demarage du sauvegarde
  //TODO
  demarrerSauvegard(): boolean {
    if (!this.verifyBdAndPourcentage()) {
      return false;
    }
    this.traitementPourcentage();
    this.localService.onCheckedBdSauvegarde(
      this.checkedPost,
      this.checkedPluging,
      this.checkedVideo
    );
    if (this.checkedPost) {
      this.bugService.sauvegardeDbBugCryptLocal();
    }
    if (this.checkedPluging) {
      this.pluginService.sauvegardeDbPluginCryptLocal();
    }
    if (this.checkedVideo) {
      this.videoService.sauvegardeDbVideoCryptLocal();
    }

    this.annimAlertSuccess();
    setTimeout(() => {
      this.route.navigate(['local/details/EcmBd/ActiveLocal']);
    }, 13500);
    return true;
  }
  //Methode pour le traitement du pourcentage
  //TODO
  traitementPourcentage() {
    if (this.checkedPost) {
      this.traitementSwitch(this.pourcentageBug, 'ECM_PB_B');
    }
    if (this.checkedPluging) {
      this.traitementSwitch(this.pourcentagePlugin, 'ECM_PB_P');
    }
    if (this.checkedVideo) {
      this.traitementSwitch(this.pourcentageVideo, 'ECM_PB_V');
    }
  }
  traitementSwitch(paramPoucentage: string, nameDbPoucentage: string) {
    switch (paramPoucentage) {
      case '100':
        this.localService.savePoucentageDoneLocal(1, nameDbPoucentage);
        break;
      case '75':
        this.localService.savePoucentageDoneLocal(3, nameDbPoucentage);
        break;
      case '50':
        this.localService.savePoucentageDoneLocal(2, nameDbPoucentage);
        break;
      case '25':
        this.localService.savePoucentageDoneLocal(4, nameDbPoucentage);
        break;
    }
  }
  //Methode de verification BD checked an poucentage
  //TODO
  verifyBdAndPourcentage(): boolean {
    let oneError: Boolean = false;
    let twoError: Boolean = false;
    let streeError: Boolean = false;
    //Verifi si au moin une bd est cochee
    if (!this.checkedPost && !this.checkedPluging && !this.checkedVideo) {
      this.alertError.notifyAlertErrorDefault(
        'Veillez choisir au moins une BD ...'
      );
      return false;
    }
    //Verifi si une bd est cochee le % est defini
    if (this.checkedPost && this.pourcentageBug == '0') {
      this.notifyError('App-Post');
      oneError = true;
    }
    if (this.checkedPluging && this.pourcentagePlugin == '0') {
      if (oneError) {
        setTimeout(() => {
          this.notifyError('App-Plugin');
          twoError = true;
        }, 2000);
      } else {
        this.notifyError('App-Plugin');
        twoError = true;
      }
    }
    if (this.checkedVideo && this.pourcentageVideo == '0') {
      if (oneError && twoError) {
        setTimeout(() => {
          this.notifyError('App-URL-Video');
          streeError = true;
        }, 6000);
      } else if (oneError || twoError) {
        setTimeout(() => {
          this.notifyError('App-URL-Video');
          streeError = true;
        }, 4000);
      } else {
        this.notifyError('App-URL-Video');
        streeError = true;
      }
    }
    if (oneError || twoError || streeError) {
      return false;
    }
    return true;
  }
  //Methode de notification error
  //TODO
  notifyError(nameBd: string) {
    this.alertError.notifyAlertErrorDefault(
      `Veillez définir le pourcentage de sauvegarde de BD ${nameBd} ...`
    );
  }

  //Methode pour annimation danger
  //TODO
  annimAlertSuccess(): number {
    if (this.AnnimationSuccess) {
      return 0;
    }
    this.AnnimationSuccess = true;
    let instance = gsap.timeline();
    instance.to('.alert-notify', {
      ease: 'back',
      right: 10,
      duration: 1,
    });
    instance.to('.alert-notify p', {
      delay: 1,
      text: 'Sauvegarde succée ! Patienté la redirection vers les détails ... Merçi',
      duration: 2,
    });
    instance.to('.progress-bar', {
      width: 210,
      duration: 2.5,
    });
    setTimeout(() => {
      instance.reversed(true);
      // le reversed prendra aussi une seconde
      setTimeout(() => {
        this.AnnimationSuccess = false;
      }, 6500);
    }, 7000);
    return 1;
  }
}
