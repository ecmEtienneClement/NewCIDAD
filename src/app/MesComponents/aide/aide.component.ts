import { AfterViewInit, Component, OnInit } from '@angular/core';
// typical import
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
gsap.registerPlugin(TextPlugin);
@Component({
  selector: 'app-aide',
  templateUrl: './aide.component.html',
  styleUrls: ['./aide.component.css'],
})
export class AideComponent implements OnInit, AfterViewInit {
  animationInit: any;
  animationEnCour: boolean = false;
  AnnimationDanger: boolean = false;
  rowDescript: boolean = true;
  rowDetails: boolean = true;
  tbInstanceGsap: any[] = [];
  //Variable pour les col description
  quiEstActive: string = '';
  colDetailPost: boolean = false;
  colDetailPlugin: boolean = false;
  colDetailVideo: boolean = false;
  colDetailToken: boolean = false;
  colDetailmodeSecurise: boolean = false;
  colDetailmodeNavigation: boolean = false;
  colDetailCode: boolean = false;
  colDetailMDP: boolean = false;
  colDetailMail: boolean = false;
  colDetailNoti: boolean = false;
  colDetailZone: boolean = false;
  colDetailReini: boolean = false;
  colDetailLocal: boolean = false;
  colDetailDelete: boolean = false;
  colDetailEcmCidad: boolean = false;
  constructor() {}
  ngAfterViewInit(): void {
    this.initAnim();
  }

  ngOnInit(): void {}
  //Methode pour voir les details avec anim
  //TODO
  viewDetails(classParam: string): boolean {
    //Regle le probleme au cas le user clique 2fois
    if (this.animationEnCour) {
      this.annimAlertDanger();
      return false;
    }
    this.animationEnCour = true;
    setTimeout(() => {
      this.animationEnCour = false;
    }, 2000);
    //...
    if (this.animationInit.isActive()) {
      this.annimAlertDanger();
      return false;
    }
    if (this.tbInstanceGsap.length != 0 && this.tbInstanceGsap[0].isActive()) {
      this.annimAlertDanger();
      return false;
    }
    this.quiEstActive = classParam;
    this.rowDetails = true;
    this.traitementColAfficher(classParam);
    setTimeout(() => {
      this.traitementAnimation(classParam);
    }, 300);
    return true;
  }
  //Methode pour le traitement de anim
  //TODO
  traitementAnimation(classParam: string) {
    let instance = gsap.timeline();
    this.tbInstanceGsap.push(instance);
    instance.to('.rowDescript', {
      opacity: 0,
      duration: 1,
    });
    instance.to('.rowDetails', {
      visibility: 'visible',
      duration: 0.1,
    });
    instance.to(`.${classParam}`, {
      y: 0,
      duration: 1.5,
    });

    setTimeout(() => {
      this.rowDescript = !this.rowDescript;
    }, 1200);
  }
  //Methode pour le traitement des colones a affiché
  //TODO
  traitementColAfficher(classParam: string) {
    switch (classParam) {
      case 'details-post':
        this.colDetailPost = !this.colDetailPost;
        break;
      case 'details-pluging':
        this.colDetailPlugin = !this.colDetailPlugin;
        break;
      case 'details-video':
        this.colDetailVideo = !this.colDetailVideo;
        break;
      case 'details-token':
        this.colDetailToken = !this.colDetailToken;
        break;
      case 'details-modeSecurise':
        this.colDetailmodeSecurise = !this.colDetailmodeSecurise;
        break;
      case 'details-modeNavigation':
        this.colDetailmodeNavigation = !this.colDetailmodeNavigation;
        break;
      case 'details-code':
        this.colDetailCode = !this.colDetailCode;
        break;
      case 'details-mdp':
        this.colDetailMDP = !this.colDetailMDP;
        break;
      case 'details-mail':
        this.colDetailMail = !this.colDetailMail;
        break;
      case 'details-noti':
        this.colDetailNoti = !this.colDetailNoti;
        break;
      case 'details-zone':
        this.colDetailZone = !this.colDetailZone;
        break;
      case 'details-reini':
        this.colDetailReini = !this.colDetailReini;
        break;
      case 'details-local':
        this.colDetailLocal = !this.colDetailLocal;
        break;
      case 'details-delete':
        this.colDetailDelete = !this.colDetailDelete;
        break;
      case 'details-ecmcidad':
        this.colDetailEcmCidad = !this.colDetailEcmCidad;
        break;
    }
  }
  //Methode retour le reversed de l'anim
  //TODO
  retour() {
    this.rowDescript = !this.rowDescript;
    this.tbInstanceGsap.splice(0, 1);
    this.traitementColAfficher(this.quiEstActive);
  }
  //TODO
  ecmCidad(classParam: string): boolean {
    if (this.animationInit.isActive()) {
      this.annimAlertDanger();
      return false;
    }
    if (this.tbInstanceGsap.length != 0 && this.tbInstanceGsap[0].isActive()) {
      this.annimAlertDanger();
      return false;
    }
    if (this.tbInstanceGsap.length != 0) {
      this.retour();
      return false;
    }
    setTimeout(() => {
      this.viewDetails(classParam);
    }, 300);
    return true;
  }
  //Methode pour animation initiale
  //TODO
  initAnim() {
    this.animationInit = gsap.timeline();

    this.animationInit.from('.col-parametre-default', {
      ease: 'back',
      y: 200,

      stagger: 0.2,
      duration: 0.9,
    });
  }

  //Methode pour annimation danger
  //TODO
  annimAlertDanger(): number {
    if (this.AnnimationDanger) {
      return 0;
    }
    this.AnnimationDanger = true;
    let instance = gsap.timeline();
    instance.to('.alert', {
      ease: 'back',
      right: 10,
      duration: 1,
    });
    setTimeout(() => {
      instance.reversed(true);
      // le reversed prendra aussi une seconde
      setTimeout(() => {
        this.AnnimationDanger = false;
      }, 1000);
    }, 4000);
    return 1;
  }
}
