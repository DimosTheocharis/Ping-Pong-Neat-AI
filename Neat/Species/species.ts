import Genome from "../Genome/genome";
import BaseClass from "../baseClass";
import { Counter } from "../utils";


class Species extends BaseClass {
    private members: Map<number, Genome>;
    private representative!: Genome; // the most central genome of the species. Has the minimum average distance

    public constructor(key: number, representative: Genome) {
        super(key);
        
        this.members = new Map();
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
            console.log("Current genome:");
            console.log(genome);
            let speciated: boolean = false; // Whether or not the genome was eventually included in some species

            this.speciesMap.forEach((species: Species, key: number) => {
                if (!speciated) {
                    // For each species, compute the genomic distance of the current genome with the representative
                    const distance = species._representative.distance(genome);

                    if (distance < this.genomicDistanceThreshold) {
                        // The current genome is similar to the representative. Place it in the current species
                        species.includeGenome(genome);
                        speciated = true;

                        console.log("The genome placed in the current species:");
                        console.log(distance);
                        console.log(species);
                    }
                }
            })

            if (!speciated) {
                // The genome didn't fit anywhere. Create a new species and place it there.
                const key: number = this.speciesCounter.next();
                const newSpecies: Species = new Species(key, genome);

                this.speciesMap.set(key, newSpecies);

                console.log("New species created for the genome:");
                console.log(newSpecies);
            }
        })
    }

}

export default SpeciesSet;