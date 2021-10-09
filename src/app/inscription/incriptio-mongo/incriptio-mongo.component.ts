import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { UserMoogoService } from 'src/app/Mes_Services/userMongo.Service';

@Component({
  selector: 'app-incriptio-mongo',
  templateUrl: './incriptio-mongo.component.html',
  styleUrls: ['./incriptio-mongo.component.css'],
})
export class IncriptioMongoComponent implements OnInit {
  afficheErreur: Boolean = false;
  erreur: string | any;
  email: string = '';
  password: string = '';
  Id_User_Connected: string = '';
  constructor(
    private user: UserService,
    private gard: GardGuard,
    private userMongoService: UserMoogoService,
    private route: Router
  ) {}

  ngOnInit(): void {
    ///Recuperation de l'ID du User Connecter et son email
    //TODO
    this.Id_User_Connected = this.gard.user_Id_Connect;
    //recuperation des information du User Connected
    //TODO
    this.user
      .getInfoUser(this.Id_User_Connected)
      .then((data_User) => {
        //Valeur des champs ...
        this.email = data_User.mail;
        this.password = data_User.mdp;
      })
      .catch((error) => {
        alert("Une erreur s'est produite ...");
      });
  }

  inscriptionMongo() {
    if (this.email != '' && this.password != '') {
      this.userMongoService
        .creatNewUser(this.email, this.password)
        .then(() => {
          this.route.navigate(['/ecm']);
        })
        .catch((error) => {
          this.afficheErreur = true;
          this.erreur = error;
        });
    } else {
      alert(
        'Veillez patienter le chargement des données puis actualisé dans 30s'
      );
    }
  }
}
