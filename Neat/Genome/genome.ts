import ConnectionGene from "../ConnectionGene/connectionGene";
import { NodeGeneType } from "../NodeGene/nodeGene.types";
import { Counter } from "../utils";
import BaseClass from "../baseClass";
import NodeGene from "../NodeGene/NodeGene";

/**
 * Represents a neural network that consists of Nodes (neurons) and Connections (synapses).
 */
class Genome extends BaseClass {
    private nodes!: Map<number, NodeGene>;
    private connections!: Map<number, ConnectionGene>;

    private nodeKeyCounter: Counter;
    private connectionKeyCounter: Counter; 

    static C1: number = 1; // The coefficient for the excess nodes
    static C2: number = 1; // The coefficient for the disjoint nodes
    static C3: number = 0.4; // The coefficient for the weight difference
    

    public constructor(key: number, totalInputNodes: number, totalOutputNodes: number) {
        super(key);

        this.nodeKeyCounter = new Counter();
        this.connectionKeyCounter = new Counter();
        this.nodes = new Map();
        this.connections = new Map();

        this.initializeGenome(totalInputNodes, totalOutputNodes);
    }

    /*----------------------------------------Getters Methods----------------------------------------*/
    public get _connections(): Map<number, ConnectionGene> {
        return this.connections;
    }

    /*----------------------------------------Setter Methods ----------------------------------------*/
    public set _nodes(nodes: Map<number, NodeGene>) {
        this.nodes = nodes;
    }

    public set _connections(connections: Map<number, ConnectionGene>) {
        this.connections = connections;
    }

    /*----------------------------------------Public Methods----------------------------------------*/

    /**
     * Calculates and returns the genomic distance between this genome and the given genome
     * distance = (c1 * E) / N + (c2 * D) / N + c3 * W
     * where:
     * E = the number of excess genes
     * D = the number of disjoint genes
     * W = the average weight difference of matching genes
     * N = the number of connection genes (of the genome with the most connection genes)
     */
    public distance(genome: Genome): number {
        let genomicDistance: number = 0;

        const {disjointGenes, excessGenes} = this.findDisjointAndExcessGenes(genome); 
        const matchingGeneKeys: number[] = this.findMatchingGeneKeys(genome);


        const E: number = excessGenes.length;
        const D: number = disjointGenes.length;
        const N: number = Math.max(this._connections.size, genome._connections.size);

        let totalWeightDifference: number = 0;
        matchingGeneKeys.forEach((key: number) => {
            totalWeightDifference += Math.abs(this._connections.get(key)!._weight - genome._connections.get(key)!._weight);
        })

        const W: number = matchingGeneKeys.length > 0 ? totalWeightDifference / matchingGeneKeys.length : 0;

        if (N > 0) {
            genomicDistance = (Genome.C1 * E) / N + (Genome.C2 * D) / N + Genome.C3 * W;
        } else {
            genomicDistance = Genome.C3 * W;
        }
 
        return genomicDistance;
    }


    /*----------------------------------------Private Methods----------------------------------------*/

    /**
     * Initializes the genome, setting up all the necessary structure.
     * @param totalInputNodes 
     * @param totalOutputNodes 
     */
    private initializeGenome(totalInputNodes: number, totalOutputNodes: number): void {
        this.initializeNodes(totalInputNodes, totalOutputNodes);
        this.initializeConnections();
    }

    /**
     * Creates the input and output nodes that the network will initially have
     * @param totalInputNodes 
     * @param totalOutputNodes 
     */
    private initializeNodes(totalInputNodes: number, totalOutputNodes: number) {
        // Creation of input nodes
        for (let i = 0; i < totalInputNodes; i++) {
            const key: number = this.nodeKeyCounter.next();
            const newNode: NodeGene = new NodeGene(key, NodeGeneType.INPUT);

            this.nodes.set(key, newNode);
        }

        // Creation of output nodes
        for (let i = 0; i < totalOutputNodes; i++) {
            const key: number = this.nodeKeyCounter.next();
            const newNode: NodeGene = new NodeGene(key, NodeGeneType.OUTPUT);

            this.nodes.set(key, newNode);
        }
    }

    /**
     * Creates the connections that the network will initially have
     * Default: Fully connected network
     */
    private initializeConnections(): void {
        const inputNodes: NodeGene[] = this.getNodes(NodeGeneType.INPUT);
        const outputNodes: NodeGene[] = this.getNodes(NodeGeneType.OUTPUT);

        inputNodes.forEach((inputNode: NodeGene) => {
            outputNodes.forEach((outputNode: NodeGene) => {
                const key: number = this.connectionKeyCounter.next();
                const newConnection: ConnectionGene = new ConnectionGene(key, inputNode, outputNode);

                this.connections.set(key, newConnection);
            })
        })
    }


    /**
     * Returns all the network's nodes of the given type.
     */
    private getNodes(type: NodeGeneType): NodeGene[] {
        const nodes: NodeGene[] = [];

        this.nodes.forEach((node: NodeGene) => {
            if (node.type == type) {
                nodes.push(node);
            }
        })

        return nodes;
    }

    /**
     * Finds the disjoint and the excess connections genes. Both type of connection genes
     * are present in one genome but not at the other. However,
     * Disjoint genes: the keys of these genes must exist inside the range of the smallest gene
     * Excess genes: the keys of these genes must exist outside the range of the smallest gene
     */
    private findDisjointAndExcessGenes(genome: Genome): {disjointGenes: ConnectionGene[], excessGenes: ConnectionGene[]} {
        const disjointGenes: ConnectionGene[] = [];
        const excessGenes: ConnectionGene[] = [];

        let smallGenome: Genome;
        let bigGenome: Genome; // Its biggest key is greater than smallGenome's biggest key

        if (this.isMoreAdvancedThan(genome)) {
            bigGenome = this;
            smallGenome = genome;
        } else {
            bigGenome = genome;
            smallGenome = this;
        }

        const minimumConnectionGenes: number = smallGenome._connections.size;

        // Find the disjoint connection genes that belong to the small genome
        smallGenome._connections.forEach((gene: ConnectionGene, key: number) => {
            if (!bigGenome._connections.has(key)) {
                // The current key is not present in the keys of bigGenome
                disjointGenes.push(gene);
            }
        })


        // Find the disjoint connection genes that belong to the big genome
        bigGenome._connections.forEach((gene: ConnectionGene, key: number) => {
            if (!smallGenome._connections.has(key)) {
                // The current key is not present in the keys of smallGenome
                if (key <= minimumConnectionGenes) {
                    // Disjoint gene
                    disjointGenes.push(gene);
                } {
                    // Excess gene
                    excessGenes.push(gene);
                }
            }
        })

        

        return {
            disjointGenes: disjointGenes,
            excessGenes: excessGenes
        }
    }

    /**
     * Finds the keys of the connections genes that are present in both genomes
     */
    private findMatchingGeneKeys(genome: Genome): number[] {
        const matchingGeneKeys: number[] = [];

        this._connections.forEach((gene: ConnectionGene, key: number) => {
            if (genome._connections.has(key)) {
                matchingGeneKeys.push(key);
            }
        })

        return matchingGeneKeys;
    }

    /**
     * Returns true if the biggest connection-key of the current genome is bigger than
     * the corresponding of the genome in the parameters
     */
    private isMoreAdvancedThan(genome: Genome): boolean {
        // Find the biggest key of the connections of each genome among the current genome and the parameter genome
        const a: number = Math.max(...this._connections.keys());
        const b: number = Math.max(...genome._connections.keys());

        return a >= b;
    }
}

export default Genome;