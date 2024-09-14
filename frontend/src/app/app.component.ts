import { Component } from '@angular/core';
import Genome from "../../../Neat/Genome/genome";
import Population from "../../../Neat/population";

const population: Population = new Population(5);

population.initPopulation();



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
