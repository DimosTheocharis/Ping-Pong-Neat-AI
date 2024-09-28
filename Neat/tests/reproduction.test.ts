import ConnectionGene from "../ConnectionGene/connectionGene";
import Genome from "../Genome/genome";
import NodeGene from "../NodeGene/nodeGene";
import { NodeGeneType } from "../NodeGene/nodeGene.types";
import Reproduction from "../Reproduction/reproduction";


describe("crossover function", () => {
    it("Should generate a new genome, with the correct number of nodes and connections", () => {
        const genomeA: Genome = new Genome(1, 0, 0);
        const genomeB: Genome = new Genome(2, 0, 0);

        // Nodes of genomeA
        const nodeA1: NodeGene = new NodeGene(1, NodeGeneType.INPUT);
        const nodeA2: NodeGene = new NodeGene(2, NodeGeneType.HIDDEN);
        const nodeA3: NodeGene = new NodeGene(3, NodeGeneType.HIDDEN);
        const nodeA4: NodeGene = new NodeGene(4, NodeGeneType.HIDDEN);

        // Connections of genomeA
        const connectionA1: ConnectionGene = new ConnectionGene(1, nodeA1, nodeA2, 0.5);
        const connectionA2: ConnectionGene = new ConnectionGene(2, nodeA1, nodeA3, 0.8);
        connectionA2._activated = false;
        const connectionA3: ConnectionGene = new ConnectionGene(3, nodeA2, nodeA3, 0.6);
        const connectionA4: ConnectionGene = new ConnectionGene(4, nodeA3, nodeA4, 0.9);

        // Include nodes and connections of genomeA
        genomeA.includeNode(nodeA1);
        genomeA.includeNode(nodeA2);
        genomeA.includeNode(nodeA3);
        genomeA.includeNode(nodeA4);
        genomeA.includeConnection(connectionA1);
        genomeA.includeConnection(connectionA2);
        genomeA.includeConnection(connectionA3);
        genomeA.includeConnection(connectionA4);

        // Nodes of genomeΒ
        const nodeB1: NodeGene = new NodeGene(1, NodeGeneType.INPUT);
        const nodeB2: NodeGene = new NodeGene(2, NodeGeneType.HIDDEN);
        const nodeB3: NodeGene = new NodeGene(3, NodeGeneType.HIDDEN);
        const nodeB4: NodeGene = new NodeGene(4, NodeGeneType.HIDDEN);
        const nodeB5: NodeGene = new NodeGene(5, NodeGeneType.OUTPUT);

        // Connections of genomeB
        const connectionB1: ConnectionGene = new ConnectionGene(1, nodeB1, nodeB2, 0.7);
        const connectionB2: ConnectionGene = new ConnectionGene(2, nodeB1, nodeB3, 0.9);
        const connectionB4: ConnectionGene = new ConnectionGene(4, nodeB3, nodeB4, 1.2);
        const connectionB5: ConnectionGene = new ConnectionGene(5, nodeB2, nodeB4, 1);
        const connectionB6: ConnectionGene = new ConnectionGene(6, nodeB4, nodeB5, 1.3);

        // Include nodes and connections of genomeB
        genomeB.includeNode(nodeB1);
        genomeB.includeNode(nodeB2);
        genomeB.includeNode(nodeB3);
        genomeB.includeNode(nodeB4);
        genomeB.includeNode(nodeB5);
        genomeB.includeConnection(connectionB1);
        genomeB.includeConnection(connectionB2);
        genomeB.includeConnection(connectionB4);
        genomeB.includeConnection(connectionB5);
        genomeB.includeConnection(connectionB6);

        // ------------------------------- TEST 1: GenomeA.fitness > GenomeB.fitness -------------------------------
        genomeA._fitness = 1.0;
        genomeB._fitness = 0.6;

        // Run functions to get results
        const offspring: Genome = Reproduction.crossover(genomeA, genomeB, 3);

        // Tests
        expect(offspring._nodes.size).toBe(4);
        expect(offspring._connections.size).toBe(4);
        expect(offspring.containsConnectionGene(connectionA1)).toBe(true);
        expect(offspring.containsConnectionGene(connectionB2)).toBe(true);
        expect(offspring.containsConnectionGene(connectionA3)).toBe(true);
        expect(offspring.containsConnectionGene(connectionB4)).toBe(true);
        expect(offspring.containsConnectionGene(connectionB5)).toBe(false);
        expect(offspring.containsConnectionGene(connectionB6)).toBe(false);

        // The connection 3, gets inherited from genomeA as disjoint, so the weight is known
        expect(offspring.getConnection(3)!._weight).toBe(0.6);




        // ------------------------------- TEST 2: GenomeA.fitness = GenomeB.fitness -------------------------------

        // Now repeat the process, but with genomes having equal fitnesses
        genomeA._fitness = 1;
        genomeB._fitness = 1;

        // Run functions to get results
        const offspring2: Genome = Reproduction.crossover(genomeA, genomeB, 4);

        // Tests
        expect(offspring2._nodes.size).toBe(5);
        expect(offspring2._connections.size).toBe(6);
        expect(offspring2.containsConnectionGene(connectionA1)).toBe(true);
        expect(offspring2.containsConnectionGene(connectionB2)).toBe(true);
        expect(offspring2.containsConnectionGene(connectionA3)).toBe(true);
        expect(offspring2.containsConnectionGene(connectionB4)).toBe(true);
        expect(offspring2.containsConnectionGene(connectionB5)).toBe(true);
        expect(offspring2.containsConnectionGene(connectionB6)).toBe(true);

        // The connection 3, gets inherited from genomeA as disjoint, so the weight is known
        expect(offspring2.getConnection(3)!._weight).toBe(0.6);

        // Same for connections 5,6 as excess
        expect(offspring2.getConnection(5)!._weight).toBe(1);
        expect(offspring2.getConnection(6)!._weight).toBe(1.3);





        // ------------------------------- TEST 3: GenomeA.fitness < GenomeB.fitness -------------------------------

        // Now repeat the process, but with genomes having equal fitnesses
        genomeA._fitness = 0.6;
        genomeB._fitness = 1;

        // Run functions to get results
        const offspring3: Genome = Reproduction.crossover(genomeA, genomeB, 5);

        // Tests
        expect(offspring3._nodes.size).toBe(5);
        expect(offspring3._connections.size).toBe(5);
        expect(offspring3.containsConnectionGene(connectionA1)).toBe(true);
        expect(offspring3.containsConnectionGene(connectionB2)).toBe(true);
        expect(offspring3.containsConnectionGene(connectionA3)).toBe(false);
        expect(offspring3.containsConnectionGene(connectionB4)).toBe(true);
        expect(offspring3.containsConnectionGene(connectionB5)).toBe(true);
        expect(offspring3.containsConnectionGene(connectionB6)).toBe(true);

        // The connection 5,6, get inherited from genomeB as disjoint, so the weight is known
        expect(offspring3.getConnection(5)!._weight).toBe(1);
        expect(offspring3.getConnection(6)!._weight).toBe(1.3);
    })
})