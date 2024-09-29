import { Component } from '@angular/core';
import Genome from "../../../Neat/Genome/genome";
import Population from "../../../Neat/population";
import InnovationDatabase from '../../../Neat/InnovationDatabase/innovationDatabase';
import Reproduction from "../../../Neat/Reproduction/reproduction";
import { Logger } from '../../../Neat/Logger/logger';

const populationSystem: Population = new Population(5);

populationSystem.run()

// newPopulation.forEach((genome: Genome) => {
//   Logger.logMessages([genome.toString()])
// })

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
