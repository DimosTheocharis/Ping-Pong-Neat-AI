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


describe("calculateProbabilities function", () => {
    it("Should correctly computes the probability of selection for every genome in a particular species.", () => {
        // Create genomes
        const genome1: Genome = new Genome(1, 0, 0);
        const genome2: Genome = new Genome(2, 0, 0);
        const genome3: Genome = new Genome(3, 0, 0);
        const genome4: Genome = new Genome(4, 0, 0);
        const genome5: Genome = new Genome(5, 0, 0);

        // Set fitnesses
        genome1._fitness = 12.7;
        genome2._fitness = 23.9;
        genome3._fitness = 5.8;
        genome4._fitness = 31.6;
        genome5._fitness = 18.4;

        // Create species and add genomes to its member list
        const species: Species = new Species(1, genome1);
        species.includeGenome(genome2);
        species.includeGenome(genome3);
        species.includeGenome(genome4);
        species.includeGenome(genome5);

        // Run function to get result
        const probabilitiesMap: Map<number, number> = species.calculateProbabilities();

        expect(probabilitiesMap.get(1)).toBeCloseTo(0.14);
        expect(probabilitiesMap.get(2)).toBeCloseTo(0.26);
        expect(probabilitiesMap.get(3)).toBeCloseTo(0.06);
        expect(probabilitiesMap.get(4)).toBeCloseTo(0.34);
        expect(probabilitiesMap.get(5)).toBeCloseTo(0.2);
    })
})