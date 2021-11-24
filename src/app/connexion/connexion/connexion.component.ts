import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Mes_Services/auth.Service';
import { UserMoogoService } from 'src/app/Mes_Services/userMongo.Service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
})
export class ConnexionComponent implements OnInit {
  myForm: FormGroup | any;
  afficheErreur: Boolean | any = false;
  erreur: string | any;
  hide = true;
  token: string = '';
  userId: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private serviceAuth: AuthService,
    private route: Router,
    private userMongoService: UserMoogoService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.myForm = this.formBuilder.group({
      mail: ['', [Validators.required, Validators.email]],
      mdp: ['', Validators.required],
    });
    //Appelle de la methode de connexion ...
  }

  //Connexion du User ...
  onSubmitMyForm() {
    //Stockage des donnees du champs ...
    const valueForm = this.myForm.value;
    const mail: string = valueForm['mail'];
    const mdp: string = valueForm['mdp'];

    //Appelle de la methode du service ...
    this.serviceAuth
      .authUser(mail.trim(), mdp.trim())
      .then(() => {
        //Connection du user a mongodb
        this.userMongoService
          .connectUserMoogo(mail.trim(), mdp.trim())
          .then((data: { token: string; userId: string }) => {
            this.userId = data.userId;
            this.token = data.token;
            this.route.navigate(['/ecm']);
          })
          .catch(() => {
            this.afficheErreur = true;
            this.erreur =
              "Erreur d'authentification c'est produite vous serez déconnecté du premier serveur ! Réessayer la connexion";
            this.serviceAuth.signOutUser();
          });
      })
      .catch((error) => {
        this.afficheErreur = true;
        this.erreur = error;
      });
  }

  //Masquer Erreur apres reset
  //TODO
  masqueErreur() {
    this.afficheErreur = false;
  }
}
