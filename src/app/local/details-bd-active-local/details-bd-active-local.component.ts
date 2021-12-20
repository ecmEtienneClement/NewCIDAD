import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import gsap from 'gsap';
import { AppPlugingService } from 'src/app/Mes_Services/appPlugin.Service';
import { AppVideoService } from 'src/app/Mes_Services/appVideo.Service';
import { BugService } from 'src/app/Mes_Services/bug.Service';
import { ErrorService } from 'src/app/Mes_Services/error.Service';
import { dbNameType, LocalService } from 'src/app/Mes_Services/local.Service';

@Component({
  selector: 'app-details-bd-active-local',
  templateUrl: './details-bd-active-local.component.html',
  styleUrls: ['./details-bd-active-local.component.css'],
})
export class DetailsBdActiveLocalComponent implements OnInit, AfterViewInit {
  @ViewChild('ulBtnAcceuille') ulBtnAcceuille: ElementRef;
  @ViewChild('ulBtnAddBD') ulBtnAddBD: ElementRef;
  @ViewChild('ulBtnDeleteBD') ulBtnDeleteBD: ElementRef;
  @ViewChild('ulBtnpourcBD') ulBtnpourcBD: ElementRef;
  //variable poucentage
  pourcentageAddBug: any = '0';
  pourcentageAddPlugin: any = '0';
  pourcentageAddVideo: any = '0';
  pourcentageUpdateBug: any = '0';
  pourcentageUpdatePlugin: any = '0';
  pourcentageUpdateVideo: any = '0';
  pourcentageAfficheBug: any = '0';
  pourcentageAffichePlugin: any = '0';
  pourcentageAfficheVideo: any = '0';
  //Variables d'affichage d'escription
  bdNull: boolean = false;
  nbrElementBug: number = 0;
  nbrElementPlugin: number = 0;
  nbrElementVideo: number = 0;
  dateSavedBug: any = '';
  dateSavedPlugin: any = '';
  dateSavedVideo: any = '';
  etat: string = 'En attente';
  pourcentagePourCircle: any = 0;
  pourcentageBrute: number = 0;
  //variables des check
  checkedPost: boolean = false;
  checkedPlugin: boolean = false;
  checkedVideo: boolean = false;
  //variable memoire
  aQuiLeCheck: string = '';
  //variable des bases checked
  bdBugChecked: boolean = false;
  bdPluginChecked: boolean = false;
  bdVideoChecked: boolean = false;
  //variable des masques
  masquedBtnAddBd: boolean = false;
  masquedBtnDeleteBd: boolean = false;
  bdBugMasqued: boolean = false;
  bdPluginMasqued: boolean = false;
  bdVideoMasqued: boolean = false;
  //vaiable pour le btn menu pour changer les btn avec les icones
  btnParamActif: boolean = false;
  btnHome: boolean = false;
  //variable signal si une annimation est en cour
  AnnimationEnCour: boolean = false;
  AnnimationDanger: boolean = false;
  //variable tb des istances gsap
  tbInstanceAnnimBtn: any[] = [];
  constructor(
    private bugService: BugService,
    private pluginService: AppPlugingService,
    private videoService: AppVideoService,
    private localService: LocalService,
    private notiFyService: ErrorService
  ) {}
  ngAfterViewInit(): void {
    if (this.bdNull) {
      this.annimBdNull();
    }
  }

  ngOnInit(): void {
    //Verification des Db a afficher
    this.verifyBdChecked();
    //traitement du poucentage BD
    this.onTraitementPoucentageBrute();
    //traitement de nbr element
    this.onTraitementPoucentageNbrElement();
    //traitement date
    this.onTraitementdateSaved();
    //traitement etat
    this.onTraitementEtatSaved();
    //Verification des btn a afficher
    this.verifyBdMasquedByBntAddBd();
    this.verifyBdMasquedByBntDeleteBd();
    //La fontion de rappelle
    this.rappelleMiseAjour();
  }

