import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Mes_Services/auth.Service';
import { UserModel } from 'src/app/Models/user';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'],
})
export class InscriptionComponent implements OnInit {
  myFormNom: FormGroup | any;
  myFormPrenom: FormGroup | any;
  myFormPromotion: FormGroup | any;
  myFormMail: FormGroup | any;
  myFormMdp: FormGroup | any;
  myFormVmdp: FormGroup | any;
  afficheErreur: Boolean = false;
  erreur: string | any;
  isLinear = true;
  hide: Boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private serviceAuth: AuthService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.intForm();
  }

  intForm() {
    //Valeur du Nom
    //TODO
    this.myFormNom = this.formBuilder.group({
      nom: ['', Validators.required],
    });
    //Valeur du Prenom
    //TODO
    this.myFormPrenom = this.formBuilder.group({
      prenom: ['', Validators.required],
    });
    //Valeur du Promotion
    //TODO
    this.myFormPromotion = this.formBuilder.group({
      promotion: ['', Validators.required],
    });
    //Valeur du Mail
    //TODO
    this.myFormMail = this.formBuilder.group({
      mail: ['', [Validators.required, Validators.email]],
    });
    //Valeur du Mdp
    //TODO
    this.myFormMdp = this.formBuilder.group({
      mdp: ['', Validators.required],
    });
    //Valeur du Vmdp
    //TODO
    this.myFormVmdp = this.formBuilder.group({
      vmdp: ['', Validators.required],
    });
  }
  /*
   Soumission de la formulaire et verification du mot de passe de confirmation
   */
  //TODO

  onSubmitMyForm() {
    const nom = this.myFormNom.value['nom'];
    const prenom = this.myFormPrenom.value['prenom'];
    const promotion = this.myFormPromotion.value['promotion'];
    const mail = this.myFormMail.value['mail'];
    const mdp = this.myFormMdp.value['mdp'];
    const vmdp = this.myFormVmdp.value['vmdp'];
    if (mdp !== vmdp) {
      this.afficheErreur = true;
      this.erreur =
        'CONFIRMATION DE MOT DE PASSE ____ INCORRECTE____ VEILLEZ BIEN CONFIRMEZ VOTRE MOT DE PASSE';
    } else {
      //Le fantome et code on des valeurs par defaut ...
      const user = new UserModel(nom, prenom, promotion, mail, mdp);

      this.serviceAuth
        .createUser(user)
        .then(() => {
          this.route.navigate(['/ecm']);
        })
        .catch((error) => {
          this.afficheErreur = true;
          this.erreur = error;
        });
    }
  }
  
  /*Masque l'erreur apres la verification du mot de passe de confirmation
   evenement du reste de la formulaire
  */
  //TODO
  masquer_Erreur() {
    this.afficheErreur = false;
    this.erreur = '';
  }
}
