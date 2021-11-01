import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BugService } from 'src/app/Mes_Services/bug.Service';

@Component({
  selector: 'app-add-bug',
  templateUrl: './add-bug.component.html',
  styleUrls: ['./add-bug.component.css'],
})
export class AddBugComponent implements OnInit {
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
      codeBug: this.formBuilder.array([]),
    });
  }
  getCodeBug() {
    return this.myForm.get('codeBug') as FormArray;
  }
  onAddCodeBug() {
    let newCodeBug = this.formBuilder.control('', Validators.required);
    this.getCodeBug().push(newCodeBug);
  }
  onSubmitForm() {
    const valueForm = this.myForm.value;
    let language = valueForm['language'];
    let titre = valueForm['titre'];
    let details = valueForm['details'];
    let codeBug = valueForm['codeBug'] ? valueForm['codeBug'] : [];

    this.serviceBug.createNewBug(language, titre, details, codeBug);

    // this.notify.notifyNewBug();
    this.route.navigate(['/ecm']);
  }
}
