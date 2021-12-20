import { Injectable } from '@angular/core';
import { ErrorService } from './error.Service';
import * as moment from 'moment';
moment().locale('fr');
//Enumeration des types de db en local
export enum dbNameType {
  BUG,
  PLUGIN,
  VIDEO,
}

@Injectable()
export class LocalService {
  formaDate: string = 'Do MMMM YYYY, h:mm:ss ';
  constructor(private errorNotifyService: ErrorService) {}
  ecritureMemoireLocal: boolean = true;
  //Methode pour initialiser ECM_Local appeller du AppComponent
  //TODO
  initECM_Local(): boolean {
    localStorage.removeItem('ECM_Local_Bd_');
    if (localStorage.getItem('ECM_Local') == null) {
      try {
        localStorage.setItem('ECM_Local', window.btoa('false'));
        localStorage.setItem('ECM_Local_Bd_B', window.btoa('false'));
        localStorage.setItem('ECM_Local_Bd_P', window.btoa('false'));
        localStorage.setItem('ECM_Local_Bd_V', window.btoa('false'));
        localStorage.setItem('ECM_PB_B', '0');
        localStorage.setItem('ECM_PB_P', '0');
        localStorage.setItem('ECM_PB_V', '0');
        this.ecritureMemoireLocal = true;
        return true;
      } catch {
        this.errorNotifyService.notifyAlertErrorDefault(
          "Désoler nous ne parvenons pas a écrire dans votre mémoire local ! L'environnement local ne peut fonctionné "
        );
        this.ecritureMemoireLocal = false;
        return false;
      }
    }
    return false;
  }
  //Methode pour verifier si le user a activer le mode Local
  //TODO
  verifyModeLocal(): boolean | number {
    if (localStorage.getItem('ECM_Local')) {
      const result_ECM_Local: any = localStorage.getItem('ECM_Local');
      try {
        const decript_Result_ECM_Local = window.atob(result_ECM_Local);
        return this.ECM_SVSD_True_False(decript_Result_ECM_Local);
      } catch {
        this.ECM_SVSD_Error_Decript();
      }
      return 0;
    } else {
      if (this.ecritureMemoireLocal) {
        this.errorNotifyService.notifyAlertErrorDefault(
          "Donnée local néttoyée ! Veiller reconfiguré l'environnement local "
        );
      }
      return 0;
    }
  }
  //Methode pour verifier si le user a activer le mode Local et qu'il n'y pas de donne manquant
  //TODO
  verifyDonneLocal(): boolean {
    if (
      localStorage.getItem('ECM_UI_MG') == null ||
      localStorage.getItem('ECM_UI_FB') == null ||
      localStorage.getItem('ECM_UM') == null ||
      localStorage.getItem('nomUserConnected') == null ||
      localStorage.getItem('prenomUserConnected') == null ||
      localStorage.getItem('modeNaveUserConnected') == null ||
      localStorage.getItem('securiteUserConnected') == null ||
      localStorage.getItem('promoUserConnected') == null
    ) {
      this.errorNotifyService.notifyAlertErrorDefault(
        "Mode local activé ! Mais des données sont perdus en local, veillez reconfiguré l'environnement local ..."
      );
      return false;
    } else {
      return true;
    }
  }
  //Methode pour  le pourcentage de sauvegard des donnes local
  //TODO
  savePoucentageDoneLocal(pourcentage: number, nameBdPourcentage: string) {
    switch (pourcentage) {
      case 1:
        localStorage.setItem(nameBdPourcentage, '1');
        break;
      case 2:
        localStorage.setItem(nameBdPourcentage, '2');
        break;
      case 3:
        localStorage.setItem(nameBdPourcentage, '3');
        break;
      case 4:
        localStorage.setItem(nameBdPourcentage, '4');
        break;
    }
  }
  //Methode pour la date de sauvegarde
  //TODO
  dataSavedDonneLocal(dbNameParam: dbNameType) {
    moment().locale('fr');
    const date: any = moment().format('Do MMMM YYYY, HH:mm:ss');
    switch (dbNameParam) {
      case dbNameType.BUG:
        localStorage.setItem(
          'ECM_DT_Local_B',
          window.btoa(JSON.stringify(date))
        );
        break;
      case dbNameType.PLUGIN:
        localStorage.setItem(
          'ECM_DT_Local_P',
          window.btoa(JSON.stringify(date))
        );

        break;
      case dbNameType.VIDEO:
        localStorage.setItem(
          'ECM_DT_Local_V',
          window.btoa(JSON.stringify(date))
        );

        break;
    }
  }
  getdateSavedDonneLocal(dbNameParam: dbNameType): any {
    switch (dbNameParam) {
      case dbNameType.BUG:
        return this.traitementGetDateSavedLocal('ECM_DT_Local_B');
      case dbNameType.PLUGIN:
        return this.traitementGetDateSavedLocal('ECM_DT_Local_P');
      case dbNameType.VIDEO:
        return this.traitementGetDateSavedLocal('ECM_DT_Local_V');
    }
  }
  traitementGetDateSavedLocal(dbName: string): any {
    if (localStorage.getItem(dbName)) {
      const date: any = localStorage.getItem(dbName);
      try {
        const dateDecript = window.atob(date);
        const datePars = JSON.parse(dateDecript);
        return datePars;
      } catch {
        this.ECM_SVSD_Error_Decript();
      }
    }
    this.errorNotifyService.notifyAlertErrorDefault(
      'Donnée local manquante ! Nous constatons que la date de sauvegarde de Local a était supprimer ...'
    );
    return false;
  }
  //Methode pour chercher  le pourcentage de sauvegard des donnes local
  //TODO
  getPoucentageDonneLocal(nameBd: string): number {
    const pourcentage: string | null = localStorage.getItem(nameBd);
    if (pourcentage != null) {
      switch (pourcentage) {
        case '1':
          return 1;
        case '2':
          return 2;
        case '3':
          return 3;
        case '4':
          return 4;
        default:
          return 0;
      }
    } else {
      this.errorNotifyService.notifyAlertErrorDefault(
        "Poucentage Donnée local manquante ! Veiller reconfiguré l'environnement local et redéfinir le poucentage de sauvegarde "
      );
    }
    return 0;
  }
  //Methode pour enregistrer les BD selectionner par le user
  //TODO
  onCheckedBdSauvegarde(
    checkedPost: boolean,
    checkedPlugin: boolean,
    checkedVideo: boolean
  ): boolean {
    if (checkedPost) {
      localStorage.setItem('ECM_Local_Bd_B', window.btoa('true'));
    }
    if (checkedPlugin) {
      localStorage.setItem('ECM_Local_Bd_P', window.btoa('true'));
    }
    if (checkedVideo) {
      localStorage.setItem('ECM_Local_Bd_V', window.btoa('true'));
    }
    return true;
  }
  //Methode pour enregistrer les BD selectionner par le user
  //TODO
  onDesactivatCheckedBdSauvegarde(
    checkedPost: boolean,
    checkedPlugin: boolean,
    checkedVideo: boolean
  ): boolean {
    if (checkedPost) {
      localStorage.setItem('ECM_Local_Bd_B', window.btoa('false'));
    }
    if (checkedPlugin) {
      localStorage.setItem('ECM_Local_Bd_P', window.btoa('false'));
    }
    if (checkedVideo) {
      localStorage.setItem('ECM_Local_Bd_V', window.btoa('false'));
    }
    return true;
  }
  //Metodes pour la verification des BD selectionner pour la sauvegarde
  //TODO
  VerifyAppPost(): boolean | number {
    return this.VerifyBdSaved('ECM_Local_Bd_B');
  }
  VerifyAppPlugin(): boolean | number {
    return this.VerifyBdSaved('ECM_Local_Bd_P');
  }
  VerifyAppVideo(): boolean | number {
    return this.VerifyBdSaved('ECM_Local_Bd_V');
  }
  VerifyBdSaved(nameLocalBd: string): boolean | number {
    if (localStorage.getItem(nameLocalBd)) {
      const savedCrypt: any = localStorage.getItem(nameLocalBd);
      try {
        const savedDecrypt = window.atob(savedCrypt);
        return this.ECM_SVSD_True_False(savedDecrypt);
      } catch {
        this.ECM_SVSD_Error_Decript();
      }
      return 0;
    } else {
      this.errorNotifyService.notifyAlertErrorDefault(
        'Clée Donnée local manquante ! Activation de ECM_SVSD  ... '
      );
      setTimeout(() => {
        if (this.ECM_SVSD_Restaur()) {
          this.errorNotifyService.notifyAlertErrorDefault(
            'ECM_SVSD : Clée Donnée local purifiée, mode Local désactivé ! Evitez de toucher les Clées  ...'
          );
        }
      }, 8000);
      setTimeout(() => {
        if (this.ECM_SVSD_Restaur()) {
          this.errorNotifyService.notifyAlertErrorDefault(
            'ECM_SVSD : Veillez supprimer vous même la clée que vous avez modifier ! ECM_SVSD ne le prend plus en charge ...'
          );
        }
      }, 16000);
      return 0;
    }
  }
  //Methode pour verifier les donnees s'il ne sont pas corrompu........
  //TODO
  ECM_SVSD_True_False(data: string): boolean | number {
    switch (data) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        this.ECM_SVSD_Error_Decript();
        return 0;
    }
  }
  //Methode pour gerer les erreurs l'or du decriptage    ........
  //TODO
  ECM_SVSD_Error_Decript() {
    this.errorNotifyService.notifyAlertErrorDefault(
      'Donnée local corrompue ! Les données trouver en local ne sont pas produite par ECM ! ECM_SVSD Activé ...'
    );
    setTimeout(() => {
      if (this.ECM_SVSD_Restaur()) {
        this.errorNotifyService.notifyAlertErrorDefault(
          'ECM_SVSD : Donnée local purifiée, mode Local désactivé ! Evitez de toucher le Storage ...'
        );
      }
    }, 8000);
  }
  //Methode pour restaurer les donnees s'il  sont  corrompu........
  //TODO
  ECM_SVSD_Restaur(): boolean {
    try {
      localStorage.setItem('ECM_Local', window.btoa('false'));
      localStorage.setItem('ECM_Local_Bd_B', window.btoa('false'));
      localStorage.setItem('ECM_Local_Bd_P', window.btoa('false'));
      localStorage.setItem('ECM_Local_Bd_V', window.btoa('false'));
      localStorage.setItem('ECM_PB', '0');
      this.ecritureMemoireLocal = true;
      return true;
    } catch {
      this.errorNotifyService.notifyAlertErrorDefault(
        "Désoler nous ne parvenons pas a écrire dans votre mémoire local ! L'environnement local ne peut fonctionné "
      );
      this.ecritureMemoireLocal = false;
      return false;
    }
  }
}
