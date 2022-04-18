import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Affectation } from './affectation';
import { AffectationService } from './affectation.service';

@Component({
  selector: 'app-affectation',
  templateUrl: './affectation.component.html',
  styleUrls: ['./affectation.component.scss']
})
export class AffectationComponent implements OnInit {
  affectations: Affectation[] = [];

  constructor(private affectationService: AffectationService) { }

  ngOnInit(): void {
    this.getAffectations();
  }

  getAffectations():void {
    this.affectationService.getAffectations().subscribe(
      (response : Affectation[]) => {
        this.affectations = response;
    
      },
      (error :HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

}
