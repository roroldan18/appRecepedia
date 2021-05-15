import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-receta-list',
  templateUrl: './receta-list.component.html',
  styleUrls: ['./receta-list.component.css']
})
export class RecetaListComponent implements OnInit {

  @Input() recetas = [];

  constructor() { }

  ngOnInit(): void {
  }

}
