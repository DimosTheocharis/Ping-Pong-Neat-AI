import { Component } from '@angular/core';
import Genome from "../../../Neat/Genome/genome";
import Population from "../../../Neat/population";
import InnovationDatabase from '../../../Neat/InnovationDatabase/innovationDatabase';

const population: Population = new Population(5);

const innovationDatabase: InnovationDatabase = new InnovationDatabase(3, 4);

population.initPopulation();

population.population.forEach((genome: Genome) => {
  genome.mutate(innovationDatabase);
})



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
