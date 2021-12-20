import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
@Component({
  selector: 'app-avant-inscription',
  templateUrl: './avant-inscription.component.html',
  styleUrls: ['./avant-inscription.component.css'],
})
export class AvantInscriptionComponent implements OnInit {
  Movies = ['B', 'M', 'C', 'F', 'E'];
  constructor(private route: Router) {}

  ngOnInit(): void {}


}
