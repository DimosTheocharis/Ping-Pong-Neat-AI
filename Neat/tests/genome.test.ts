import Genome from "../Genome/genome";
import NodeGene from "../NodeGene/nodeGene";
import ConnectionGene from "../ConnectionGene/connectionGene";
import { NodeGeneType } from "../NodeGene/nodeGene.types";
import InnovationDatabase from "../InnovationDatabase/innovationDatabase";
import { AddConnectionMutation, AddNodeMutation } from "../InnovationDatabase/innovationDatabase.types";

// In the scenarios where i use Genomes with 2 input nodes and one output node, based on the way that i have 
// built the nodes and the connections, the following apply:
// NodeId = 1 -> input
// NodeId = 2 -> input
// NodeId = 3 -> output
// InnovationNumber = 1 -> Connection (1, 3)
// InnovationNumber = 2 -> Connection (2, 3)

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

        // I expect that a new node has been created
        expect(myGenome._nodes.size).toBe(totalInitialNodes + 1);

        // I expect that two new connections has been created
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
    })
})



describe("addConnectionMutation function", () => {
    it("Should return false because the nodes 1 and 3 are already connected.", () => {
        const inputNodes: number = 2;
        const outputNodes: number = 1;
        const totalInitialNodes: number = inputNodes + outputNodes;
        const totalInitialConnections: number = inputNodes * outputNodes;

        const myGenome: Genome = new Genome(1, inputNodes, outputNodes);

        // Initialize the innovation database 
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(totalInitialConnections, totalInitialNodes);

        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        // Tell the Math.random function to return 0.3 and 0.9 in the first 2 calls. This way, because we have 3 nodes,
        // the first and third nodes will be selected for connection
        const randomSpy = jest.spyOn(Math, "random")
            .mockImplementationOnce(() => 0.3)
            .mockImplementationOnce(() => 0.9);

        
        const succesfullConnection: boolean = myGenome.addConnectionMutation(innovationDatabase);

        expect(succesfullConnection).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith("The nodes 1 and 3 are already connected.");

        consoleSpy.mockRestore();
        randomSpy.mockRestore();
    })

    it("Should return false because the nodes that are going to connect, (1, 1), are the same.", () => {
        const inputNodes: number = 2;
        const outputNodes: number = 1;
        const totalInitialNodes: number = inputNodes + outputNodes;
        const totalInitialConnections: number = inputNodes * outputNodes;

        const myGenome: Genome = new Genome(1, inputNodes, outputNodes);

        // Initialize the innovation database 
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(totalInitialConnections, totalInitialNodes);

        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        // Tell the Math.random function to return 0.3 and 0.3 in the first 2 calls. This way, because we have 3 nodes,
        // the first node will be selected both times for connection
        const randomSpy = jest.spyOn(Math, "random")
            .mockImplementationOnce(() => 0.3)
            .mockImplementationOnce(() => 0.3);

        
        const succesfullConnection: boolean = myGenome.addConnectionMutation(innovationDatabase);

        expect(succesfullConnection).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith("The nodes 1 and 1 are not distinct.");

        consoleSpy.mockRestore();
        randomSpy.mockRestore();
    })


    it("Should return false because the nodes 1 and 2 are both input nodes.", () => {
        const inputNodes: number = 2;
        const outputNodes: number = 1;
        const totalInitialNodes: number = inputNodes + outputNodes;
        const totalInitialConnections: number = inputNodes * outputNodes;

        const myGenome: Genome = new Genome(1, inputNodes, outputNodes);

        // Initialize the innovation database 
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(totalInitialConnections, totalInitialNodes);

        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        // Tell the Math.random function to return 0.3 and 0.6 in the first 2 calls. This way, because we have 3 nodes,
        // the first and second nodes will be selected for connection
        const randomSpy = jest.spyOn(Math, "random")
            .mockImplementationOnce(() => 0.3)
            .mockImplementationOnce(() => 0.6);

        
        const succesfullConnection: boolean = myGenome.addConnectionMutation(innovationDatabase);

        expect(succesfullConnection).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith("The nodes 1 and 2 are both input nodes.");

        consoleSpy.mockRestore();
        randomSpy.mockRestore();
    })

    it("Should return false because the addition of the connection (2 -> 3) will provoke a circle.", () => {
        const inputNodes: number = 1;
        const outputNodes: number = 1;
        const totalInitialNodes: number = inputNodes + outputNodes;
        const totalInitialConnections: number = inputNodes * outputNodes;

        const myGenome: Genome = new Genome(1, inputNodes, outputNodes);

        // Initialize the innovation database 
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(totalInitialConnections, totalInitialNodes);

        // Add a hidden node (id = 3) between node 1 and node 2
        myGenome.addNodeMutation(innovationDatabase);


        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        // Tell the Math.random function to return 0.6 and 0.9 in the first 2 calls. This way, because we have 3 nodes,
        // the second and third nodes will be selected for connection
        const randomSpy = jest.spyOn(Math, "random")
            .mockImplementationOnce(() => 0.6)
            .mockImplementationOnce(() => 0.9);

        
        const succesfullConnection: boolean = myGenome.addConnectionMutation(innovationDatabase);

        expect(succesfullConnection).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith("The connection (2 -> 3) will provoke a circle.");

        consoleSpy.mockRestore();
        randomSpy.mockRestore();
    })


    it("Should return true because the nodes 2 and 4 are not already connected. The mutation has not happened before", () => {
        const inputNodes: number = 2;
        const outputNodes: number = 1;
        const totalInitialNodes: number = inputNodes + outputNodes;
        const totalInitialConnections: number = inputNodes * outputNodes;

        const myGenome: Genome = new Genome(1, inputNodes, outputNodes);

        // Initialize the innovation database 
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(totalInitialConnections, totalInitialNodes);

        // Create a new mutation that adds a new node (4) between nodes 1 and 3
        const newMutation: AddNodeMutation = innovationDatabase.createAddNodeMutation(1, 3);

        // Create the node based on the mutation
        const newNodeGene: NodeGene = new NodeGene(newMutation.nodeID, NodeGeneType.HIDDEN);

        // Get the nodeFrom, nodeTo which are the nodes 1 and 3
        const nodeFrom: NodeGene = myGenome._nodes.get(1)!;
        const nodeTo: NodeGene = myGenome._nodes.get(3)!;

        // Create the two new connections based on the mutation
        const newConnectionA: ConnectionGene = new ConnectionGene(newMutation.innovationNumberA, nodeFrom, newNodeGene);
        const newConnectionB: ConnectionGene = new ConnectionGene(newMutation.innovationNumberB, newNodeGene, nodeTo);

        // Add the new node and the new connections to the genome
        Reflect.get(myGenome, "nodes").set(4, newNodeGene);
        Reflect.get(myGenome, "connections").set(newConnectionA.key, newConnectionA);
        Reflect.get(myGenome, "connections").set(newConnectionB.key, newConnectionB);

        // Tell the Math.random function to return 0.4 and 0.8 in the first 2 calls. This way, because we have 4 nodes,
        // the second and fourth nodes will be selected for connection
        const randomSpy = jest.spyOn(Math, "random")
            .mockImplementationOnce(() => 0.4)
            .mockImplementationOnce(() => 0.8);
        
        const succesfullConnection: boolean = myGenome.addConnectionMutation(innovationDatabase);

        expect(succesfullConnection).toBe(true);

        expect(Reflect.get(innovationDatabase, "addConnectionMutations").length).toBe(1);
        expect(innovationDatabase.checkAddConnectionMutationExists(2, 4)).toBeDefined();
        expect(myGenome._connections.size).toBe(totalInitialConnections + 2 + 1);

        const foundConnection: ConnectionGene | undefined = Array.from(myGenome._connections.values()).find(
            (value: ConnectionGene) => {
                return value._nodeFrom.key == 2 && value._nodeTo.key == 4;
            }
        )

        expect(foundConnection).toBeDefined();

        randomSpy.mockRestore();
    })


    it("Should return true because the nodes 2 and 4 are not already connected. The mutation has happened before", () => {
        const inputNodes: number = 2;
        const outputNodes: number = 1;
        const totalInitialNodes: number = inputNodes + outputNodes;
        const totalInitialConnections: number = inputNodes * outputNodes;

        const myGenome: Genome = new Genome(1, inputNodes, outputNodes);

        // Initialize the innovation database 
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(totalInitialConnections, totalInitialNodes);

        // Create a new mutation that adds a new node (4) between nodes 1 and 3
        const newMutation: AddNodeMutation = innovationDatabase.createAddNodeMutation(1, 3);

        // Create the node based on the mutation
        const newNodeGene: NodeGene = new NodeGene(newMutation.nodeID, NodeGeneType.HIDDEN);

        // Get the nodeFrom, nodeTo which are the nodes 1 and 3
        const nodeFrom: NodeGene = myGenome._nodes.get(1)!;
        const nodeTo: NodeGene = myGenome._nodes.get(3)!;

        // Create the two new connections based on the mutation
        const newConnectionA: ConnectionGene = new ConnectionGene(newMutation.innovationNumberA, nodeFrom, newNodeGene);
        const newConnectionB: ConnectionGene = new ConnectionGene(newMutation.innovationNumberB, newNodeGene, nodeTo);

        // Add the new node and the new connections to the genome
        Reflect.get(myGenome, "nodes").set(4, newNodeGene);
        Reflect.get(myGenome, "connections").set(newConnectionA.key, newConnectionA);
        Reflect.get(myGenome, "connections").set(newConnectionB.key, newConnectionB);

        // Create the addConnectionMutation
        const addConnectionMutation: AddConnectionMutation = innovationDatabase.createAddConnectionMutation(2, 4);

        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        // Tell the Math.random function to return 0.4 and 0.8 in the first 2 calls. This way, because we have 4 nodes,
        // the second and fourth nodes will be selected for connection
        const randomSpy = jest.spyOn(Math, "random")
            .mockImplementationOnce(() => 0.4)
            .mockImplementationOnce(() => 0.8);
        
        const succesfullConnection: boolean = myGenome.addConnectionMutation(innovationDatabase);

        expect(succesfullConnection).toBe(true);

        expect(Reflect.get(innovationDatabase, "addConnectionMutations").length).toBe(1);
        expect(innovationDatabase.checkAddConnectionMutationExists(2, 4)).toBeDefined();
        expect(myGenome._connections.size).toBe(totalInitialConnections + 2 + 1);

        const foundConnection: ConnectionGene | undefined = Array.from(myGenome._connections.values()).find(
            (value: ConnectionGene) => {
                return value._nodeFrom.key == 2 && value._nodeTo.key == 4;
            }
        )

        expect(foundConnection).toBeDefined();
        expect(foundConnection!.key).toBe(addConnectionMutation.innovationNumber);

        consoleSpy.mockRestore();
        randomSpy.mockRestore();
    })
})


