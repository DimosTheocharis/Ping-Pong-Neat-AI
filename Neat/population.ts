import NodeGene from "./NodeGene/NodeGene";


/**
 * Represents the population of the genomes
 */
class Population {
    private populationSize: number;
    private generationCount: number;
    private population: NodeGene[];

    public constructor(populationSize: number) {
        this.populationSize = populationSize;

        this.generationCount = 0;
    }

    /**
     * Initializes the population of genomes with minimal structure (only input and output nodes)
     */
    public initPopulation() {
        
    }


}