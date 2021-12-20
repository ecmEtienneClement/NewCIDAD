import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/Mes_Services/auth.Service';
import { ModelReauthVueDialogComponent } from '../model-reauth-vue-dialog/model-reauth-vue-dialog.component';
import firebase from 'firebase/app';
import 'firebase/auth';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { EventModel, EventType } from 'src/app/Models/eventAction';
import { EmitEvent } from 'src/app/Mes_Services/emitEvent.service';

import { SwiperOptions } from 'swiper';
import { UserMongo } from 'src/app/Models/modelApi';
import { UserMoogoService } from 'src/app/Mes_Services/userMongo.Service';
import { BugService } from 'src/app/Mes_Services/bug.Service';
import { ReponseBugService } from 'src/app/Mes_Services/reponseBug.Service';
// typical import

import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { AppPlugingService } from 'src/app/Mes_Services/appPlugin.Service';
import { Notification } from 'src/app/Mes_Services/notification.service';
import { AppVideoService } from 'src/app/Mes_Services/appVideo.Service';
import { ErrorService } from 'src/app/Mes_Services/error.Service';

gsap.registerPlugin(TextPlugin);

//....

@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.css'],
})
export class ParametreComponent implements OnInit, OnDestroy {
  //Desactive le btn valider avant le chargement des donnees pour eviter le user le click
  data_Charger: boolean = false;
  subscriptionVerificationCode: Subscription = new Subscription();
  //Variable pour le nombre de tentative
  nbrTentative: number = 4;
  //Model user Mongo
  userMongo: UserMongo = { _id: 0, email: '', password: '' };
  Id_User_Connected: string = '';

  tbInstanceGsap: any[] = [];

  constructor(
    public pluginService: AppPlugingService,
    public videoService: AppVideoService,
    public dialog: MatDialog,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private user: UserService,
    private eventService: EmitEvent,
    private gard: GardGuard,
    private userMongoService: UserMoogoService,
    private bugService: BugService,
    private reponseBugService: ReponseBugService,
    private _snackBar: MatSnackBar,
    private notifyService: Notification,
    private errorAlertService: ErrorService
  ) {}

  //Mise en place des variables ..
  //TODO
  //mdp Comment au form le mot de passe user
  mdpUser: string;
  //La valeur du code qui a etait recuperer dans la base de donne
  codeUserbd: any;
  //Variable pour modif code
  ancienCode: any = '';
  nouveauCode: any = '';
  //Variable pour reini code
  mailReiniCode: string = '';
  user_Email_Connect?: string | null;
  //form pour modif email
  formUpdateEmail: FormGroup;
  //form pour modif mdp
  formUpdateMdp: FormGroup;
  //form pour reinitialiser le compte
  formReinitCompte: FormGroup;
  //form pour supprimer le compte
  formDeleteCompte: FormGroup;
  //Varible pour la reini par zone
  zoneReini: string = 'Post';
  mailzoneReini: string | null | any;
  mdpzoneReini: string;
  tbInstancegsap: any[] = [];
  urlPpUser: string = '';
  //Variable pour la securite
  securite: string = 'true';
  //Variable aQui nous permet  de savoir la methode qui a demander la reauthentification
  aQui: string = 'null';
  //Variables pour les animations suppressions
  processus: string = 'Veillez patienter ... ';
  rapport: string = '...';
  messageErrorComment: string =
    "Une erreur inattendu ! l'or de la procedure de suppression de vos ";
  config: SwiperOptions = {
    //effect: 'coverflow',
    effect: 'cube',
    // grabCursor: true,
    //centeredSlides: true,
    //slidesPerView: 'auto',
    loop: false,
    speed: 800,
    coverflowEffect: {
      rotate: 20,
      stretch: 0,
      depth: 10,
      modifier: 1,
      slideShadows: true,
    },

    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      type: 'bullets',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    spaceBetween: 30,
  };
  ngOnInit(): void {
    ///Recuperation de l'ID du User Connecter et son email
    //TODO
    this.Id_User_Connected = this.gard.user_Id_Connect;
    this.user_Email_Connect = this.gard.user_Email_Connect;
    this.mailzoneReini = this.user_Email_Connect;
    //Recuperation du mdp et id UserMongo
    //TODO

    this.userMongoService
      .getUserMongo(this.user_Email_Connect)
      .then((data_User: UserMongo) => {
        this.userMongo = data_User;
      });

    //InitFormUpdateMail
    //TODO
    this.initFormUpdateEmail();
    //InitFormUpdateMdp
    //TODO
    this.initFormUpdateMdp();
    //initFormReinitCompte
    //TODO
    this.initFormReiniCompte();
    //initFormDeletCompte
    //TODO
    this.initFormDeletCompte();

    //recuperation des information du User Connected
    //TODO
    this.user
      .getInfoUser(this.Id_User_Connected)
      .then((data_User) => {
        this.data_Charger = true;
        this.codeUserbd = data_User.code;
        this.securite = data_User.securite;
        this.urlPpUser = data_User.ppUser;
      })
      .catch(() => {
        this.errorAlertService.notifyAlertErrorDefault();
      });

    //Subsciption Pour la verification du code ...
    //TODO
    this.subscriptionVerificationCode = this.subscriptionVerificationCode =
      this.eventService.emitEventSubjectBug.subscribe(
        (data_Event: EventModel) => {
          //Transmission des donnees a la methode traitement ...
          this.traitementSubcriptionCode(data_Event);
        }
      );
  }
  /*.....................................METHODE............................... */

