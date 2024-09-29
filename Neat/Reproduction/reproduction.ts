import ConnectionGene from "../ConnectionGene/connectionGene";
import Genome from "../Genome/genome";
import { Species, SpeciesSet } from "../Species/species";
import { Counter } from "../utils/counter";
import Roulette from "../utils/roulette";

/**
 * Handles the reproduction of the population, that generates the next generation of genomes.
 */
class Reproduction {

    public constructor() {}

    /*----------------------------------------Public Methods----------------------------------------*/
    /**
     * Combines the two given genomes (parents) and generate a new genome (offspring).
     * 1. The disjoint genes are inherited from the most fit parent
     * 2. The excess genes are only inherited if the most fit parent has bigger keys than the biggest key
     * of the other parent. 
     * 3. The matching genes are randomly inherited from both parents with 75% probability of being inherited
     * from the fittest parent and 25% from the other parent.
     * 4. If the parents have equal fitnesses, then the matching connections are randomly inherited from both parents
     * with 50% probability of being inherited from each one. All the disjoint and excess genes are inherited.
     * @param genomeA 
     * @param genomeB 
     */
    public static crossover(genomeA: Genome, genomeB: Genome, key: number): Genome {
        let dominant: Genome; // The most fit parent
        let submissive: Genome; // The other parent
        let equalFitnesses: boolean = false;

        if (genomeA._fitness >= genomeB._fitness) {
            dominant = genomeA;
            submissive = genomeB;
            equalFitnesses = genomeA._fitness == genomeB._fitness;
        } else {
            dominant = genomeB;
            submissive = genomeA;
        }

        const offspringConnectionGenes: ConnectionGene[] = [];
        const dominantDisjointGenes: ConnectionGene[] = dominant.findDisjointGenes(submissive);         
        const matchingGeneKeys: number[] = dominant.findMatchingGeneKeys(submissive);

        if (equalFitnesses) {
            // Include all the disjoint genes of the first parent
            dominantDisjointGenes.forEach((disjointGene: ConnectionGene) => {
                offspringConnectionGenes.push(disjointGene);
            })

            // Include all the disjoint genes of the second parent
            const submissiveDisjointGenes: ConnectionGene[] = submissive.findDisjointGenes(dominant);
            submissiveDisjointGenes.forEach((disjointGene: ConnectionGene) => {
                offspringConnectionGenes.push(disjointGene);
            })

            let excessGenes: ConnectionGene[];

            // Include all the excess genes of the most advanced parent
            if (dominant.isMoreAdvancedThan(submissive)) {
                excessGenes = dominant.findExcessGenes(submissive);
            } else {
                excessGenes = submissive.findExcessGenes(dominant);
            }

            excessGenes.forEach((excessGenes: ConnectionGene) => {
                offspringConnectionGenes.push(excessGenes);
            })

            // Include the matching connections
            matchingGeneKeys.forEach((key: number) => {
                if (Math.random() <= 0.5) {
                    offspringConnectionGenes.push(dominant.getConnection(key)!);
                } else {
                    offspringConnectionGenes.push(submissive.getConnection(key)!);
                }
            })


        } else {
            // Include all the disjoint genes of the dominant (most fit) parent
            dominantDisjointGenes.forEach((disjointGene: ConnectionGene) => {
                offspringConnectionGenes.push(disjointGene);
            })

            if (dominant.isMoreAdvancedThan(submissive)) {
                // Include all the excess genes of the dominant (most fit) parent and the more advanced one
                const dominantExcessGenes: ConnectionGene[] = dominant.findExcessGenes(submissive);
                
                dominantExcessGenes.forEach((excessGenes: ConnectionGene) => {
                    offspringConnectionGenes.push(excessGenes);
                })
            }

            // Include the matching connections
            matchingGeneKeys.forEach((key: number) => {
                if (Math.random() <= 0.75) {
                    offspringConnectionGenes.push(dominant.getConnection(key)!);
                } else {
                    offspringConnectionGenes.push(submissive.getConnection(key)!);
                }
            })
        }

        const offspring: Genome = Genome.createGenomeFromConnections(offspringConnectionGenes, key);
        return offspring;
    } 

    /**
     * Generates the population of the next generation by crossovering the members of the current generation.
     * 1. Finds the number of the members of a species for the new generation.
     * 2. Randomly (but based on probability) picks two genomes for the reproduction
     * 3. Crossovers the two genomes and generates their offspring
     * 4. Repeats as many times as the number of current species' members suggests
     * 5. Repeats for every species
     * @param speciesSet -> contains all the species of the current population
     * @param totalFitness -> the sum of fitness of every genome in the current generation
     * @param populationSize -> the total number of genomes in the population
     * @param genomeCounter -> The counter that assigns incrementing node ids (keys) to genomes
     */
    public reproduction(speciesSet: SpeciesSet, totalFitness: number, populationSize: number, genomeCounter: Counter): Genome[] {
        const newPopulation: Genome[] = [];

        // A variable to keep track of the difference between the approximation of the number of a species' new members
        // and the real number
        let balance: number = 0;

        speciesSet.speciesMap.forEach((species: Species, key: number) => {
            let nextGenerationTotalMembersFloat: number = species.computeNextGenerationTotalMembers(totalFitness, populationSize);
            nextGenerationTotalMembersFloat += balance;

            const nextGenerationTotalMembers: number = Math.round(nextGenerationTotalMembersFloat);
            balance = nextGenerationTotalMembersFloat - nextGenerationTotalMembers;

            const probabilities: Map<number, number> = species.calculateProbabilities();
            const roulette: Roulette = new Roulette(probabilities);

            // Generate {nextGenerationTotalMembers} in total offsprings by crossovering random parents
            let parent1: Genome;
            let parent2: Genome;
            let offspring: Genome;
            for (let i = 0; i < nextGenerationTotalMembers; i++) {
                parent1 = species.getMember(roulette.selectRandomItem())!;
                parent2 = species.getMember(roulette.selectRandomItem())!;
                offspring = Reproduction.crossover(parent1, parent2, genomeCounter.next());

                newPopulation.push(offspring);
            }
        })

        return newPopulation;
    }
}

export default Reproduction;