describe("isMoreAdvancedThan function", () => {
    it("Should correctly find out that the first genome is more advanced that the second genome", () => {
        const inputNodes: number = 2;
        const outputNodes: number = 1;
        const totalInitialNodes: number = inputNodes + outputNodes;
        const totalInitialConnections: number = inputNodes * outputNodes;
        
        const genomeA: Genome = new Genome(1, inputNodes, outputNodes);
        const genomeB: Genome = new Genome(2, inputNodes, outputNodes);

        const innovationDatabase: InnovationDatabase = new InnovationDatabase(totalInitialConnections, totalInitialNodes);

        genomeA.addNodeMutation(innovationDatabase);

        expect(genomeA.isMoreAdvancedThan(genomeB)).toBe(true);
        expect(genomeB.isMoreAdvancedThan(genomeA)).toBe(false);
    })
})


describe("findDisjointGenes, findExcessGenes, findMatchingGeneKeys functions", () => {
    it("Should find all the disjoint and excess genes of the 2 genomes and the keys of all \
        matching connections.", () => {
        const genomeA: Genome = new Genome(1, 0, 0);
        const genomeB: Genome = new Genome(2, 0, 0);

        // Nodes of genomeA
        const nodeA1: NodeGene = new NodeGene(1, NodeGeneType.INPUT);
        const nodeA2: NodeGene = new NodeGene(2, NodeGeneType.INPUT);
        const nodeA3: NodeGene = new NodeGene(3, NodeGeneType.OUTPUT);
        const nodeA5: NodeGene = new NodeGene(5, NodeGeneType.HIDDEN);

        // Connections of genomeA
        const connectionA1: ConnectionGene = new ConnectionGene(1, nodeA1, nodeA3);
        connectionA1._activated = false;
        const connectionA2: ConnectionGene = new ConnectionGene(2, nodeA2, nodeA3);
        const connectionA3: ConnectionGene = new ConnectionGene(3, nodeA1, nodeA2);
        const connectionA6: ConnectionGene = new ConnectionGene(6, nodeA1, nodeA5);
        const connectionA7: ConnectionGene = new ConnectionGene(7, nodeA5, nodeA3);
        const connectionA9: ConnectionGene = new ConnectionGene(9, nodeA2, nodeA5);

        // Include nodes and connections of genomeA
        genomeA.includeNode(nodeA1);
        genomeA.includeNode(nodeA2);
        genomeA.includeNode(nodeA3);
        genomeA.includeNode(nodeA5);
        genomeA.includeConnection(connectionA1);
        genomeA.includeConnection(connectionA2);
        genomeA.includeConnection(connectionA3);
        genomeA.includeConnection(connectionA6);
        genomeA.includeConnection(connectionA7);
        genomeA.includeConnection(connectionA9);

        // Nodes of genomeΒ
        const nodeB1: NodeGene = new NodeGene(1, NodeGeneType.INPUT);
        const nodeB2: NodeGene = new NodeGene(2, NodeGeneType.INPUT);
        const nodeB3: NodeGene = new NodeGene(3, NodeGeneType.OUTPUT);
        const nodeB4: NodeGene = new NodeGene(4, NodeGeneType.HIDDEN);
        const nodeB5: NodeGene = new NodeGene(5, NodeGeneType.HIDDEN);

        // Connections of genomeB
        const connectionB1: ConnectionGene = new ConnectionGene(1, nodeB1, nodeB3);
        connectionB1._activated = false;
        const connectionB2: ConnectionGene = new ConnectionGene(2, nodeB2, nodeB3);
        connectionB2._activated = false;
        const connectionB4: ConnectionGene = new ConnectionGene(4, nodeB2, nodeB4);
        const connectionB5: ConnectionGene = new ConnectionGene(5, nodeB4, nodeB3);
        const connectionB6: ConnectionGene = new ConnectionGene(6, nodeB1, nodeB5);
        const connectionB7: ConnectionGene = new ConnectionGene(7, nodeB5, nodeB3);
        const connectionB8: ConnectionGene = new ConnectionGene(8, nodeB1, nodeB4);

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
        genomeB.includeConnection(connectionB7);
        genomeB.includeConnection(connectionB8);

        // Run functions to get results
        const disjointGenesA: ConnectionGene[] = genomeA.findDisjointGenes(genomeB);
        const disjointGenesB: ConnectionGene[] = genomeB.findDisjointGenes(genomeA);
        const excessGenesA: ConnectionGene[] = genomeA.findExcessGenes(genomeB);
        const excessGenesB: ConnectionGene[] = genomeB.findExcessGenes(genomeA);
        const matchingKeysA: number[] = genomeA.findMatchingGeneKeys(genomeB);
        const matchingKeysB: number[] = genomeB.findMatchingGeneKeys(genomeA);

        // Tests
        expect(disjointGenesA).toHaveLength(1);
        expect(disjointGenesA).toContain(connectionA3);

        expect(disjointGenesB).toHaveLength(3);
        expect(disjointGenesB).toContain(connectionB4);
        expect(disjointGenesB).toContain(connectionB5);
        expect(disjointGenesB).toContain(connectionB8);

        expect(excessGenesA).toHaveLength(1);
        expect(excessGenesA).toContain(connectionA9);

        expect(excessGenesB).toHaveLength(0);

        expect(matchingKeysA).toHaveLength(4);
        expect(matchingKeysA).toContain(1);
        expect(matchingKeysA).toContain(2);
        expect(matchingKeysA).toContain(6);
        expect(matchingKeysA).toContain(7);

        expect(matchingKeysB).toHaveLength(4);
        expect(matchingKeysB).toContain(1);
        expect(matchingKeysB).toContain(2);
        expect(matchingKeysB).toContain(6);
        expect(matchingKeysB).toContain(7);
    })
})