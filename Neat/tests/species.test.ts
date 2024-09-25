import Genome from "../Genome/genome"
import { Species } from "../Species/species"

describe("includeGenome function", () => {
    it("Should add the genome in the species.", () => {
        const genomeA: Genome = new Genome(1, 3, 1);
        const genomeB: Genome = new Genome(2, 3, 1);

        const species: Species = new Species(1, genomeA);
        species.includeGenome(genomeB);

        expect(species.getNumberOfMembers()).toBe(2);
    })
})


describe("computeNextGenerationTotalMembers function", () => {
    it("Should correctly compute that the number of the members of a species with currently 2 genomes, among \
        97 at total, having fitnesses 100 and 123.7, where total fitness is 564.5, should be 38.4 members in \
        the next generation.", () => {
        const genomeA: Genome = new Genome(1, 3, 1);
        const genomeB: Genome = new Genome(2, 3, 1);

        genomeA._fitness = 100;
        genomeB._fitness = 123.7;

        const totalFitness: number = 564.5;
        const populationSize: number = 97;

        const species: Species = new Species(1, genomeA);
        species.includeGenome(genomeB);

        expect(species.computeNextGenerationTotalMembers(totalFitness, populationSize)).toBeCloseTo(38.4, 1);
    })
})