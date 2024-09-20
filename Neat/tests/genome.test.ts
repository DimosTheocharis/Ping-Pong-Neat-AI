import Genome from "../Genome/genome";
import NodeGene from "../NodeGene/nodeGene";
import ConnectionGene from "../ConnectionGene/connectionGene";
import { NodeGeneType } from "../NodeGene/nodeGene.types";
import InnovationDatabase from "../InnovationDatabase/innovationDatabase";
import { AddNodeMutation } from "../InnovationDatabase/innovationDatabase.types";

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


        expect(genomeA.distance(genomeB)).toBeCloseTo(0.44);
    })
})


describe("addNodeMutation function", () => {
    it("Should add a new node somewhere in the network. The mutation has not happened before.", () => {
        const inputNodes: number = 2;
        const outputNodes: number = 1;
        const totalInitialNodes: number = inputNodes + outputNodes;
        const totalInitialConnections: number = inputNodes * outputNodes;

        const myGenome: Genome = new Genome(1, inputNodes, outputNodes);

        // Initialize the innovation database 
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(totalInitialConnections, totalInitialNodes);

        myGenome.addNodeMutation(innovationDatabase);

        expect(Reflect.get(innovationDatabase, "addNodeMutations").length).toBe(1);
        expect(myGenome._nodes.size).toBe(totalInitialNodes + 1);
        expect(myGenome._connections.size).toBe(totalInitialConnections + 2);

        // Find the addNode mutation
        const addNodeMutation: AddNodeMutation = Array.from<AddNodeMutation>(Reflect.get(innovationDatabase, "addNodeMutations").values())[0];

        // There should be one exactly disabled connection
        expect(Array.from(myGenome._connections.values()).filter((value: ConnectionGene) => value._activated == false).length).toBe(1);

        // Find the disabled connection
        const disabledConnection: ConnectionGene = Array.from(myGenome._connections.values()).find((value: ConnectionGene) => value._activated == false)!;

        expect(addNodeMutation.innovationNumberA).toBe(totalInitialConnections + 1);
        expect(addNodeMutation.innovationNumberB).toBe(totalInitialConnections + 2);
        expect(addNodeMutation.nodeFrom).toBe(disabledConnection._nodeFrom.key);
        expect(addNodeMutation.nodeTo).toBe(disabledConnection._nodeTo.key);
        expect(addNodeMutation.nodeID).toBe(totalInitialNodes + 1);
    })

    it("Should add a new node somewhere in the network. The mutation has happened before.", () => {
        const inputNodes: number = 2;
        const outputNodes: number = 1;
        const totalInitialNodes: number = inputNodes + outputNodes;
        const totalInitialConnections: number = inputNodes * outputNodes;

        const myGenome: Genome = new Genome(1, inputNodes, outputNodes);

        // Initialize the innovation database 
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(totalInitialConnections, totalInitialNodes);

        // In order to test this scenario, i will consider that both of the 2 initial connections have been splitted by a addNode mutation.
        // As a result, the connection that will be randomly selected, will already have been mutated for sure.

        const addNodeMutationA: AddNodeMutation = {
            id: 1,
            nodeFrom: 1,
            nodeTo: 3,
            innovationNumberA: totalInitialConnections + 1,
            innovationNumberB: totalInitialConnections + 2,
            nodeID: totalInitialNodes + 1
        }

        const addNodeMutationB: AddNodeMutation = {
            id: 2,
            nodeFrom: 2,
            nodeTo: 3,
            innovationNumberA: totalInitialConnections + 3,
            innovationNumberB: totalInitialConnections + 4,
            nodeID: totalInitialNodes + 2
        }

        // Add the 2 addNode mutations to the innovation database
        Reflect.set(innovationDatabase, "addNodeMutations", [addNodeMutationA, addNodeMutationB]);

        myGenome.addNodeMutation(innovationDatabase);

        expect(Reflect.get(innovationDatabase, "addNodeMutations").length).toBe(2);
        expect(myGenome._nodes.size).toBe(totalInitialNodes + 1);
        expect(myGenome._connections.size).toBe(totalInitialConnections + 2);

        // There should be one exactly disabled connection
        expect(Array.from(myGenome._connections.values()).filter((value: ConnectionGene) => value._activated == false).length).toBe(1);

        // Find the disabled connection
        const disabledConnection: ConnectionGene = Array.from(myGenome._connections.values()).find((value: ConnectionGene) => value._activated == false)!;

        // Find the addNode mutation
        const addNodeMutation: AddNodeMutation | undefined = Array.from<AddNodeMutation>(Reflect.get(innovationDatabase, "addNodeMutations").values()).find(
            (value: AddNodeMutation) => {
                return value.nodeFrom == disabledConnection._nodeFrom.key && value.nodeTo == disabledConnection._nodeTo.key;
            }
        );

        expect(addNodeMutation).toBeDefined();

        expect(addNodeMutation!.nodeFrom).toBe(disabledConnection._nodeFrom.key);
        expect(addNodeMutation!.nodeTo).toBe(disabledConnection._nodeTo.key);
        expect(addNodeMutation!.nodeID).toBe(totalInitialNodes + 1);
    })
})