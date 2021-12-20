import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppPlugingService } from 'src/app/Mes_Services/appPlugin.Service';
import { AppVideoService } from 'src/app/Mes_Services/appVideo.Service';
import { BugService } from 'src/app/Mes_Services/bug.Service';
import { dbNameType, LocalService } from 'src/app/Mes_Services/local.Service';

@Component({
  selector: 'app-details-bd-desactive-local',
  templateUrl: './details-bd-desactive-local.component.html',
  styleUrls: ['./details-bd-desactive-local.component.css'],
})
export class DetailsBdDesactiveLocalComponent implements OnInit {
  //variable poucentage
  etat: string = 'En attente';
  pourcentageAfficheBug: any = '0';
  pourcentageAffichePlugin: any = '0';
  pourcentageAfficheVideo: any = '0';
  nbrElementBug: number = 0;
  nbrElementPlugin: number = 0;
  nbrElementVideo: number = 0;
  dateSavedBug: any = '';
  dateSavedPlugin: any = '';
  dateSavedVideo: any = '';
  pourcentageBrute: number = 0;
  constructor(
    private localService: LocalService,
    private bugService: BugService,
    private pluginService: AppPlugingService,
    private videoService: AppVideoService,
    private route: Router
  ) {}

  ngOnInit(): void {
    //traitement de nbr element
    this.onTraitementPoucentageNbrElement();
    //traitement de % element
    this.onTraitementPoucentageBrute();
    //traitement date
    this.onTraitementdateSaved();
    //traitement etat
    this.onTraitementEtatSaved();
  }
  /****************************PARTIE METHODE TRAITEMENT***************************** */

  //Methode pour traiter le nbr element
  //TODO
  onTraitementPoucentageNbrElement() {
    this.nbrElementBug = this.bugService.nbrElementDbBugCryptLocal();
    this.nbrElementPlugin = this.pluginService.nbrElementDbPluginCryptLocal();
    this.nbrElementVideo = this.videoService.nbrElementDbBugCryptLocal();
  }
  //Methode pour traiter le poucentage sauvegarde brute
  //TODO
  onTraitementPoucentageBrute() {
    if (this.nbrElementBug > 0) {
      this.pourcentageAfficheBug = this.returnPoucentage('ECM_PB_B');
    }
    if (this.nbrElementPlugin > 0) {
      this.pourcentageAffichePlugin = this.returnPoucentage('ECM_PB_P');
    }
    if (this.nbrElementVideo > 0) {
      this.pourcentageAfficheVideo = this.returnPoucentage('ECM_PB_V');
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
  //Methode pour le retour
  //TODO
  retour() {
    this.route.navigate(['local/init/EcmBd']);
  }
}
