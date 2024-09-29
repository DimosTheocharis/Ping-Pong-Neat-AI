import Genome from "../Genome/genome";
import BaseClass from "../baseClass";
import { Counter } from "../utils/counter";


class Species extends BaseClass {
    private members: Map<number, Genome>;
    private representative!: Genome; // the most central genome of the species. Has the minimum average distance

    /**
     * Creates a new species with the given {representative}. Includes the {representative} inside species' members.
     * @param key 
     * @param representative 
     */
    public constructor(key: number, representative: Genome) {
        super(key);
        
        this.members = new Map();
        this.members.set(representative._key, representative);
        this.representative = representative;
    }

    /*----------------------------------------Getters Methods----------------------------------------*/
    public get _representative(): Genome {
        return this.representative;
    }

    /*----------------------------------------Public Methods----------------------------------------*/

    /**
     * Adds the given genome to this species only if it doesn't already belongs to.
     */
    public includeGenome(genome: Genome) {
        console.assert(this.members.get(genome._key) == undefined, `The genome ${genome} already exists at species with id = ${this._key}`);
        this.members.set(genome._key, genome);
    }

    /**
     * Calculates the number of the genomes that the particular species is going to contain in the next generation.
     * The number of the genomes is proportional to the percentage of the fitness of the particular species to 
     * the total fitness.
     * @param totalFitness The total fitness of the whole population in the current generation
     * @param populationSize The total number of genomes that belong to the population.
     * @returns A float number. Should round up or down to the closer integer.
     */
    public computeNextGenerationTotalMembers(totalFitness: number, populationSize: number): number {
        console.assert(totalFitness != 0, "The total fitness is 0... Can't calculate the number of genomes.");

        const fitness: number = this.calculateSpeciesFitness();

        let totalMembers: number = fitness / totalFitness * populationSize;

        return totalMembers;
    }

    /**
     * @returns the number of the members that this spieces currently has
     */
    public getNumberOfMembers(): number {
        return this.members.size;
    }
    
    /**
     * Calculates the probability of a member-genome to be selected based on its fitness.
     * The probability is proportional to the ratio of genome fitness to total fitness
     * @returns A map whose keys are the keys of the genomes and values are their probability 
     * of selection (for reproductions)
     */
    public calculateProbabilities(): Map<number, number> {
        const probabilitiesMap: Map<number, number> = new Map();
        const totalFitness: number = this.calculateSpeciesFitness();

        console.assert(totalFitness != 0, "Total fitness is zero.");

        this.members.forEach((member: Genome, key: number) => {
            const probability: number = member._fitness / totalFitness;
            probabilitiesMap.set(key, probability);
        })

        return probabilitiesMap;
    }

    /**
     * Returns the member-genome which has the given {key}
     * @param key 
     * @returns 
     */
    public getMember(key: number): Genome | undefined {
        return this.members.get(key);
    }

    /*----------------------------------------Private Methods----------------------------------------*/

    /**
     * Calculates the sum of fitness of every genome in this species
     */
    private calculateSpeciesFitness(): number {
        let fitness: number = 0;

        this.members.forEach((member: Genome, key: number) => {
            fitness += member._fitness;
        });

        return fitness;
    }
}

/**
 * A class that holds all the species of the current generation
 */
class SpeciesSet {
    public speciesMap: Map<number, Species>;
    private genomicDistanceThreshold: number = 2;

    private speciesCounter: Counter;

    public constructor() {
        this.speciesMap = new Map();
        this.speciesCounter = new Counter();
    }

    /**
     * Assigns the new given population to species. 
     */
    public speciate(population: Genome[]) {
        
        population.forEach((genome: Genome) => {
            let speciated: boolean = false; // Whether or not the genome was eventually included in some species

            this.speciesMap.forEach((species: Species, key: number) => {
                if (!speciated) {
                    // For each species, compute the genomic distance of the current genome with the representative
                    const distance = species._representative.distance(genome);

                    if (distance < this.genomicDistanceThreshold) {
                        // The current genome is similar to the representative. Place it in the current species
                        species.includeGenome(genome);
                        speciated = true;
                    }
                }
            })

            if (!speciated) {
                // The genome didn't fit anywhere. Create a new species and place it there.
                const key: number = this.speciesCounter.next();
                const newSpecies: Species = new Species(key, genome);

                this.speciesMap.set(key, newSpecies);
            }
        })
    }
}

export { SpeciesSet, Species };