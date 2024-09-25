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

    private totalFitness: number | undefined = undefined;

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

    /**
     * Sums up and returns the fitness of every genome of the current population
     */
    public getTotalFitness(): number {
        if (this.totalFitness) {
            return this.totalFitness;
        }

        let total: number = 0;
        this.population.forEach((genome: Genome, key: number) => {
            total += genome._fitness;
        });

        this.totalFitness = total;
        return this.totalFitness;
    }
}

export default Population;