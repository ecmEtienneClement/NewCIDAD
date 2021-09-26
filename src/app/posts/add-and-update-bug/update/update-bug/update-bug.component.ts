import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BugService } from 'src/app/Mes_Services/bug.Service';
import { BugModel } from 'src/app/Models/bug';

@Component({
  selector: 'app-update-bug',
  templateUrl: './update-bug.component.html',
  styleUrls: ['./update-bug.component.css'],
})
export class UpdateBugComponent implements OnInit {
  bugCmp: any = new BugModel('', '', '', '', '', '', 0, Date.now(),['']);
  myForm: FormGroup;
  indice: number;
  //Valeure des champs par defaut ...
  language = this.bugCmp.language;
  titre = this.bugCmp.titre;
  details = this.bugCmp.details;
  etat = this.bugCmp.etat;

  constructor(
    private extra: ActivatedRoute,
    private formBuilder: FormBuilder,
    private serviceBug: BugService,
    private route: Router
  ) {}

  ngOnInit(): void {
    //Initialisation du Formulaire
    //TODO
    this.initForm();
    //Recuperation de l'indice
    //TODO
    this.indice = this.extra.snapshot.params['indice'];
    //Recuperation du TbBug pour le  modifier
    this.serviceBug
      .recupbaseSoloBug(this.indice)
      .then((data_value) => {
        this.bugCmp = data_value;
        this.language = this.bugCmp.language;
        this.titre = this.bugCmp.titre;
        this.details = this.bugCmp.details;
        this.etat = this.bugCmp.etat;
      })
      .catch((error) => {
        alert('Une erreur est survenue update Bug ...!');
        //console.log('Une erreur est survenue update Bug ==>' + error);
      });
    //Modifcation du Bug ....
  }

  initForm() {
    this.myForm = this.formBuilder.group({
      language: ['', Validators.required],
      titre: ['', Validators.required],
      details: ['', Validators.required],
    });
  }
  onSubmitForm() {
    const valueForm = this.myForm.value;
    let language = valueForm['language'];
    let titre = valueForm['titre'];
    let details = valueForm['details'];

    this.serviceBug.updatBug(
      this.bugCmp,
      this.indice,
      language,
      titre,
      details,
      this.etat,
      ['']
    );
    this.route.navigate(['/ecm']);
  }
}
