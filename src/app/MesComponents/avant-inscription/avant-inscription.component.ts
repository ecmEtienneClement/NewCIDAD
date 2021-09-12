import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Movies, event.previousIndex, event.currentIndex);
    if (this.Movies[1] == 'Morituri') {
      this.route.navigate(['/ecminscription']);
    }
  }
}