  //Methode DeployerDetailModifCode
  //TODO
  DeployerDetailModifCode() {
    this.DeployerDescription('modifcode');
  }
  //Methode DeployerDetailReiniCode
  //TODO
  DeployerDetailReiniCode() {
    this.DeployerDescription('reinicode');
  }
  //Methode DeployerModifMail
  //TODO
  DeployerDetailModifMail() {
    this.DeployerDescription('modifMail');
  }
  //Methode DeployerModifMdp
  //TODO
  DeployerDetailModifMdp() {
    this.DeployerDescription('modifMdp');
  }
  //Methode DeployerModiModeSecurite
  //TODO
  DeployerDetailModiSecurite() {
    this.DeployerDescription('modisecurite');
  }
  //Methode DeployerReiniPartiel
  //TODO
  DeployerDetailReiniPariel() {
    this.DeployerDescription('ReiniPariel');
  }
  //reinicompte
  //Methode DeployerReiniCompte
  //TODO
  DeployerDetailReiniCompte() {
    this.DeployerDescription('reinicompte');
  }
  //Methode DeployerDeleteCompte
  //TODO
  DeployerDetailDeleteCompte() {
    this.DeployerDescription('deleteCompte');
  }
  //Methode pour fermer la description
  //TODO
  closeDescription() {
    this.tbInstanceGsap[0].reversed(true);
    this.tbInstanceGsap.splice(0, 1);
  }
  traitementSubcriptionCode(data_Event: EventModel) {
    switch (data_Event.type) {
      case EventType.VERIFICATION_CODE:
        //appelle pour la verification
        this.verifyReponseEvent(data_Event.data_paylode_Number);
        break;
    }
  }
  verifyReponseEvent(reponse: number | undefined) {
    if (reponse == 1) {
      this.dialog.closeAll();
      switch (this.aQui) {
        case 'ResetCode':
          this.submitReiniCode();
          break;
        case 'Securite':
          this.submitModifierSecurite();
          break;
        default: {
          alert(
            "Une erreur inattendue s'est produite ! veillez reprendre la procedure"
          );
        }
      }
    } else {
      if (this.nbrTentative > 1) {
        --this.nbrTentative;
        const message = `Votre mot de passe est incorrect ! Veillez effacer et reprendre tentative (s) restante (s) ${this.nbrTentative}`;
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
      } else {
        this.dialog.closeAll();
        const message = `Nous constatons que vous avez oubliez votre mot de passe ou vous n'est pas le propriétaire du compte ! Vous serez déconnecté, procéder à la réinitialisation du mot de passe`;
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
        this.authService.signOutUser();
      }
    }
  }

