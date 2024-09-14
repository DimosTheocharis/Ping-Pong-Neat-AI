import Genome from "../Genome/genome";
import BaseClass from "../baseClass";


class Species extends BaseClass {
    private members: Map<number, Genome>;
    private representative: Genome; // the most central genome of the species. Has the minimum average distance

    public constructor(key: number) {
        super(key);
        
        this.members = new Map();
    }

    /**
     * Adds the given genome to this species only if it doesn't already belongs to.
     * @param genome 
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
    private species: Species[];

    public constructor() {

    }

    /**
     * Assigns the new given population to species.
     */
    public speciate(population: Genome[]) {
        const newMembers: {number: Genome[]}[] = [];
        const representatives: {number: Genome}[] = [];
        
        population.forEach((genome: Genome) => {
            let speciated: boolean = false; // Whether or not the genome was eventually included in some species

            for (let i = 0; i < this.species.length && !speciated; i++) {
                const currentSpecies: Species = this.species[i];
                
            }
        })
    }

}