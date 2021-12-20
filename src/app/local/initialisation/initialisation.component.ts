import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

// typical import
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ErrorService } from 'src/app/Mes_Services/error.Service';
import { LocalService } from 'src/app/Mes_Services/local.Service';

gsap.registerPlugin(TextPlugin);
@Component({
  selector: 'app-initialisation',
  templateUrl: './initialisation.component.html',
  styleUrls: ['./initialisation.component.css'],
})
export class InitialisationComponent implements OnInit, AfterViewInit {
  constructor(
    private route: Router,
    private localService: LocalService,
    private notifyService: ErrorService
  ) {}
  // cliquerPourDeplier
  @ViewChild('containerInitialisation') containerInitialisation: ElementRef;
  @ViewChild('itemTitre') titre: ElementRef;
  @ViewChild('itemTitreLocalActiver') titreActive: ElementRef;
  @ViewChild('itemTitreLocalReActiver') itemTitreLocalReActiver: ElementRef;
  @ViewChild('menu') menu: ElementRef;
  @ViewChild('menuActiver') menuActive: ElementRef;
  @ViewChild('menuReActiver') menuReActive: ElementRef;

  localIsActivated: boolean = false;
  localIsReActivated: boolean = false;

  ngOnInit(): void {
    //Verification du mode local
    this.verifyLocalIsActivated();
    //Verification du mode local desativé et donnes existant en local
    this.verifyLocalIsReActivated();
  }
  ngAfterViewInit(): void {
    if (!this.localIsActivated && !this.localIsReActivated) {
      this.animTitreInit();
    }
    if (this.localIsActivated && !this.localIsReActivated) {
      this.animTitreLocalActive();
      this.animMenuActive();
    }
    if (this.localIsReActivated) {
      this.animTitreLocalReActive();
      this.animMenuReActive();
    }
  }
  //..........................................................

  //Methode pour mener ver la selection des DB
  //TODO
  gotoSelectBdPour() {
    //Activation du mode local
    this.animLocalActivation();
    localStorage.setItem('ECM_Local', window.btoa('true'));
    setTimeout(() => {
      this.route.navigate(['local/init/EcmBd/BdPourc']);
    }, 18000);
  }
  //Methode pour verifier si le mode local est activer
  //TODO
  verifyLocalIsActivated() {
    const result: boolean | number = this.localService.verifyModeLocal();
    if (result == true) {
      this.localIsActivated = true;
      this.localIsReActivated = false;
    } else if (result == false) {
      this.localIsActivated = false;
    }
  }
  //Methode pour verifier si le mode local est desactiver est qu'il ya des tjr des donnees en sauvegarde au moin d'une BD
  //TODO
  verifyLocalIsReActivated() {
    const Bug: boolean | number = this.localService.VerifyAppPost();
    const Plugin: boolean | number = this.localService.VerifyAppPlugin();
    const Video: boolean | number = this.localService.VerifyAppVideo();
    if (Bug == true || Plugin == true || Video == true) {
      if (this.localIsActivated == false) {
        this.localIsReActivated = true;
      }
    } else {
      this.localIsReActivated = false;
    }
  }
  //Methode pour voir les détails
  //TODO
  detailsModeLocal() {
    this.route.navigate(['local/details/EcmBd/ActiveLocal']);
  }
  detailsModeLocalDesactive() {
    this.route.navigate(['local/details/EcmBd/DesactiveLocal']);
  }
  //Methode pour desactiver le mode local
  //TODO
  DesactiveModeLocal() {
    //Activation du mode local
    localStorage.setItem('ECM_Local', window.btoa('false'));
    //Verification du mode local
    this.verifyLocalIsActivated();
    //Verification du mode local desativé et donnes existant en local
    this.verifyLocalIsReActivated();
    this.notifyService.notifyAlertErrorDefault(
      'Le mode local a était bien désactivé ...'
    );
    //Attendre quelques seconde afin que les elements de la vue soient en place pour
    //eviter element undefined avec le gsap annimation
    setTimeout(() => {
      this.ngAfterViewInit();
    }, 100);
  }
  //Methode pour reactiver le mode local
  //TODO
  ReactiveModeLocal() {
    //Activation du mode local
    localStorage.setItem('ECM_Local', window.btoa('true'));
    this.localIsReActivated = false;
    //Verification du mode local
    this.verifyLocalIsActivated();
    //Verification du mode local desativé et donnes existant en local
    this.verifyLocalIsReActivated();
    this.notifyService.notifyAlertErrorDefault(
      'Le mode local a était bien réactiver ...'
    );
    setTimeout(() => {
      this.ngAfterViewInit();
    }, 100);
  }
  ///******************************PARTIE DES ANIMATION******************************** */
  //Methode pour animation titre
  //TODO
  animTitreInit() {
    let instance = gsap.timeline();
    instance.from(this.titre.nativeElement.childNodes, {
      ease: 'back',
      y: -200,
      stagger: 1,
      duration: 2,
    });
    instance.from(this.menu.nativeElement.childNodes, {
      ease: 'back',
      opacity: 0,
      x: 400,
      stagger: 3,
      duration: 3,
    });
    instance.from(this.menu.nativeElement.childNodes, {
      ease: 'back',
      y: -20,
      stagger: 1,
      repeat: -1,
      duration: 2,
    });
  }
  //Methode pour animation Menu Active
  //TODO
  animMenuActive() {
    let instance = gsap.timeline();
    instance.from(this.menuActive.nativeElement.childNodes, {
      ease: 'back',
      opacity: 0,
      x: 400,
      stagger: 3,
      duration: 3,
    });
    instance.from(this.menuActive.nativeElement.childNodes, {
      ease: 'back',
      y: -20,
      stagger: 1,
      repeat: -1,
      duration: 2,
    });
  }
  //Methode pour animation Menu Active
  //TODO
  animMenuReActive() {
    let instance = gsap.timeline();
    instance.from(this.menuReActive.nativeElement.childNodes, {
      ease: 'back',
      opacity: 0,
      x: 400,
      stagger: 3,
      duration: 3,
    });
    instance.from(this.menuReActive.nativeElement.childNodes, {
      ease: 'back',
      y: -20,
      stagger: 1,
      repeat: -1,
      duration: 2,
    });
  }
  //Methode pour animation titre
  //TODO
  animTitreLocalActive() {
    let instance = gsap.timeline();
    instance.to('.titreLocal', {
      ease: 'back',
      text: 'Local Activé ...',
      duration: 5,
      repeat: -1,
    });
  }
  //Methode pour animation titre Reactive
  //TODO
  animTitreLocalReActive() {
    let instance = gsap.timeline();
    instance.to('.titreLocalReactive', {
      opacity: 0,
      duration: 2,
      repeat: -1,
    });
  }
  //Methode pour annimer local-actver
  //TODO
  animLocalActivation() {
    let instance = gsap.timeline();
    instance.to(this.titre.nativeElement.childNodes, {
      opacity: 0,
      stagger: 0.5,
      duration: 0.5,
    });
    instance.to(this.menu.nativeElement.childNodes, {
      opacity: 0,
      stagger: 0.5,
      duration: 0.5,
    });
    instance.to('.local-active', {
      ease: 'back',
      top: 155,
      rotate: 1080,
      duration: 2,
    });
    instance.to('.local-active-description', {
      ease: 'back',
      top: 350,
      rotate: 1080,
      duration: 2,
    });
    instance.to('.local-active-description', {
      text: 'Vous serrez rediriger dans quelques secondes pour les configurations du mode local',
      fontSize: 20,
      padding: 10,
      duration: 3,
    });
  }
}