  //Methode Submit pour soumetre les modifications du code
  //TODO
  submitModifierCode() {
    if (this.ancienCode == this.codeUserbd) {
      //Creation de firestore pour la modification des informations du user
      //TODO
      firebase
        .firestore()
        .collection('user')
        .doc(this.Id_User_Connected)
        .update({
          code: this.nouveauCode,
        })

        .then(() => {
          const message =
            'Modification du code enregistrée ! La page sera actualisée dans 2s';
          //Affichage de l'alerte
          this.openSnackBar(message, 'ECM');
          //Attendre 3s avant Actualisation de la page
          setTimeout(() => {
            this.refresh();
          }, 3000);
        })
        .catch((error) => {
          alert("une erreur s'est produite ...");
        });
    } else {
      alert('Votre ancien code est incorrect !');
    }
  }
  //Methode pour verifier la securiter du User cette methode declanche la procedure de securite...
  //TODO
  onVerifyUserResetCode() {
    this.aQui = 'ResetCode';
    //Popope pour le code
    this.openDialog();
  }
  //Methode pour verifier la securiter du User cette methode declanche la procedure de securite...
  //TODO
  onVerifyUserSecurite() {
    this.aQui = 'Securite';
    //Popope pour le code
    this.openDialog();
  }
  //Methode Submit pour soumetre la reinitialisation du code
  //TODO
  submitReiniCode() {
    if (this.mailReiniCode == this.user_Email_Connect) {
      //Creation de firestore pour la reinitialisation du code du user
      //TODO
      firebase
        .firestore()
        .collection('user')
        .doc(this.Id_User_Connected)
        .update({
          code: 1234,
        })

        .then(() => {
          const message =
            'Votre code a était bien réinitialiser à 1234 ! La page sera actualisée dans 2s';
          //Affichage de l'alerte
          this.openSnackBar(message, 'ECM');
          //Attendre 3s avant Actualisation de la page
          setTimeout(() => {
            this.refresh();
          }, 3000);
        })
        .catch((error) => {
          alert("une erreur s'est produite ...");
        });
    } else {
      alert('Votre mail est incorrecte !');
    }
  }
  //Methode Submit pour soumetre la reinitialisation du code
  //TODO
  submitReiniCodeReiniCompte() {
    //Creation de firestore pour la reinitialisation du code du user
    //TODO
    firebase
      .firestore()
      .collection('user')
      .doc(this.Id_User_Connected)
      .update({
        code: 1234,
      })

      .then(() => {
        let processus: string = 'reinitialisation de votre Code';
        let rapport = 'Votre code a était bien réinitialiser à 1234 !';
        //demarage de l'annimation
        //todo
        this.animationSuppression(
          'container-reiniCompte',
          processus,
          rapport,
          8640
        );
        setTimeout(() => {
          const message =
            'Votre Compte était bien réinitialiser  ! La page sera actualisée dans 5s';
          //Affichage de l'alert
          this.openSnackBar(message, 'ECM');
          //Attendre 3s avant Actualisation de la page
          setTimeout(() => {
            this.refresh();
          }, 5000);
        }, 12000);
      })
      .catch((error) => {
        this.errorAlertService.notifyAlertErrorDefault(
          "Une erreur s'est produite l'or de la reinitialisation mode de votre code veillez actualiser ou verifier votre connexion !"
        );
      });
  }

