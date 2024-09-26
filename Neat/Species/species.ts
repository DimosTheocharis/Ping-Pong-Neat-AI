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

        // Compute the sum of the fitness of all genomes that belong to the particular species
        let fitness: number = 0;
        this.members.forEach((member: Genome, key: number) => {
            fitness += member._fitness;
        });

        let totalMembers: number = fitness / totalFitness * populationSize;

        return totalMembers;
    }

    public getNumberOfMembers(): number {
        return this.members.size;
    }
}

/**
 * A class that holds all the species of the current generation
 */
class SpeciesSet {
    private speciesMap: Map<number, Species>;
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