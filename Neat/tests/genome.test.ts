import Genome from "../Genome/genome";
import NodeGene from "../NodeGene/NodeGene";
import ConnectionGene from "../ConnectionGene/connectionGene";
import { NodeGeneType } from "../NodeGene/nodeGene.types";

describe("Distance function", () => {
    it("Should compute the genomic distance of 2 nodes correctly", () => {
        const genomeA: Genome = new Genome(1, 2, 1);
        const genomeB: Genome = new Genome(2, 3, 1);

        const nodeGeneMapA: Map<number, NodeGene> = new Map();
        const nodeGeneMapB: Map<number, NodeGene> = new Map();
        const connectionGeneMapA: Map<number, ConnectionGene> = new Map();
        const connectionGeneMapB: Map<number, ConnectionGene> = new Map();

        nodeGeneMapA.set(1, new NodeGene(1, NodeGeneType.INPUT));
        nodeGeneMapA.set(2, new NodeGene(2, NodeGeneType.INPUT));
        nodeGeneMapA.set(3, new NodeGene(3, NodeGeneType.OUTPUT));

        connectionGeneMapA.set(1, new ConnectionGene(1, nodeGeneMapA.get(1)!, nodeGeneMapA.get(3)!, 0.5));
        connectionGeneMapA.set(2, new ConnectionGene(2, nodeGeneMapA.get(2)!, nodeGeneMapA.get(3)!, -1.2));
        connectionGeneMapA.set(3, new ConnectionGene(3, nodeGeneMapA.get(1)!, nodeGeneMapA.get(2)!, 0.7));

        nodeGeneMapB.set(1, new NodeGene(1, NodeGeneType.INPUT));
        nodeGeneMapB.set(2, new NodeGene(2, NodeGeneType.INPUT));
        nodeGeneMapB.set(3, new NodeGene(3, NodeGeneType.INPUT));
        nodeGeneMapB.set(4, new NodeGene(4, NodeGeneType.OUTPUT));

        connectionGeneMapB.set(1, new ConnectionGene(1, nodeGeneMapB.get(1)!, nodeGeneMapB.get(3)!, 0.6));
        connectionGeneMapB.set(2, new ConnectionGene(2, nodeGeneMapB.get(2)!, nodeGeneMapB.get(3)!, -1));
        connectionGeneMapB.set(3, new ConnectionGene(3, nodeGeneMapB.get(1)!, nodeGeneMapB.get(2)!, 0.7));
        connectionGeneMapB.set(4, new ConnectionGene(4, nodeGeneMapB.get(2)!, nodeGeneMapB.get(4)!, 0.9));
        connectionGeneMapB.set(5, new ConnectionGene(5, nodeGeneMapB.get(4)!, nodeGeneMapB.get(3)!, 1));

        genomeA._nodes = nodeGeneMapA;
        genomeA._connections = connectionGeneMapA;
        genomeB._nodes = nodeGeneMapB;
        genomeB._connections = connectionGeneMapB;


        expect(genomeA.distance(genomeB)).toBeCloseTo(0.44)
    })
})