  //Methode Submit pour soumetre la modification du mail
  //TODO
  submitModifEmail() {
    const value = this.formUpdateEmail.value;
    const email = value['email'];
    const newEmail = value['newEmail'];
    const mdp = value['mdpUpdateMail'];
    this.authService
      .updateMail(email, newEmail, mdp)
      .then(() => {
        if (this.userMongo._id == 0) {
          alert('vos données sont chargées partiellement Veillez actualisé !');
        } else {
          //Modification dans mongo
          this.userMongoService
            .updateMailUserMongo(
              newEmail,
              this.userMongo.password,
              this.userMongo._id
            )
            .then(() => {
              localStorage.setItem('ECM_UM', newEmail);
              const message =
                'Votre mail a était bien modifié ! La page sera actualisée dans 2s';
              //Affichage de l'alerte
              this.openSnackBar(message, 'ECM');
              //Attendre 3s avant Actualisation de la page
              setTimeout(() => {
                this.refresh();
              }, 3000);
            })
            .catch(() => {
              //Cas ou le mongo echou on remet l'ancien email

              this.authService
                .updateMail(newEmail, email, mdp)
                .then(() => {
                  const message =
                    "Une erreur s'est produite l'or de la modification veillez actualiser ou verifier votre connexion !";
                  //Affichage de l'alerte
                  this.openSnackBar(message, 'ECM');
                })
                .catch(() => {
                  alert('ERREUR NV2 VEILLER LE SIGNALER A ECM !!!');
                });
            });
        }
      })
      .catch((error) => {
        alert('Erreur ! Veillez bien verifié votre mail saisi');
      });
  }
  //Methode Submit pour soumetre la modification du mot de passe
  //TODO
  submitmodifmdp() {
    const value = this.formUpdateMdp.value;
    const emailmodifmdp = value['emailmodifmdp'];
    const mdpModif = value['mdpModif'];
    const newMdpModif = value['newMdpModif'];
    this.authService
      .updatePassword(emailmodifmdp, mdpModif, newMdpModif)
      .then(() => {
        this.userMongoService
          .updateMdpUserMongo(emailmodifmdp, newMdpModif, this.userMongo._id)
          .then(() => {
            //TODO
            firebase
              .firestore()
              .collection('user')
              .doc(this.Id_User_Connected)
              .update({
                mdp: newMdpModif,
              })
              .then(() => {
                const message =
                  'Votre mot de passe a était bien modifié ! La page sera actualisée dans 2s';
                //Affichage de l'alerte
                this.openSnackBar(message, 'ECM');
                //Attendre 3s avant Actualisation de la page
                setTimeout(() => {
                  this.refresh();
                }, 3000);
              })
              .catch((error) => {
                const message =
                  "Une erreur s'est produite l'or de la modification veillez actualiser ou verifier votre connexion !";
                //Affichage de l'alerte
                this.openSnackBar(message, 'ECM');
              });
          })
          .catch(() => {
            //Cas ou le mongo echou on remet l'ancien mdp
            this.authService
              .updatePassword(emailmodifmdp, newMdpModif, mdpModif)
              .then(() => {
                const message =
                  "Une erreur s'est produite l'or de la modification veillez actualiser ou verifier votre connexion !";
                //Affichage de l'alerte
                this.openSnackBar(message, 'ECM');
              })
              .catch(() => {
                alert('ERREUR NV2 VEILLER LE SIGNALER A ECM !!!');
              });
          });
      })
      .catch((error) => {
        alert(
          'Erreur ! Veillez bien verifié votre mail ou mot de passe saisis'
        );
      });
  }
  //Methode pour modifier la securite..
  //TODO
  submitModifierSecurite() {
    //Creation de firestore pour la reinitialisation du code du user
    //TODO
    firebase
      .firestore()
      .collection('user')
      .doc(this.Id_User_Connected)
      .update({
        securite: this.securite,
      })

      .then(() => {
        this.user
          .getInfoUser(this.Id_User_Connected)
          .then((data_User) => {
            localStorage.setItem('nomUserConnected', data_User.nom);
            localStorage.setItem('prenomUserConnected', data_User.prenom);
            localStorage.setItem('promoUserConnected', data_User.promotion);
            localStorage.setItem('modeNaveUserConnected', data_User.fantome);
            localStorage.setItem('securiteUserConnected', data_User.securite);
          })
          .catch((error) => {
            alert(
              "Une erreur s'est produite recup info User veillez actualisé ..."
            );
          });
        const message =
          'Votre Mode de securité a était bien modifié ! La page sera actualisée dans 2s';
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
        //Attendre 3s avant Actualisation de la page
        setTimeout(() => {
          this.refresh();
        }, 3000);
      })
      .catch((error) => {
        const message =
          "Une erreur s'est produite l'or de la modification veillez actualiser ou verifier votre connexion !";
        //Affichage de l'alerte
        this.openSnackBar(message, 'ECM');
      });
  }
  //Methode pour reinitialiser le mode de navigation du user
  //TODO
  reiniModeNavUser() {
    firebase
      .firestore()
      .collection('user')
      .doc(this.Id_User_Connected)
      .update({
        fantome: 'false',
      })
      .then(() => {
        let processus: string = 'reinitialisation mode de navigation';
        let rapport = 'Votre mode de navigation est a : Mode Identifiable !';
        //demarage de l'annimation
        //todo
        this.animationSuppression(
          'container-reiniCompte',
          processus,
          rapport,
          7560
        );
        //attentredre la fin de l'annimation pour appeller la fontion reiniCodeReinCompte
        setTimeout(() => {
          this.submitReiniCodeReiniCompte();
        }, 12000);
      })
      .catch((error) => {
        this.errorAlertService.notifyAlertErrorDefault(
          "Une erreur s'est produite l'or de la reinitialisation mode de navigation veillez actualiser ou verifier votre connexion !"
        );
      });
  }
  //Methode pour modifier la securite..
  //TODO
  submitReinitSecurite() {
    //Creation de firestore pour la reinitialisation du code du user
    //TODO
    firebase
      .firestore()
      .collection('user')
      .doc(this.Id_User_Connected)
      .update({
        securite: 'true',
      })
      .then(() => {
        let processus: string = 'reinitialisation mode de sécurité';
        let rapport = 'Votre mode de sécurité est a : Mode Sécurisé !';
        //demarage de l'annimation
        //todo
        this.animationSuppression(
          'container-reiniCompte',
          processus,
          rapport,
          6480
        );
        //attentredre la fin de l'annimation pour appeller la fontion reiniCodeReinCompte
        setTimeout(() => {
          this.reiniModeNavUser();
        }, 12000);
      })
      .catch((error) => {
        this.errorAlertService.notifyAlertErrorDefault(
          "Une erreur s'est produite l'or de la reinitialisation mode de sécurité veillez actualiser ou verifier votre connexion !"
        );
      });
  }

  //Methode pour reinitialiser votre compte..
  //TODO
  reiniCompte() {
    const value = this.formReinitCompte.value;
    const emailReinitCompte = value['emailReinitCompte'];
    const mdpReinitCompte = value['mdpReinitCompte'];
    this.afficheContainerSuppression('container-reiniCompte');
    //Appelle reiniAndDeleteCommun pour traite les parties commun..
    this.reiniAndDeleteCommun(
      emailReinitCompte,
      mdpReinitCompte,
      'container-reiniCompte'
    ).then(() => {
      this.submitReinitSecurite();
    });
  }
  //Methode pour reiniZone
  //TODO

