import Genome from "./Genome/genome";
import InnovationDatabase from "./InnovationDatabase/innovationDatabase";
import Reproduction from "./Reproduction/reproduction";
import { SpeciesSet } from "./Species/species";
import { Counter } from "./utils/counter";


/**
 * Represents the population of the genomes
 */
class Population {
    public population: Map<number, Genome>;
    private populationSize: number;
    private generationCount: number;
    public genomeCounter: Counter;

    private totalFitness: number | undefined = undefined;

    private reproductionSystem: Reproduction;
    private speciesSystem: SpeciesSet;
    private innovationDatabase: InnovationDatabase;


    public constructor(populationSize: number) {
        this.population = new Map();
        this.populationSize = populationSize;
        this.generationCount = 0;
        this.genomeCounter = new Counter();
        this.reproductionSystem = new Reproduction();
        this.speciesSystem = new SpeciesSet();
        this.innovationDatabase = new InnovationDatabase(3, 4);

        this.initPopulation();
    }

    /*----------------------------------------Public Methods----------------------------------------*/

    public get _populationSize(): number {
        return this.populationSize;
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


    public run(): void {
        // Step 2: Speciating
        this.speciesSystem.speciate(Array.from(this.population.values()));

        // Step 3: Fitness Evaluation
        
        
        // Step 4: Fitness Sharing
        this.speciesSystem.fitnessSharing();


        // Step 5: Reproduction
        const newPopulation: Genome[] = this.reproductionSystem.reproduction(
            this.speciesSystem, this.getTotalFitness(), this.populationSize, this.genomeCounter
        );

        // Step 6: Mutations
        newPopulation.forEach((newMember: Genome) => {
            newMember.mutate(this.innovationDatabase);
        })

        // Step 7: Population replacement
        this.populationReplacement(newPopulation);
    }

    /*----------------------------------------Private Methods----------------------------------------*/

    /**
     * Initializes the population of genomes with minimal structure (only input and output nodes)
     */
    private initPopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            const key: number = this.genomeCounter.next();
            const newGenome: Genome = new Genome(key, 3, 1);
            newGenome._fitness = Math.random() * 100;

            this.population.set(key, newGenome);
        }
    }

    /**
     * Replaces the old population of the genomes with the new one.
     * It deletes old previous genomes and the species they belong to.
     * Then it assigns the new population
     */
    private populationReplacement(newPopulation: Genome[]): void {
        this.population.clear();
        this.speciesSystem.clearData();

        newPopulation.forEach((genome: Genome, key: number) => {
            this.population.set(key, genome);
        })
    }
}

export default Population;