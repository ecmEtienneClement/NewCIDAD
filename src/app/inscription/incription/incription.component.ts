import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Mes_Services/auth.Service';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { UserMoogoService } from 'src/app/Mes_Services/userMongo.Service';
import { UserModel } from 'src/app/Models/user';
// typical import
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ErrorService } from 'src/app/Mes_Services/error.Service';

gsap.registerPlugin(TextPlugin);
@Component({
  selector: 'app-incription',
  templateUrl: './incription.component.html',
  styleUrls: ['./incription.component.css'],
})
export class IncriptionComponent implements OnInit, AfterViewInit {
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
  token: string;
  userId: string;
  constructor(
    private formBuilder: FormBuilder,
    private serviceAuth: AuthService,
    private route: Router,
    private userMongoService: UserMoogoService,
    private userService: UserService,
    private alertError: ErrorService
  ) {}
  ngAfterViewInit(): void {
    this.animInscription();
  }

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
      this.startAnnimInscription();
      //Le fantome et code on des valeurs par defaut ...
      const user = new UserModel(nom, prenom, promotion, mail, mdp);

      this.serviceAuth
        .createUser(user)
        .then(() => {
          //Creation du user Mongo
          this.userMongoService
            .creatNewUser(user.mail, user.mdp)
            .then(() => {
              //Auth firebase
              this.serviceAuth
                .authUser(user.mail, user.mdp)
                .then(() => {
                  //auth mongo
                  this.userMongoService
                    .connectUserMoogo(user.mail, user.mdp)
                    .then((data: { token: string; userId: string }) => {
                      this.userId = data.userId;
                      this.token = data.token;
                      this.userService.updateInfoUserLocal();
                      localStorage.setItem('ECM_TK', this.token);
                      localStorage.setItem('ECM_UI', this.userId);
                      this.stopAnnimInscription();
                      this.route.navigate(['inscription/savePpUser']);
                    })
                    .catch(() => {
                      this.afficheErreur = true;
                      this.erreur =
                        "Erreur d'authentification c'est produite vous serez déconnecté du premier serveur ! ";
                      this.serviceAuth.signOutUser();
                      this.stopAnnimInscription();
                    });
                })
                .catch((error) => {
                  this.afficheErreur = true;
                  this.erreur =
                    "Erreur d'authentification c'est produite : " + error;
                });
              this.stopAnnimInscription();
            })
            .catch(() => {
              this.serviceAuth
                .deleteUserOfErrorCreateUser()
                .then(() => {
                  this.alertError.notifyAlertErrorDefault(
                    "Erreur inattendue ! Veillez reprendre le processus d'inscription"
                  );
                })
                .catch(() => {
                  alert(
                    "OUPS !!! Une erreur s'est produite l'or de la tentative de création de votre compte! Veillez notifier de cette erreur N°:02 suite à la création de votre compte MERCI ! "
                  );
                });

              this.afficheErreur = true;
              this.erreur =
                'Erreur inattendue ! Veillez reprendre le processus';
            });
          this.stopAnnimInscription();
        })
        .catch((error) => {
          this.afficheErreur = true;
          this.erreur = error;
          this.stopAnnimInscription();
        });
    }
  }

  //Methode pour animation inscription
  //TODO
  animInscription() {
    let instance = gsap.timeline();
    instance.from('.alert-info', {
      ease: 'bounce',
      top: -1500,
      stagger: 2,
      duration: 1,
    });
    instance.to('.definition', {
      text: "communauté informatique développement d'application débogueur",
      duration: 3.5,
    });
    instance.to('.ecm', {
      text: 'etienne clément mbaye',
      duration: 3.5,
    });
    instance.to('.promo', {
      text: 'Promo-7',
      duration: 1.5,
    });
    instance.to('.condition', {
      text: 'CIDAD = ECM ? aider : se faire aider;',
      duration: 3.5,
    });
    instance.to('.ida', {
      text: 'Première Application Web pour (IDA).',
      duration: 3.5,
    });
    instance.to('.adhesion', {
      text: "Adhérer à la communauté CIDAD c'est 100% gratuite.",
      duration: 3.5,
    });
    instance.to('.creer', {
      text: 'CREER UN COMPTE',
      duration: 2.5,
    });
    instance.to('.txtinscription', {
      text: 'Inscrivez-Vous !',
      duration: 2,
    });
    instance.to('.veillez', {
      text: 'Veillez remplire ce formulaire afin de creer votre compte avec CIDAD ...',
      duration: 3.5,
    });
    instance.to('.alert-info', {
      ease: 'back',
      top: 24,
      stagger: 0.5,
      duration: 2,
      repeat: -1,
    });
  }
  //Methode pour annimation de l'inscription
  //TODO
  startAnnimInscription() {
    let instance = gsap.timeline();
    instance.to('.jumbotron', {
      visibility: 'hidden',
      duration: 0.1,
    });
    instance.to('.Container-Fils-Formulaire', {
      visibility: 'hidden',
      duration: 0.1,
    });
    instance.to('.bloc-anim', {
      visibility: 'visible',
      duration: 0.1,
    });
  }
  stopAnnimInscription() {
    let instance = gsap.timeline();
    instance.to('.jumbotron', {
      visibility: 'visible',
      duration: 0.1,
    });
    instance.to('.Container-Fils-Formulaire', {
      visibility: 'visible',
      duration: 0.1,
    });
    instance.to('.bloc-anim', {
      visibility: 'hidden',
      duration: 0.1,
    });
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