  onReiniZoneCompte(): number {
    this.afficheContainerSuppression('container-reiniZoneCompte');
    if (this.mailzoneReini == null || this.mailzoneReini == '') {
      return 0;
    }
    this.authService
      .reAuthentification(this.mailzoneReini, this.mdpzoneReini)
      .then(() => {
        switch (this.zoneReini) {
          case 'post':
            this.bugService
              .deleteBugTotalUserDeleteCompte(this.Id_User_Connected)
              .then((nbrPoste: number) => {
                let processus: string = 'suppression de vos posts';
                //traitement de la valeure de processus
                //todo
                this.traitementRapport(nbrPoste, 'post', 'M');
                //demarage de l'annimation de la suppression
                //todo
                this.animationSuppression(
                  'container-reiniZoneCompte',
                  processus,
                  this.rapport,
                  1080
                );
              })
              .catch(() => {
                this.errorAlertService.notifyAlertErrorDefault(
                  this.messageErrorComment + ' posts ...'
                );
              });
            setTimeout(() => {
              this.RefreshAfterReiniZone('Post');
            }, 13000);
            break;
          case 'plugin':
            this.pluginService
              .deleteManyPlugin(this.Id_User_Connected)
              .then((nbrPluginUser: number) => {
                let processus: string = 'suppression de vos plugins';
                //traitement de la valeure de processus
                //todo
                this.traitementRapport(nbrPluginUser, 'plugin', 'M');
                //demarage de l'annimation de la suppression
                //todo
                this.animationSuppression(
                  'container-reiniZoneCompte',
                  processus,
                  this.rapport,
                  1080
                );
              })
              .catch(() => {
                this.errorAlertService.notifyAlertErrorDefault(
                  this.messageErrorComment + ' plugins ...'
                );
              });
            setTimeout(() => {
              this.RefreshAfterReiniZone('Plugin');
            }, 13000);
            break;
          case 'urlVideo':
            this.videoService
              .deleteManyVideo(this.Id_User_Connected)
              .then((nbrVideoUser: number) => {
                let processus: string = 'suppression de vos URL Videos';
                //traitement de la valeure de processus
                //todo
                this.traitementRapport(nbrVideoUser, 'urlVideo', 'M');
                //demarage de l'annimation de la suppression
                //todo
                this.animationSuppression(
                  'container-reiniZoneCompte',
                  processus,
                  this.rapport,
                  1080
                );
              })
              .catch(() => {
                this.errorAlertService.notifyAlertErrorDefault(
                  this.messageErrorComment + ' URL Videos ...'
                );
              });
            setTimeout(() => {
              this.RefreshAfterReiniZone('Plugin');
            }, 13000);
            break;
          case 'reponse':
            this.reponseBugService
              .DeleteReponseBugUserDeleteCompte(this.Id_User_Connected)
              .then((nbrReponse: number) => {
                let processus: string = 'suppression de vos réponses';
                //traitement de la valeure de processus
                //todo
                this.traitementRapport(nbrReponse, 'réponse', 'F');
                //demarage de l'annimation de la suppression
                //todo
                this.animationSuppression(
                  'container-reiniZoneCompte',
                  processus,
                  this.rapport,
                  1080
                );
              })
              .catch(() => {
                this.errorAlertService.notifyAlertErrorDefault(
                  this.messageErrorComment + ' réponses ...'
                );
              });
            setTimeout(() => {
              this.RefreshAfterReiniZone('Plugin');
            }, 13000);
            break;
          case 'commentaire':
            let nbrCommentaireDeletTotal: number = 0;

            //Pour les commentaires des plugins
            this.reponseBugService
              .DeleteCommentaireBugUserDeleteAndReiniCompte(
                this.Id_User_Connected
              )
              .then((nbrCommentaireBug: number) => {
                nbrCommentaireDeletTotal += nbrCommentaireBug;
                alert(nbrCommentaireBug);
                this.pluginService
                  .DeleteCommentairePluginUserDeleteAndReiniCompte(
                    this.Id_User_Connected
                  )
                  .then((nbrCommentairePlugin: number) => {
                    nbrCommentaireDeletTotal += nbrCommentairePlugin;
                    alert(nbrCommentairePlugin);
                    this.traitementRapport(
                      nbrCommentaireDeletTotal,
                      'commentaire',
                      'M'
                    );
                    let processus: string = 'suppression de vos commentaires';
                    //demarage de l'annimation de la suppression
                    //todo
                    this.animationSuppression(
                      'container-reiniZoneCompte',
                      processus,
                      this.rapport,
                      1080
                    );
                  })
                  .catch(() => {
                    this.errorAlertService.notifyAlertErrorDefault(
                      "Une erreur est survenue l'or de la suppression de vos commentaires "
                    );
                  });
              })
              .catch(() => {
                this.errorAlertService.notifyAlertErrorDefault(
                  "Une erreur est survenue l'or de la suppression de vos commentaires "
                );
              });

            setTimeout(() => {
              this.RefreshAfterReiniZone('Commentaire');
            }, 13000);

            break;
        }
      })
      .catch(() => {
        this.errorAlertService.notifyAlertErrorDefault(
          "Une erreur s'est produite l'or de la Réauthentification veillez actualiser ou verifier votre connexion !"
        );
      });
    return 1;
  }
  //Methode pour supprimer compte User
  //TODO
  deleteUser() {
    const value = this.formDeleteCompte.value;
    const emailDeleteCompte = value['emailDeleteCompte'];
    const mdpDeleteCompte = value['mdpDeleteCompte'];
    //Reauthentification du user
    this.afficheContainerSuppression('container-deleteCompte');

    this.reiniAndDeleteCommun(
      emailDeleteCompte,
      mdpDeleteCompte,
      'container-deleteCompte'
    ).then(() => {
      //Suppression des informations personnelle....
      //todo
      this.user
        .deleteInfoUser(this.Id_User_Connected)
        .then(() => {
          this.user
            .onDeletePpUser(this.urlPpUser)
            .then(() => {
              //RAS
            })
            .catch(() => {
              this.errorAlertService.notifyAlertErrorDefault(
                "Une erreur s'est produite ! Veillez nous le signaler"
              );
            });
          let processus: string = 'suppression de vos données personnelles';
          this.rapport = 'Vos données personnelles ont étaient supprimées !';
          //demarage de l'annimation de la suppression
          //todo
          this.animationSuppression(
            'container-deleteCompte',
            processus,
            this.rapport,
            6480
          );
          setTimeout(() => {
            this.authService
              .deleteUser()
              .then(() => {
                //suppression du bd Notify User
                //todo
                this.notifyService.onDeleteCollectionNotifyUser(
                  this.Id_User_Connected
                );
                this.userMongoService
                  .deletUserMongo(this.userMongo._id)
                  .then(() => {
                    alert('Votre compte est supprimé ');
                  })
                  .catch((error) => {
                    this.errorAlertService.notifyAlertErrorDefault(
                      "Une erreur inattendu ! l'or de la procedure de suppression de votre compte Mongo ..."
                    );
                  });
              })
              .catch((error) => {
                this.errorAlertService.notifyAlertErrorDefault(
                  "Une erreur inattendu ! l'or de la procedure de suppression de votre compte ..."
                );
              });
          }, 12000);
        })
        .catch((error) => {
          this.errorAlertService.notifyAlertErrorDefault(
            "Une erreur inattendu ! l'or de la procedure de suppression de vos données personnelles ..."
          );
        });
    });
  }
  //Methode General pour la suppresion des donnees jusqu'au nivieau apvideo
  //TODO
  reiniAndDeleteCommun(
    donneMail: string,
    donnePassword: string,
    container: string
  ) {
    let nbrTour: number = 1080;
    //Reauthentification du user
    return new Promise((resolve) => {
      this.authService
        .reAuthentification(donneMail, donnePassword)
        .then(() => {
          let nbrCommentaireDeletTotal: number = 0;
          //Lancement des suppressions des commentaires des le début
          //pour les commentaire bug
          this.pluginService
            .DeleteCommentairePluginUserDeleteAndReiniCompte(
              this.Id_User_Connected
            )
            .then((nbrCommentaire: number) => {
              nbrCommentaireDeletTotal += nbrCommentaire;
            })
            .catch(() => {
              this.errorAlertService.notifyAlertErrorDefault(
                "Une erreur est survenue l'or de la suppression de vos commentaires "
              );
            });
          //Pour les commentaires des plugins
          this.reponseBugService
            .DeleteCommentaireBugUserDeleteAndReiniCompte(
              this.Id_User_Connected
            )
            .then((nbrCommentaire: number) => {
              nbrCommentaireDeletTotal += nbrCommentaire;
            })
            .catch(() => {
              this.errorAlertService.notifyAlertErrorDefault(
                "Une erreur est survenue l'or de la suppression de vos commentaires "
              );
            });
          setTimeout(() => {
            //Suppression des posts
            //todo
            this.bugService
              .deleteBugTotalUserDeleteCompte(this.Id_User_Connected)
              .then((nbrPoste: number) => {
                let processus: string = 'suppression de vos posts';
                //traitement de la valeure de processus
                //todo
                this.traitementRapport(nbrPoste, 'post', 'M');
                //demarage de l'annimation de la suppression
                //todo
                this.animationSuppression(
                  container,
                  processus,
                  this.rapport,
                  nbrTour
                );
                //Attendre une 11s pour le temps de la premiere annimation suppression des posts
                setTimeout(() => {
                  //Suppression des reponses
                  //todo
                  this.reponseBugService
                    .DeleteReponseBugUserDeleteCompte(this.Id_User_Connected)
                    .then((nbrReponse: number) => {
                      let processus: string = 'suppression de vos réponses';
                      //traitement de la valeure de processus
                      //todo
                      this.traitementRapport(nbrReponse, 'réponse', 'F');
                      //demarage de l'annimation de la suppression
                      //todo
                      this.animationSuppression(
                        container,
                        processus,
                        this.rapport,
                        nbrTour * 2
                      );
                      //Suppression des plugins
                      //todo
                      setTimeout(() => {
                        this.pluginService
                          .deleteManyPlugin(this.Id_User_Connected)
                          .then((nbrPluginUser: number) => {
                            let processus: string =
                              'suppression de vos plugins';
                            //traitement de la valeure de processus
                            //todo
                            this.traitementRapport(
                              nbrPluginUser,
                              'plugin',
                              'M'
                            );
                            //demarage de l'annimation de la suppression
                            //todo
                            this.animationSuppression(
                              container,
                              processus,
                              this.rapport,
                              nbrTour * 3
                            );
                            setTimeout(() => {
                              this.videoService
                                .deleteManyVideo(this.Id_User_Connected)
                                .then((nbrVideoUser: number) => {
                                  let processus: string =
                                    'suppression de vos URL Videos';
                                  //traitement de la valeure de processus
                                  //todo
                                  this.traitementRapport(
                                    nbrVideoUser,
                                    'urlVideo',
                                    'M'
                                  );
                                  //demarage de l'annimation de la suppression
                                  //todo
                                  this.animationSuppression(
                                    container,
                                    processus,
                                    this.rapport,
                                    nbrTour * 4
                                  );
                                  setTimeout(() => {
                                    let processus: string =
                                      'suppression de vos commentaires';
                                    //traitement de la valeure de processus
                                    //todo
                                    this.traitementRapport(
                                      nbrCommentaireDeletTotal,
                                      'commentaire',
                                      'M'
                                    );
                                    //demarage de l'annimation de la suppression
                                    //todo
                                    this.animationSuppression(
                                      container,
                                      processus,
                                      this.rapport,
                                      nbrTour * 5
                                    );
                                    setTimeout(() => {
                                      resolve(true);
                                    }, 12000);
                                  }, 12000);
                                })
                                .catch((error) => {
                                  this.errorAlertService.notifyAlertErrorDefault(
                                    this.messageErrorComment + ' URL Videos ...'
                                  );
                                });
                            }, 12000);
                          })
                          .catch((error) => {
                            this.errorAlertService.notifyAlertErrorDefault(
                              this.messageErrorComment + ' plugins ...'
                            );
                          });
                      }, 12000);
                    })
                    .catch((error) => {
                      this.errorAlertService.notifyAlertErrorDefault(
                        this.messageErrorComment + ' reponses ...'
                      );
                    });
                }, 12000);
              })
              .catch((error) => {
                this.errorAlertService.notifyAlertErrorDefault(
                  this.messageErrorComment + ' posts ...'
                );
              });
          }, 3000);
        })
        .catch(() => {
          this.errorAlertService.notifyAlertErrorDefault(
            "Une erreur s'est produite l'or de la Réauthentification veillez actualiser ou verifier votre connexion !"
          );
        });
    });
  }

