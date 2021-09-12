import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.css'],
})
export class ParametreComponent implements OnInit {
  mail: any = '@gmail.com';
  mdp: string | any;
  confmdp: string | any;
  confirmdp: any;
  afficheBlocMail: boolean | any = false;
  afficheBlocMdp: boolean | any = false;
  btnDisabledModifMdp: boolean | any = false;
  afficheBlocDeleteUser: boolean | any = false;
  colorSelectedMail: any = 'black';
  colorSelectedMdp: any = 'black';
  colorSelectedUser: any = 'black';
 
  constructor(private route: Router) {}

  ngOnInit(): void {
   
  }

  updateMail() {
    this.colorSelectedMail = 'blue';
    this.afficheBlocMail = true;
  }

  noUpdateMail() {
    this.colorSelectedMail = 'black';
    this.mail = '@gmail.com';
    this.afficheBlocMail = false;
  }

  updatemdp() {
    this.colorSelectedMdp = 'blue';
    this.afficheBlocMdp = true;
  }
  noUpdateMdp() {
    this.colorSelectedMdp = 'black';
    this.mdp = '';
    this.confmdp = '';
    this.afficheBlocMdp = false;
  }
  deleteUser() {
    this.colorSelectedUser = 'blue';
    this.afficheBlocDeleteUser = true;
  }
  nodeleteUser() {
    this.colorSelectedUser = 'black';
    this.afficheBlocDeleteUser = false;
    this.confirmdp = '';
  }
  colorConfirmation() {
    if (this.mdp == this.confmdp) {
      this.btnDisabledModifMdp = true;
      return 'green';
    } else {
      this.btnDisabledModifMdp = false;
      return 'red';
    }
  }
}
