import Genome from "./Genome/genome";
import SpeciesSet from "./Species/species";
import { Counter } from "./utils/counter";


/**
 * Represents the population of the genomes
 */
class Population {
    public population: Map<number, Genome>;
    private populationSize: number;
    private generationCount: number;
    private genomeCounter: Counter;

    private speciesSet: SpeciesSet;

    public constructor(populationSize: number) {
        this.population = new Map();
        this.populationSize = populationSize;
        this.generationCount = 0;
        this.genomeCounter = new Counter();

        this.speciesSet = new SpeciesSet();
    }

    /**
     * Initializes the population of genomes with minimal structure (only input and output nodes)
     */
    public initPopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            const key: number = this.genomeCounter.next();
            const newGenome: Genome = new Genome(key, 3, 1);

            this.population.set(key, newGenome);
        }

        this.speciesSet.speciate(Array.from(this.population.values()));
    }
}

export default Population;