  traitementRapport(nbrElement: number, nom: string, type: string) {
    //attendre 7.5s le temmps que l'annimation arrive au niveau de l'affiche du rapport

    if (type === 'M') {
      if (nbrElement == 0) {
        this.rapport = `Nous constatons que avez aucun ${nom} a supprimé !`;
      } else if (nbrElement == 1) {
        this.rapport = `Vous avez un seul ${nom}  supprimé !`;
      } else {
        this.rapport = `Vous avez ${nbrElement} ${nom}s qui sont supprimés !`;
      }
    } else {
      if (nbrElement == 0) {
        this.rapport = `Nous constatons que avez aucune ${nom} a supprimée !`;
      } else if (nbrElement == 1) {
        this.rapport = `Vous avez une seule ${nom} supprimée !`;
      } else {
        this.rapport = `Vous avez ${nbrElement} ${nom}s qui sont supprimées !`;
      }
    }
  }
  //Initialisation formModifEmail
  //TODO
  initFormUpdateEmail() {
    //Recuperation du mail user pour remplire le premier champ par defaut...
    const mailUser = firebase.auth().currentUser?.email;
    this.formUpdateEmail = this.formBuilder.group({
      email: [mailUser, [Validators.required, Validators.email]],
      newEmail: ['', [Validators.required, Validators.email]],
      mdpUpdateMail: ['', Validators.required],
    });
  }

