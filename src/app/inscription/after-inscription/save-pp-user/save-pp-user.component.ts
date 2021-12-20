import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Mes_Services/user.Service';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
// typical import
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ErrorService } from 'src/app/Mes_Services/error.Service';
gsap.registerPlugin(TextPlugin);
@Component({
  selector: 'app-save-pp-user',
  templateUrl: './save-pp-user.component.html',
  styleUrls: ['./save-pp-user.component.css'],
})
export class SavePpUserComponent implements OnInit {
  constructor(
    private userService: UserService,
    private route: Router,
    private alertErrorService: ErrorService
  ) {}

  ngOnInit(): void {}
  //Methode detecte File
  //TODO
  detectFiles(event: any) {
    this.animChargementPp();
    this.onUploadFile(event.target.files[0]);
  }
  onUploadFile(file: File) {
    // this.fileIsUploading = true;
    this.userService.onSavePpUser(file).then((url: string) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          //TODO
          firebase
            .firestore()
            .collection('user')
            .doc(user.uid)
            .update({
              ppUser: url,
            })
            .then(() => {
              this.afficheImageCharger();
            })
            .catch(() => {
              this.alertErrorService.notifyAlertErrorDefault(
                "Une erreur s'est produite! Veillez recharger l'image"
              );
            });
        } else {
          this.route.navigate(['/connexion']);
        }
      });
    });
  }

  //Methode pour animer le chargement de la photo
  //TODO
  animChargementPp() {
    let instance = gsap.timeline();
    instance.to('.chargement', {
      duration: 1,
      visibility: 'visible',
    });
    instance.to('.chargement .icone-chargement span', {
      scaleY: 5,
      duration: 0.25,
      stagger: 0.1,
      repeat: -1,
    });
    instance.to('.chargement .txt-chargement b', {
      duration: 3,
      text: 'Chargement Image Profil ...',
      repeat: -1,
    });
  }

  //Methode pour afficher que l'image est charger
  //TODO
  afficheImageCharger() {
    let instance = gsap.timeline();
    instance.to('.chargement', {
      duration: 1,
      visibility: 'hidden',
    });
    instance.to('.succefulChargement', {
      duration: 1,
      visibility: 'visible',
    });
  } //Methode pour masquer que l'image est charger
  //TODO
  //Methode pour continuer
  //TODO
  getNext() {
    this.route.navigate(['inscription/sendQuestionnaire']);
  }
}
