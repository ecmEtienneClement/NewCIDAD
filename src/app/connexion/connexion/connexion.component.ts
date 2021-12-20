import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Mes_Services/auth.Service';
import { ErrorService } from 'src/app/Mes_Services/error.Service';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { UserMoogoService } from 'src/app/Mes_Services/userMongo.Service';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
// typical import
import gsap from 'gsap';
import { UserMongo } from 'src/app/Models/modelApi';
import { TextPlugin } from 'gsap/TextPlugin';
gsap.registerPlugin(TextPlugin);
@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
})
export class ConnexionComponent implements OnInit {
  myForm: FormGroup | any;
  afficheErreur: Boolean | any = false;
  erreur: string | any;
  mailUserSaisi: string = '';
  newMdpUserSaisi: string = '';
  token: string = '';
  userId: string = '';
  formReiniActive: boolean = false;
  formAfterReiniActive: boolean = false;
  retourSavedMdp: boolean = true;
  nbrErreurReath: number = 0;
  tbInstanceGsap: any[] = [];
  tbInstanceGsapReini: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private serviceAuth: AuthService,
    private route: Router,
    private userMongoService: UserMoogoService,
    private userService: UserService,

    private alertError: ErrorService
  ) {}

  ngOnInit(): void {
    /**
     *
     *
     *
     */
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
    this.startAnnimReini('formeConnexion');
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
            this.userService.updateInfoUserLocal();
            //fermeture anim
            this.retourAnimationReini();
            this.route.navigate(['/ecm']);
          })
          .catch(() => {
            //fermeture anim
            this.retourAnimationReini();
            this.afficheErreur = true;
            this.erreur =
              "Erreur d'authentification c'est produite vous serez déconnecté du premier serveur ! Réessayer la connexion";
            this.serviceAuth.signOutUser();
          });
      })
      .catch((error) => {
        //fermeture anim
        this.retourAnimationReini();
        this.afficheErreur = true;
        this.erreur = error;
      });
  }
  //Methode pour afficher la formeReini
  //TODO
  afficheFormReini() {
    let instance = gsap.timeline();
    this.tbInstanceGsap.push(instance);
    instance.to('.formeConnexion', {
      opacity: 0,
      duration: 1.5,
    });
    instance.to('.formeConnexion', {
      visibility: 'hidden',
      duration: 0.1,
    });
    instance.to('.formDemande', {
      opacity: 1,
      top: 10,
      duration: 0.1,
    });
    instance.to('.formDemande b', {
      text: 'Avez-vous déja effectué la procédure et défini un nouveau mot de passe suivant le lien qui vous est envoyé par mail ?',
      duration: 2.5,
    });
  }
  //Methode pour ouiDemande
  //TODO
  ouiDemande() {
    this.retourAnimationDemande();
    setTimeout(() => {
      this.animForm('formeConnexion', 'afterforReini');
      this.alertError.notifyAlertErrorDefault(
        'Veillez enregistré le nouveau mot de passe que vous avez défini suivant le lien envoyer par mail'
      );
    }, 1700);
  }
  //Methode pour nonDemande
  //TODO
  nonDemande() {
    this.retourAnimationDemande();
    setTimeout(() => {
      this.animForm('formeConnexion', 'forReini');
      this.alertError.notifyAlertErrorDefault(
        'Entrez votre mail pour recevoir le lien de réinitialisation'
      );
    }, 1700);
  }
  //Methode pour ouiDefini
  //TODO
  ouiDefini() {
    //fermeture anim
    this.retourAnimationReini();
    setTimeout(() => {
      this.animForm('forReini', 'afterforReini');
      this.alertError.notifyAlertErrorDefault(
        'Veillez enregistré le nouveau mot de passe que vous avez défini suivant le lien envoyer par mail'
      );
      //Masque du btn retour suivant ce chemain le user ne doit fair retour sinon les animations font se torpiller
      this.retourSavedMdp = false;
    }, 1700);
  }
  //Methode pour afficher la formeConnexion
  //TODO
  retourAnimationDemande() {
    this.tbInstanceGsap[0].reversed(true);
    this.tbInstanceGsap.splice(0, 1);
    this.masqueErreur();
  }
  retourFormConnexion() {
    this.retourAnimationDemande();
    setTimeout(() => {
      let instance = gsap.timeline();
      instance.to('.formeConnexion', {
        visibility: 'visible',
        duration: 0.1,
      });
      instance.to('.formeConnexion', {
        opacity: 1,
        duration: 1.5,
      });
    }, 1700);
    this.masqueErreur();
  }
  retourAnimationReini() {
    this.tbInstanceGsapReini[0].reversed(true);
    this.tbInstanceGsapReini.splice(0, 1);
    this.masqueErreur();
  }
  //Methode pour la reinitialisation du mot de passe
  //TODO
  onReinicompte() {
    this.startAnnimReini('forReini');
    this.serviceAuth
      .reInitialisation(this.mailUserSaisi)
      .then(() => {
        //fermeture anim
        this.retourAnimationReini();
        //demarage anim
        setTimeout(() => {
          this.startAnnimConsigne('forReini');
        }, 1700);
        //saved le mail au cas ou le navigateur ce ferme
        localStorage.setItem('mailReiniMdp', this.mailUserSaisi);
        this.alertError.notifyAlertErrorDefault(
          'Merçi de bien consulté votre mail !'
        );
      })
      .catch(() => {
        //fermeture anim
        this.retourAnimationReini();
        this.alertError.notifyAlertErrorDefault(
          '[[--ERREUR--]] Mail non envoyé ! Veillez bien vérifié le mail que vous avez saisi ...'
        );
      });
  }
  //Methode pour after reinitialisation du mot de passe pour changer dans mongo et firstore
  //TODO
  onAfterReinicompte(): boolean {
    this.startAnnimReini('afterforReini');
    if (this.mailUserSaisi == '') {
      const mailLocal: any = localStorage.getItem('mailReiniMdp');
      this.mailUserSaisi = mailLocal;
    }
    if (this.mailUserSaisi == '' || this.mailUserSaisi == null) {
      //fermeture anim
      this.retourAnimationReini();
      alert(
        "Une erreur c'est produite ! Veillez ne pas fermé le navigateur lors de la réinitialisation. "
      );
      alert('Merci de reprendre la procedure ... ');
      return false;
    }
    this.traitementReiniCompte()
      .then(() => {
        //RAS
      })
      .catch(() => {
        ///RAS
      });
    return true;
  }
  traitementReiniCompte(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.serviceAuth
        .authUser(this.mailUserSaisi, this.newMdpUserSaisi)
        .then(() => {
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              this.userService
                .getInfoUser(user.uid)
                .then((dataUser) => {
                  //connexion avec l'ancien mdp du user recuperer dans le firestore
                  const ancienMdpFirestore: string = dataUser.mdp;
                  this.userMongoService
                    .connectUserMoogo(this.mailUserSaisi, ancienMdpFirestore)
                    .then(() => {
                      this.userMongoService
                        .getUserMongo(this.mailUserSaisi)
                        .then((datatUserMongo: UserMongo) => {
                          const Id_User_Mongo = datatUserMongo._id;
                          this.userMongoService
                            .updateMdpUserMongo(
                              this.mailUserSaisi,
                              this.newMdpUserSaisi,
                              Id_User_Mongo
                            )
                            .then(() => {
                              //TODO
                              firebase
                                .firestore()
                                .collection('user')
                                .doc(user.uid)
                                .update({
                                  mdp: this.newMdpUserSaisi,
                                })
                                .then(() => {
                                  this.retourAnimationReini();
                                  localStorage.removeItem('mailReiniMdp');
                                  this.alertError.notifyAlertErrorDefault(
                                    'Votre mot de passe a était bien modifié !'
                                  );
                                  this.userService.updateInfoUserLocal();
                                  this.route.navigate(['/ecm']);
                                  //fermeture anim

                                  resolve(true);
                                })
                                .catch(() => {
                                  //fermeture anim
                                  this.retourAnimationReini();
                                  localStorage.removeItem('mailReiniMdp');
                                  this.alertError.notifyAlertErrorDefault(
                                    "ATTENTION ! Réinitialisation effectuée mais une erreur s'est produite,effectuer une modification de mot de passe dans parametre NB : Vous pouvez remetre le même mot de passe pour resoudre le probleme"
                                  );
                                  this.userService.updateInfoUserLocal();
                                  this.route.navigate(['/ecm']);
                                  reject(false);
                                });
                            })
                            .catch(() => {
                              //fermeture anim
                              this.retourAnimationReini();
                              this.alertError.notifyAlertErrorDefault(
                                'Modification de mot de passe au second serveur rejeté ! Reprendre la procédure si le probleme persite, le signalé ...'
                              );
                              reject(false);
                            });
                        })
                        .catch(() => {
                          //fermeture anim
                          this.retourAnimationReini();
                          this.alertError.notifyAlertErrorDefault(
                            "Demande d'info au second serveur rejeté ! Reprendre la procédure si le probleme persite, le signalé ..."
                          );
                          reject(false);
                        });
                    })
                    .catch(() => {
                      //fermeture anim
                      this.retourAnimationReini();
                      this.alertError.notifyAlertErrorDefault(
                        'Connexion au second serveur rejeté ! Reprendre la procédure si le probleme persite, le signalé ...'
                      );
                      reject(false);
                    });
                })
                .catch(() => {
                  //fermeture anim
                  this.retourAnimationReini();
                  this.alertError.notifyAlertErrorDefault(
                    "Demande d'info au premier serveur rejeté ! Reprendre la procédure si le probleme persite, le signalé ..."
                  );
                  reject(false);
                });
            } else {
              //fermeture anim
              this.retourAnimationReini();
              this.alertError.notifyAlertErrorDefault(
                "Demande d'info [[ auth ]] au premier serveur rejeté ! Reprendre la procédure si le probleme persite, le signalé ..."
              );
            }
          });
        })
        .catch((error) => {
          //fermeture anim
          this.retourAnimationReini();
          this.afficheErreur = true;
          this.erreur = error;
          if (this.nbrErreurReath < 3) {
            this.alertError.notifyAlertErrorDefault(
              'Erreur ! Veillez bien vérifier le mot de passe '
            );
            this.nbrErreurReath += 1;
          } else {
            this.alertError.notifyAlertErrorDefault(
              "Nous constatons que l'erreur persite ! Fermé le navigateur vérifier votre connexion et reprendre la procedure"
            );
          }
        });
    });
  }
  //Masquer Erreur apres reset
  //TODO
  masqueErreur() {
    this.afficheErreur = false;
  }
  //Methode animation form
  //TODO
  animForm(formParamsFerm: string, formParamsAffi: string) {
    let instance = gsap.timeline();
    this.tbInstanceGsap.push(instance);
    instance.to('.formeConnexion', {
      opacity: 0,
      duration: 1.5,
    });
    instance.to(`.${formParamsFerm}`, {
      visibility: 'hidden',
      duration: 0.1,
    });
    instance.to(`.${formParamsAffi}`, {
      top: 10,
      duration: 0.1,
    });
    instance.to(`.${formParamsAffi}`, {
      opacity: 1,
      duration: 1.5,
    });
  }
  //Methode pour annimation de l'reini
  //TODO
  startAnnimReini(formParams: string) {
    let instance = gsap.timeline();
    this.tbInstanceGsapReini.push(instance);
    instance.to(`.${formParams}`, {
      top: -300,
      duration: 0.1,
    });
    instance.to('.bloc-anim', {
      visibility: 'visible',
      opacity: 1,
      top: 0,
      duration: 0.1,
    });
  }
  //Methode pour annimation de l'reini
  //TODO
  startAnnimConsigne(formParams: string) {
    let instance = gsap.timeline();
    this.tbInstanceGsapReini.push(instance);
    instance.to(`.${formParams}`, {
      top: -300,
      duration: 0.1,
    });
    instance.to('.formConsigne', {
      opacity: 1,
      top: 10,
      duration: 0.1,
    });
    instance.to('.formConsigne .txtconsigne b', {
      text:
        'Un mail de réinitialisation a était bien envoyé à: --- ' +
        this.mailUserSaisi +
        " ---. Cliquer sur le lien de cet mail pour définir le nouveau mot de passe, et enfin revenir pour l'enregistrer. Veillez bien définir votre nouveau mot de passe sur le lien avant de l'enregistré ici !",
      duration: 2.5,
    });
  }
}