  //Initialisation formModifMdp
  //TODO
  initFormUpdateMdp() {
    //Recuperation du mail user pour remplire le premier champ par defaut...
    const mailUser = firebase.auth().currentUser?.email;
    this.formUpdateMdp = this.formBuilder.group({
      emailmodifmdp: [mailUser, [Validators.required, Validators.email]],
      mdpModif: ['', Validators.required],
      newMdpModif: ['', Validators.required],
    });
  }
  //Initialisation reinitCompte
  //TODO
  initFormReiniCompte() {
    //Recuperation du mail user pour remplire le premier champ par defaut...
    const mailUser = firebase.auth().currentUser?.email;
    this.formReinitCompte = this.formBuilder.group({
      emailReinitCompte: [mailUser, [Validators.required, Validators.email]],
      mdpReinitCompte: ['', Validators.required],
    });
  }

  //Initialisation formDeletCompte
  //TODO
  initFormDeletCompte() {
    //Recuperation du mail user pour remplire le premier champ par defaut...
    const mailUser = firebase.auth().currentUser?.email;
    this.formDeleteCompte = this.formBuilder.group({
      emailDeleteCompte: [mailUser, [Validators.required, Validators.email]],
      mdpDeleteCompte: ['', Validators.required],
    });
  }

  //Methode Pour Les Notifications ...C'est un service..
  //TODO
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  //Methode pour la demande de code
  //TODO
  openDialog() {
    this.dialog.open(ModelReauthVueDialogComponent);
  }
  //Methode pour rafraichire la page ...
  //TODO
  refresh(): void {
    window.location.reload();
  }
  RefreshAfterReiniZone(messageParam: string) {
    const message = `réinitialisation de la zone ${messageParam} terminée ! La page sera actualisée dans 2s`;
    this.openSnackBar(message, 'ECM');
    //Attendre 3s avant Actualisation de la page
    setTimeout(() => {
      this.refresh();
    }, 3000);
  }

