import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BugService } from 'src/app/Mes_Services/bug.Service';


@Component({
  selector: 'app-enregistre',
  templateUrl: './enregistre.component.html',
  styleUrls: ['./enregistre.component.css'],
})
export class EnregistreComponent implements OnInit {
  myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private serviceBug: BugService,
    private route: Router
  ) {}

  ngOnInit(): void {
  

    this.initForm();
  }

  initForm() {
    this.myForm = this.formBuilder.group({
      language: ['', Validators.required],
      titre: ['', Validators.required],
      details: ['', Validators.required],
      etat: ['', Validators.required],
    });
  }
  onSubmitForm() {
    const valueForm = this.myForm.value;
    let language = valueForm['language'];
    let titre = valueForm['titre'];
    let details = valueForm['details'];
    let etat = valueForm['etat'];

    this.serviceBug.createNewBug(language, titre, details, etat);
    this.route.navigate(['/ecm']);
  }
}