  /***************************  PARTIE NAVIGATIO *********************************** */
  //Methode pour annimer les btn params
  //TODO
  annimBtnParam(): number {
    if (this.AnnimationEnCour) {
      this.annimAlertDanger();
      return 0;
    }
    this.btnParamActif = !this.btnParamActif;
    this.AnnimationEnCour = true;
    if (this.tbInstanceAnnimBtn.length != 0) {
      this.tbInstanceAnnimBtn[0].reversed(true);
      this.tbInstanceAnnimBtn.splice(0, 1);
      setTimeout(() => {
        this.AnnimationEnCour = false;
      }, 1000);
      return 0;
    }
    this.annimulBtn(this.ulBtnAcceuille);
    return 1;
  }
  //Methode pour annimer les btn
  //TODO
  annimBtnNavBD(aQui: string) {
    this.aQuiLeCheck = aQui;
    this.btnHome = true;
    //lance le traite des element li a masquer
    this.onTraitementNavAddAndDelBd();
    //Verifi s'il n'ya op un e annimation en cour
    if (this.AnnimationEnCour) {
      this.annimAlertDanger();
      return 0;
    }

    this.AnnimationEnCour = true;
    //fermeture de la nav acceuille
    if (this.tbInstanceAnnimBtn.length != 0) {
      this.tbInstanceAnnimBtn[0].reversed(true);
      this.tbInstanceAnnimBtn.splice(0, 1);
      setTimeout(() => {
        this.AnnimationEnCour = false;
      }, 1000);
    }
    //Ouverture de la seconde  annimation
    setTimeout(() => {
      switch (aQui) {
        case 'AddBd':
          this.annimulBtn(this.ulBtnAddBD);
          break;
        case 'DelBd':
          this.annimulBtn(this.ulBtnDeleteBD);
          break;
        case '%Bd':
          this.annimulBtn(this.ulBtnpourcBD);
          break;
      }
    }, 1000);
    return 1;
  }
  //Methode pour annimer les btn
  //TODO
  annimBtnHomeBD() {
    //restauration des valeur de masqued
    this.restaureMasqued();
    this.btnHome = false;
    if (this.AnnimationEnCour) {
      this.annimAlertDanger();
      return 0;
    }
    this.AnnimationEnCour = true;
    if (this.tbInstanceAnnimBtn.length != 0) {
      this.tbInstanceAnnimBtn[0].reversed(true);
      this.tbInstanceAnnimBtn.splice(0, 1);
      setTimeout(() => {
        this.AnnimationEnCour = false;
      }, 1000);
    }
    setTimeout(() => {
      this.annimulBtn(this.ulBtnAcceuille);
    }, 1000);
    return 1;
  }
  /****************************PARTIE METHODE TRAITEMENT***************************** */
  //Methode pour traiter le poucentage sauvegarde brute
  //TODO
  onTraitementPoucentageBrute() {
    if (this.bdBugChecked) {
      this.pourcentageAfficheBug = this.pourcentageUpdateBug =
        this.returnPoucentage('ECM_PB_B');
    }
    if (this.bdPluginChecked) {
      this.pourcentageAffichePlugin = this.pourcentageUpdatePlugin =
        this.returnPoucentage('ECM_PB_P');
    }
    if (this.bdVideoChecked) {
      this.pourcentageAfficheVideo = this.pourcentageUpdateVideo =
        this.returnPoucentage('ECM_PB_V');
    }
  }
  returnPoucentage(nameDbPourcentage: string): number {
    //recuperer la valeur de % actuelle et traitement
    this.pourcentageBrute =
      this.localService.getPoucentageDonneLocal(nameDbPourcentage);
    switch (this.pourcentageBrute) {
      case 1:
        return 100;
      case 2:
        return 50;
      case 3:
        return 75;
      case 4:
        return 25;
      default:
        alert('Erreur inattendu N_V:2 ! Veillez nous le signaler');
        return 0;
    }
  }
  //Methode pour traiter le nbr element
  //TODO
  onTraitementPoucentageNbrElement() {
    this.nbrElementBug = this.bugService.nbrElementDbBugCryptLocal();
    this.nbrElementPlugin = this.pluginService.nbrElementDbPluginCryptLocal();
    this.nbrElementVideo = this.videoService.nbrElementDbBugCryptLocal();
  }
  //Methode pour traiter la date
  //TODO
  onTraitementdateSaved() {
    this.dateSavedBug = this.localService.getdateSavedDonneLocal(
      dbNameType.BUG
    );
    this.dateSavedPlugin = this.localService.getdateSavedDonneLocal(
      dbNameType.PLUGIN
    );
    this.dateSavedVideo = this.localService.getdateSavedDonneLocal(
      dbNameType.VIDEO
    );
  }
  //Methode pour traiter l'etat
  //TODO
  onTraitementEtatSaved() {
    if (this.localService.verifyModeLocal() == true) {
      this.etat = 'Actif';
    } else if (this.localService.verifyModeLocal() == false) {
      this.etat = 'Désactivé';
    } else {
      this.etat = '...';
    }
  }
  //Methode pour traiter nav add et del BD
  //TODO
  onTraitementNavAddAndDelBd() {
    switch (this.aQuiLeCheck) {
      case 'AddBd':
        this.verifyBdMasquedByAddBd();
        break;
      case 'DelBd':
        this.verifyBdMasquedByDelBd();
        break;
      case '%Bd':
        this.verifyBdMasquedByDelBd();
        break;
      default:
        alert('Erreur inattendu N_V:2 ! Veillez nous le signaler');
        break;
    }
  }
  //Methode pour verifier les BD checked
  //TODO
  verifyBdChecked() {
    if (this.localService.VerifyAppPost() == true) {
      this.bdBugChecked = true;
    }
    if (this.localService.VerifyAppPost() == false) {
      this.bdBugChecked = false;
    }
    if (this.localService.VerifyAppPlugin() == true) {
      this.bdPluginChecked = true;
    }
    if (this.localService.VerifyAppPlugin() == false) {
      this.bdPluginChecked = false;
    }
    if (this.localService.VerifyAppVideo() == true) {
      this.bdVideoChecked = true;
    }
    if (this.localService.VerifyAppVideo() == false) {
      this.bdVideoChecked = false;
    }
    if (!this.bdBugChecked && !this.bdPluginChecked && !this.bdVideoChecked) {
      this.bdNull = true;
    } else {
      this.bdNull = false;
    }
  }
  //Methode pour verifier le Masque du btn Add BD
  //TODO
  verifyBdMasquedByBntAddBd() {
    if (
      this.localService.VerifyAppPost() == true &&
      this.localService.VerifyAppPlugin() == true &&
      this.localService.VerifyAppVideo() == true
    ) {
      this.masquedBtnAddBd = true;
    } else {
      this.masquedBtnAddBd = false;
    }
  }
  //Methode pour verifier le Masque du btn Delete BD
  //TODO
  verifyBdMasquedByBntDeleteBd() {
    if (
      this.localService.VerifyAppPost() == false &&
      this.localService.VerifyAppPlugin() == false &&
      this.localService.VerifyAppVideo() == false
    ) {
      this.masquedBtnDeleteBd = true;
    }
    if (
      this.localService.VerifyAppPost() == true ||
      this.localService.VerifyAppPlugin() == true ||
      this.localService.VerifyAppVideo() == true
    ) {
      this.masquedBtnDeleteBd = false;
    }
  }
  //Methode pour verifier les BD Masque par naviguation vers BD activé
  //TODO
  verifyBdMasquedByAddBd() {
    if (this.localService.VerifyAppPost() == false) {
      this.bdBugMasqued = true;
    }
    if (this.localService.VerifyAppPlugin() == false) {
      this.bdPluginMasqued = true;
    }
    if (this.localService.VerifyAppVideo() == false) {
      this.bdVideoMasqued = true;
    }
  }
  //Methode pour verifier les BD Masque par naviguation vers BD desactivé
  //TODO
  verifyBdMasquedByDelBd() {
    if (this.localService.VerifyAppPost() == true) {
      this.bdBugMasqued = true;
    }
    if (this.localService.VerifyAppPlugin() == true) {
      this.bdPluginMasqued = true;
    }
    if (this.localService.VerifyAppVideo() == true) {
      this.bdVideoMasqued = true;
    }
  }
  //Methode pour restaurer les Masque Bd
  //TODO
  restaureMasqued() {
    this.bdBugMasqued = false;
    this.bdPluginMasqued = false;
    this.bdVideoMasqued = false;
  }
  // LES METHODES POUR LES CHECKED
  //TODO
  oncheckedPost() {
    this.checkedPost = !this.checkedPost;
  }
  oncheckedPlugin() {
    this.checkedPlugin = !this.checkedPlugin;
  }
  oncheckedVideo() {
    this.checkedVideo = !this.checkedVideo;
  }
  //Methode pour traite les checked
  //TODO
  onValidChecked() {
    switch (this.aQuiLeCheck) {
      case 'AddBd':
        this.addBd(
          this.pourcentageAddBug,
          this.pourcentageAddPlugin,
          this.pourcentageAddVideo
        );
        break;
      case 'DelBd':
        this.deleteBd();
        break;
      case '%Bd':
        this.addBd(
          this.pourcentageUpdateBug,
          this.pourcentageUpdatePlugin,
          this.pourcentageUpdateVideo
        );
        break;
      default:
        alert('Erreur inattendu N_V:2 ! Veillez nous le signaler');
        break;
    }
    //restauration des valeur de masqued
    this.restaureMasqued();
    this.annimBtnHomeBD();
  }
  //Methode pour ajouter un Bug
  //TODO
  addBd(
    paramsPoucentageBug: string,
    paramsPoucentagePlugin: string,
    paramsPoucentageVideo: string
  ): boolean {
    //verification
    if (
      !this.verifyBdAndPourcentage(
        paramsPoucentageBug,
        paramsPoucentagePlugin,
        paramsPoucentageVideo
      )
    ) {
      return false;
    }

    //ouverture des Bd
    if (
      this.localService.onCheckedBdSauvegarde(
        this.checkedPost,
        this.checkedPlugin,
        this.checkedVideo
      )
    ) {
      if (this.aQuiLeCheck == 'AddBd') {
        this.notiFyService.notifyAlertErrorDefault('BD activé(s) ');
      } else {
        this.notiFyService.notifyAlertErrorDefault(
          'Poucentage(s) BD Modifié(s)'
        );
      }
    }
    //traitement du poucentage
    this.traitementPourcentage(
      paramsPoucentageBug,
      paramsPoucentagePlugin,
      paramsPoucentageVideo
    );
    this.verifyBdChecked();
    this.restaureChecked();

    //Verification des btn a afficher
    this.verifyBdMasquedByBntAddBd();
    this.verifyBdMasquedByBntDeleteBd();
    return true;
  }
  //Methode de verification BD checked an poucentage
  //TODO
  verifyBdAndPourcentage(
    paramsPoucentageBug: string,
    paramsPoucentagePlugin: string,
    paramsPoucentageVideo: string
  ): boolean {
    let oneError: Boolean = false;
    let twoError: Boolean = false;
    let streeError: Boolean = false;
    //Verifi si au moin une bd est cochee
    if (!this.checkedPost && !this.checkedPlugin && !this.checkedVideo) {
      this.notiFyService.notifyAlertErrorDefault(
        'Veillez choisir au moins une BD ...'
      );
      return false;
    }
    //Verifi si une bd est cochee le % est defini
    if (this.checkedPost && paramsPoucentageBug == '0') {
      this.notifyError('App-Post');
      oneError = true;
    }
    if (this.checkedPlugin && paramsPoucentagePlugin == '0') {
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
    if (this.checkedVideo && paramsPoucentageVideo == '0') {
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
  traitementPourcentage(
    paramsPoucentageBug: string,
    paramsPoucentagePlugin: string,
    paramsPoucentageVideo: string
  ) {
    if (this.checkedPost) {
      this.traitementSwitch(paramsPoucentageBug, 'ECM_PB_B');
    }
    if (this.checkedPlugin) {
      this.traitementSwitch(paramsPoucentagePlugin, 'ECM_PB_P');
    }
    if (this.checkedVideo) {
      this.traitementSwitch(paramsPoucentageVideo, 'ECM_PB_V');
    }
  }
  traitementSwitch(paramPoucentage: string, nameDbPoucentage: string) {
    switch (paramPoucentage) {
      case '100':
        this.localService.savePoucentageDoneLocal(1, nameDbPoucentage);
        this.onTraitementPoucentageBrute();
        this.afterTraitementPourcentage();
        break;
      case '75':
        this.localService.savePoucentageDoneLocal(3, nameDbPoucentage);
        this.onTraitementPoucentageBrute();
        this.afterTraitementPourcentage();
        break;
      case '50':
        this.localService.savePoucentageDoneLocal(2, nameDbPoucentage);
        this.onTraitementPoucentageBrute();
        this.afterTraitementPourcentage();
        break;
      case '25':
        this.localService.savePoucentageDoneLocal(4, nameDbPoucentage);
        this.onTraitementPoucentageBrute();
        this.afterTraitementPourcentage();
        break;
    }
  }
  //Methode pour redefinir les elements apres le changement de %
  //TODO
  afterTraitementPourcentage() {
    if (this.checkedPost) {
      this.bugService.deleteDbBugCryptLocal(true);
      this.bugService.sauvegardeDbBugCryptLocal();
      this.onTraitementPoucentageBrute();
      this.onTraitementPoucentageNbrElement();
      this.onTraitementdateSaved();
    }
    if (this.checkedPlugin) {
      this.pluginService.deleteDbPluginCryptLocal(true);
      this.pluginService.sauvegardeDbPluginCryptLocal();
      this.onTraitementPoucentageBrute();
      this.onTraitementPoucentageNbrElement();
      this.onTraitementdateSaved();
    }
    if (this.checkedVideo) {
      this.videoService.deleteDbVideoCryptLocal(true);
      this.videoService.sauvegardeDbVideoCryptLocal();
      this.onTraitementPoucentageBrute();
      this.onTraitementPoucentageNbrElement();
      this.onTraitementdateSaved();
    }
  }
  //Methode de notification error
  //TODO
  notifyError(nameBd: string) {
    this.notiFyService.notifyAlertErrorDefault(
      `Veillez définir le pourcentage de sauvegarde de BD ${nameBd} ...`
    );
  }
  //Methode pour desactiver Bug
  //TODO
  deleteBd() {
    //Lancement des suppression des donnnees des bd activer avant la desactivation
    if (this.checkedPost) {
      this.bugService.deleteDbBugCryptLocal(false);
    }
    if (this.checkedPlugin) {
      setTimeout(() => {
        this.pluginService.deleteDbPluginCryptLocal(false);
      }, 2000);
    }
    if (this.checkedVideo) {
      setTimeout(() => {
        this.videoService.deleteDbVideoCryptLocal(false);
      }, 4000);
    }
    if (
      this.localService.onDesactivatCheckedBdSauvegarde(
        this.checkedPost,
        this.checkedPlugin,
        this.checkedVideo
      )
    ) {
      setTimeout(() => {
        this.notiFyService.notifyAlertErrorDefault(
          'BD Supprimé(s) et désactivé(s) '
        );
      }, 6000);
    }
    this.verifyBdChecked();
    this.restaureChecked();
    //Verification des btn a afficher
    this.verifyBdMasquedByBntAddBd();
    this.verifyBdMasquedByBntDeleteBd();
  }

  //Metode pour restaurer les checked
  //TODO
  restaureChecked() {
    this.checkedPost = false;
    this.checkedPlugin = false;
    this.checkedVideo = false;
  }
  //Methode de rappelle pour mettre a jour les donnees
  //TODO
  rappelleMiseAjour() {
    setInterval(() => {
      this.onTraitementPoucentageBrute();
      this.onTraitementPoucentageNbrElement();
      this.onTraitementdateSaved();
    }, 5000);
  }
  /****************************** PARTIE ANNIMATION *******************************/
  //Methode pour annimation btn parametre
  //TODO
  annimulBtn(element: any) {
    let instance = gsap.timeline();
    this.tbInstanceAnnimBtn.push(instance);
    instance.to(element.nativeElement.childNodes, {
      ease: 'back',
      right: 105,
      stagger: 0.25,
      duration: 0.25,
    });
    setTimeout(() => {
      this.AnnimationEnCour = false;
    }, 1000);
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
  //Methode pour annimer bdNull
  annimBdNull() {
    let instance = gsap.timeline();
    instance.from('.bdnull', {
      ease: 'back',
      top: -100,
      duration: 2,
    });
    instance.to('.bdnull', {
      opacity: 0,
      duration: 2,
      repeat: -1,
    });
  }
}