  //Methode de Deployement des descriptions general
  //TODO
  DeployerDescription(description: string) {
    if (this.tbInstanceGsap.length != 0) {
      this.tbInstanceGsap[0].reversed(true);
      this.tbInstanceGsap.splice(0, 1);
    }
    let instanceT: any = gsap.timeline();
    this.tbInstanceGsap.push(instanceT);
    instanceT.to(`.${description}`, {
      visibility: 'visible',
      zIndex: 6,
      ease: 'back',
      top: 0,
      duration: 2.5,
    });
    instanceT.to(`.${description} h1`, {
      opacity: 1,
      duration: 1.5,
    });
    instanceT.to(`.${description} h3`, {
      opacity: 1,
      duration: 1.5,
    });
    instanceT.to(`.${description} .iconexit a`, {
      opacity: 1,
      duration: 1,
    });
  }

  //Methode animation reini and delete
  //TODO
  afficheContainerSuppression(containerParent: string) {
    let instance = gsap.timeline();

    instance.to(`.${containerParent}`, {
      zIndex: 6,
      ease: 'back',
      opacity: 1,
      visibility: 'visible',
      top: 0,
      duration: 1.5,
    });
  }
  animationSuppression(
    containerParent: string,
    processus: string,
    rapport: string,
    angle: number
  ) {
    let instance = gsap.timeline();
    instance.to(`.${containerParent} .container-parent .titre-suppression h4`, {
      text: processus,
      duration: 1.5,
    });
    instance.to(
      `.${containerParent} .container-parent .animation-suppression .fa-file-excel`,
      {
        opacity: 1,
        visibility: 'visible',
        duration: 1,
      }
    );
    instance.to(
      `.${containerParent} .container-parent .animation-suppression .fa-file-excel`,
      {
        rotate: angle,
        duration: 2,
      }
    );
    instance.to(
      `.${containerParent} .container-parent .animation-suppression .fa-file-excel`,
      {
        opacity: 0,
        visibility: 'hidden',
        duration: 0.5,
      }
    );
    instance.to(
      `.${containerParent} .container-parent .animation-suppression .fa-calendar-times`,
      {
        opacity: 1,
        visibility: 'visible',
        duration: 1,
      }
    );
    instance.to(
      `.${containerParent} .container-parent .animation-suppression .fa-calendar-times`,
      {
        opacity: 0,
        visibility: 'invisible',
        duration: 1.5,
      }
    );
    instance.to(
      `.${containerParent} .container-parent .notify-suppression h4`,
      {
        text: rapport,
        duration: 1.5,
      }
    );
  }
  ngOnDestroy(): void {
    this.subscriptionVerificationCode.unsubscribe();
  }
}
