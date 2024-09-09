import { Component } from '@angular/core';
import Genome from "../../../Neat/Genome/genome";

const myFirstGenome: Genome = new Genome(1, 3, 1);

console.log(myFirstGenome.nodes);
console.log(myFirstGenome.connections);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
