import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AuthService } from './Mes_Services/auth.Service';
import { BugService } from './Mes_Services/bug.Service';
import { Notification } from './Mes_Services/notification.service';
import { ReponseBugService } from './Mes_Services/reponseBug.Service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  user_Connected: Boolean = false;
  constructor(
    private serviceAuth: AuthService,
    private route: Router,
    private serviceBug: BugService,
    private serviceReponseBug: ReponseBugService,
    private notifyService: Notification
  ) {
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: 'AIzaSyDWi460bDoITDItEHyUPKDLVUAegE-X7iE',
      authDomain: 'newcidad-7ed3e.firebaseapp.com',
      databaseURL:
        'https://newcidad-7ed3e-default-rtdb.europe-west1.firebasedatabase.app/',
      projectId: 'newcidad-7ed3e',
      storageBucket: 'newcidad-7ed3e.appspot.com',
      messagingSenderId: '918972046700',
      appId: '1:918972046700:web:761010701f87af75356749',
      measurementId: 'G-GK0DEWBCN9',
    };
    firebase.initializeApp(firebaseConfig);
  }

  ngOnInit(): void {
    //Recuperation des bugs depuis la base de donnee
    //TODO
    this.serviceBug.recupbase();
    //Recuperation des Reponses bugs depuis la base de donnee
    //TODO
    this.serviceReponseBug.recupeBaseReponse();
    //Recupration de la base de notification
    //TODO
    this.notifyService.recupbaseNotify();
    //Verification du User s'il est connecter
    //TODO
    firebase.auth().onAuthStateChanged((data_User: any) => {
      if (data_User) {
        this.user_Connected = true;
      } else {
        this.user_Connected = false;
        this.route.navigate(['/connexion']);
      }
    });
  }

  onsignOut() {
    this.user_Connected = false;
    this.serviceAuth.signOutUser();
  }

  ngOnDestroy(): void {}
}
