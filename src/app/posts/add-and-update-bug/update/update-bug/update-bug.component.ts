import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BugService } from 'src/app/Mes_Services/bug.Service';
import { ErrorService } from 'src/app/Mes_Services/error.Service';
import { BugModel } from 'src/app/Models/bug';

@Component({
  selector: 'app-update-bug',
  templateUrl: './update-bug.component.html',
  styleUrls: ['./update-bug.component.css'],
})
export class UpdateBugComponent implements OnInit {
  //Variable pour le btn d'enregistrement desactiver le btn enregistrer d'est k'il click une fw
  diseableBtnEnregistre: boolean = false;
  dataCharger: boolean = false;
  bugCmp: any = new BugModel('', '', '', '', '', '', 0, Date.now(), ['']);
  myForm: FormGroup;
  indice: number;
  //Valeure des champs par defaut ...
  language = this.bugCmp.language;
  titre = this.bugCmp.titre;
  details = this.bugCmp.details;
  etat = this.bugCmp.etat;
  codePostDelete: string = '';
  newCodePost: string = '';
  tbCode: string[] = this.bugCmp.codeBug;

  constructor(
    private extra: ActivatedRoute,
    private serviceBug: BugService,
    private route: Router,
    private alerterrorService: ErrorService
  ) {}

  ngOnInit(): void {
    //Recuperation de l'indice
    //TODO
    this.indice = this.extra.snapshot.params['indice'];
    //Recuperation du TbBug pour le  modifier
    this.serviceBug
      .recupbaseSoloBug(this.indice)
      .then((data_value) => {
        if (data_value == null) {
          alert("Cet post n'existe pas !");
          this.route.navigate(['/ecm']);
        } else {
          this.dataCharger = true;
          this.bugCmp = data_value;
          this.language = this.bugCmp.language;
          this.titre = this.bugCmp.titre;
          this.details = this.bugCmp.details;
          this.etat = this.bugCmp.etat;
          this.tbCode = this.bugCmp.codeBug;
        }
      })
      .catch(() => {
        this.alerterrorService.notifyAlertErrorDefault();
      });
    //Modifcation du Bug ....
  }

  onSubmitForm(): boolean {
    if (this.language == '' || this.titre == '' || this.details == '') {
      this.alerterrorService.notifyAlertErrorDefault(
        'Veillez remplire tout les champs !'
      );
      return false;
    }
    this.diseableBtnEnregistre = true;
    if (this.tbCode.length < 3) {
      this.traitementAddCodePost(this.newCodePost);
    }
    if (this.tbCode.length > 1) {
      this.traitementDeleteCodePost(this.codePostDelete);
    }
    this.serviceBug.updatBug(
      this.bugCmp,
      this.indice,
      this.language,
      this.titre,
      this.details,
      this.etat,
      this.tbCode
    );
    this.route.navigate(['/ecm']);
    return true;
  }
  //Methode pour ajouter un nouveau code du post
  //TODO
  traitementAddCodePost(code: string) {
    if (code.length > 0 || code != '') {
      this.tbCode.push(code);
    }
  }
  //Methode pour supprimer un code du post
  //TODO
  traitementDeleteCodePost(code: string) {
    switch (code) {
      case '1':
        this.tbCode.splice(0, 1);
        break;
      case '2':
        this.tbCode.splice(1, 1);
        break;
      case '3':
        this.tbCode.splice(2, 1);
        break;
    }
  }

  //Methode pour netoyer le formulaire
  //TODO
  reset() {
    this.language = '';
    this.titre = '';
    this.details = '';
    this.codePostDelete = '';
    this.newCodePost = '';
  }
}
