import ConnectionGene from "../ConnectionGene/connectionGene";
import FeedForwardNetwork from "../FeedForwardNetwork/feedForwardNetwork";
import { EvaluationData } from "../FeedForwardNetwork/feedForwardNetwork.types";
import Genome from "../Genome/genome"
import NodeGene from "../NodeGene/nodeGene";
import { NodeGeneType } from "../NodeGene/nodeGene.types";

describe("create function", () => {
    it("Should validate that the created network has the correct data. Genome has 1 input, \
        1 output and 6 hidden nodes spanning 2 hidden layers (2,4)", () => {

        const myGenome: Genome = new Genome(1, 0, 0);

        // Nodes creation
        const node1: NodeGene = new NodeGene(1, NodeGeneType.INPUT);
        const node2: NodeGene = new NodeGene(2, NodeGeneType.HIDDEN);
        const node3: NodeGene = new NodeGene(3, NodeGeneType.HIDDEN);
        const node4: NodeGene = new NodeGene(4, NodeGeneType.HIDDEN);
        const node5: NodeGene = new NodeGene(5, NodeGeneType.HIDDEN);
        const node6: NodeGene = new NodeGene(6, NodeGeneType.OUTPUT);
        const node7: NodeGene = new NodeGene(7, NodeGeneType.HIDDEN);
        const node8: NodeGene = new NodeGene(8, NodeGeneType.HIDDEN);

        // Connections creation
        const connectionA: ConnectionGene = new ConnectionGene(1, node1, node3, 0.1);
        const connectionB: ConnectionGene = new ConnectionGene(2, node1, node2, 0.2);
        const connectionC: ConnectionGene = new ConnectionGene(3, node2, node3, 0.3);
        const connectionD: ConnectionGene = new ConnectionGene(4, node2, node4, 0.4);
        const connectionE: ConnectionGene = new ConnectionGene(5, node2, node5, 0.5);
        const connectionF: ConnectionGene = new ConnectionGene(6, node3, node5, 0.6);
        const connectionG: ConnectionGene = new ConnectionGene(7, node3, node7, 0.7);
        const connectionH: ConnectionGene = new ConnectionGene(8, node3, node8, 0.8);
        const connectionI: ConnectionGene = new ConnectionGene(9, node4, node5, 0.9);
        const connectionJ: ConnectionGene = new ConnectionGene(10, node7, node8, 1.0);
        const connectionK: ConnectionGene = new ConnectionGene(11, node5, node6, 1.1);

        // Include nodes
        myGenome.includeNode(node1);
        myGenome.includeNode(node2);
        myGenome.includeNode(node3);
        myGenome.includeNode(node4);
        myGenome.includeNode(node5);
        myGenome.includeNode(node6);
        myGenome.includeNode(node7);
        myGenome.includeNode(node8);

        // Include connections
        myGenome.includeConnection(connectionA);
        myGenome.includeConnection(connectionB);
        myGenome.includeConnection(connectionC);
        myGenome.includeConnection(connectionD);
        myGenome.includeConnection(connectionE);
        myGenome.includeConnection(connectionF);
        myGenome.includeConnection(connectionG);
        myGenome.includeConnection(connectionH);
        myGenome.includeConnection(connectionI);
        myGenome.includeConnection(connectionJ);
        myGenome.includeConnection(connectionK);

        // Set some variables
        Reflect.set(myGenome, "inputNodeKeys", [1]);
        Reflect.set(myGenome, "outputNodeKeys", [6]);

        // Run the function
        const network: FeedForwardNetwork = FeedForwardNetwork.create(myGenome);

        // Get the values to be tested
        const layers: number[][] = Reflect.get(network, "layers");
        const nodeEvaluationData: Map<number, EvaluationData> = Reflect.get(network, "nodeEvaluationData");

        // Tests
        expect(nodeEvaluationData.size).toBe(7);
        
        expect(nodeEvaluationData.get(2)!.connections.length).toBe(1);
        expect(nodeEvaluationData.get(2)!.bias).toBe(node2._bias);
        expect(nodeEvaluationData.get(2)!.connections).toContainEqual({nodeFrom: 1, weight: 0.2});

        expect(nodeEvaluationData.get(3)!.connections.length).toBe(2);
        expect(nodeEvaluationData.get(3)!.bias).toBe(node3._bias);
        expect(nodeEvaluationData.get(3)!.connections).toContainEqual({nodeFrom: 1, weight: 0.1});
        expect(nodeEvaluationData.get(3)!.connections).toContainEqual({nodeFrom: 2, weight: 0.3});

        expect(nodeEvaluationData.get(4)!.connections.length).toBe(1);
        expect(nodeEvaluationData.get(4)!.bias).toBe(node4._bias);
        expect(nodeEvaluationData.get(4)!.connections).toContainEqual({nodeFrom: 2, weight: 0.4});

        expect(nodeEvaluationData.get(5)!.connections.length).toBe(3);
        expect(nodeEvaluationData.get(5)!.bias).toBe(node5._bias);
        expect(nodeEvaluationData.get(5)!.connections).toContainEqual({nodeFrom: 2, weight: 0.5});
        expect(nodeEvaluationData.get(5)!.connections).toContainEqual({nodeFrom: 4, weight: 0.9});
        expect(nodeEvaluationData.get(5)!.connections).toContainEqual({nodeFrom: 3, weight: 0.6});

        expect(nodeEvaluationData.get(6)!.connections.length).toBe(1);
        expect(nodeEvaluationData.get(6)!.bias).toBe(node6._bias);
        expect(nodeEvaluationData.get(6)!.connections).toContainEqual({nodeFrom: 5, weight: 1.1});

        expect(nodeEvaluationData.get(7)!.connections.length).toBe(1);
        expect(nodeEvaluationData.get(7)!.bias).toBe(node7._bias);
        expect(nodeEvaluationData.get(7)!.connections).toContainEqual({nodeFrom: 3, weight: 0.7});

        expect(nodeEvaluationData.get(8)!.connections.length).toBe(2);
        expect(nodeEvaluationData.get(8)!.bias).toBe(node8._bias);
        expect(nodeEvaluationData.get(8)!.connections).toContainEqual({nodeFrom: 3, weight: 0.8});
        expect(nodeEvaluationData.get(8)!.connections).toContainEqual({nodeFrom: 7, weight: 1});
    })
})



describe("activate function", () => {
    it("Should validate that the output of the network with 3 input, 2 hidden nodes and 1 output, for given input, \
        is correct", () => {
            const myGenome: Genome = new Genome(1, 0, 0);

            // Nodes creation
            const node1: NodeGene = new NodeGene(1, NodeGeneType.INPUT);
            const node2: NodeGene = new NodeGene(2, NodeGeneType.INPUT);
            const node3: NodeGene = new NodeGene(3, NodeGeneType.INPUT);
            const node4: NodeGene = new NodeGene(4, NodeGeneType.HIDDEN);
            const node5: NodeGene = new NodeGene(5, NodeGeneType.HIDDEN);
            const node6: NodeGene = new NodeGene(6, NodeGeneType.HIDDEN);

            // Set bias for all nodes except input nodes
            node4._bias = -0.3;
            node5._bias = 0.1;
            node6._bias = -0.4;

            // Connections creation
            const connection1: ConnectionGene = new ConnectionGene(1, node1, node5, -0.7);
            const connection2: ConnectionGene = new ConnectionGene(2, node1, node6, 0.5);
            const connection3: ConnectionGene = new ConnectionGene(3, node1, node4, 0.2);
            const connection4: ConnectionGene = new ConnectionGene(4, node2, node5, 0.3);
            const connection5: ConnectionGene = new ConnectionGene(5, node3, node5, -0.6);
            const connection6: ConnectionGene = new ConnectionGene(6, node3, node4, 0.1);
            const connection7: ConnectionGene = new ConnectionGene(7, node5, node6, 0.4);
            const connection8: ConnectionGene = new ConnectionGene(8, node6, node4, -0.9);

            // Include nodes
            myGenome.includeNode(node1);
            myGenome.includeNode(node2);
            myGenome.includeNode(node3);
            myGenome.includeNode(node4);
            myGenome.includeNode(node5);
            myGenome.includeNode(node6);

            // Include connections
            myGenome.includeConnection(connection1);
            myGenome.includeConnection(connection2);
            myGenome.includeConnection(connection3);
            myGenome.includeConnection(connection4);
            myGenome.includeConnection(connection5);
            myGenome.includeConnection(connection6);
            myGenome.includeConnection(connection7);
            myGenome.includeConnection(connection8);

            // Set some variables
            Reflect.set(myGenome, "inputNodeKeys", [1, 2, 3]);
            Reflect.set(myGenome, "outputNodeKeys", [4]);

            // Run the function
            const network: FeedForwardNetwork = FeedForwardNetwork.create(myGenome);
            const output: number[] = network.activate([0.7, 0.3, 0.9]);

            // Tests
            expect(output.length).toBe(1);
            expect(output[0]).toBeCloseTo(0.369, 3);
        })



    it("Should validate that the output of the network with 2 input, 3 hidden nodes and 3 output, for given input, \
        is correct", () => {
            const myGenome: Genome = new Genome(1, 0, 0);

            // Nodes creation
            const node1: NodeGene = new NodeGene(1, NodeGeneType.INPUT);
            const node2: NodeGene = new NodeGene(2, NodeGeneType.INPUT);
            const node3: NodeGene = new NodeGene(3, NodeGeneType.OUTPUT);
            const node4: NodeGene = new NodeGene(4, NodeGeneType.OUTPUT);
            const node5: NodeGene = new NodeGene(5, NodeGeneType.OUTPUT);
            const node6: NodeGene = new NodeGene(6, NodeGeneType.HIDDEN);
            const node7: NodeGene = new NodeGene(7, NodeGeneType.HIDDEN);
            const node8: NodeGene = new NodeGene(8, NodeGeneType.HIDDEN);

            // Set bias for all nodes except input nodes
            node3._bias = 0.36;
            node4._bias = -0.44;
            node5._bias = 0.47;
            node6._bias = 0.46;
            node7._bias = 0.04;
            node8._bias = -0.17;

            // Connections creation
            const connection1: ConnectionGene = new ConnectionGene(1, node1, node6, 0.41);
            const connection2: ConnectionGene = new ConnectionGene(2, node1, node4, -0.15);
            const connection3: ConnectionGene = new ConnectionGene(3, node1, node5, 0.51);
            const connection4: ConnectionGene = new ConnectionGene(4, node2, node5, 0.32);
            const connection5: ConnectionGene = new ConnectionGene(5, node2, node7, -0.69);
            const connection6: ConnectionGene = new ConnectionGene(6, node2, node8, -0.42);
            const connection7: ConnectionGene = new ConnectionGene(7, node7, node5, 0.17);
            const connection8: ConnectionGene = new ConnectionGene(8, node8, node7, 0.67);
            const connection9: ConnectionGene = new ConnectionGene(9, node8, node4, -0.44);
            const connection10: ConnectionGene = new ConnectionGene(10, node7, node3, 0.22);
            const connection11: ConnectionGene = new ConnectionGene(11, node6, node3, 0.50);


            // Include nodes
            myGenome.includeNode(node1);
            myGenome.includeNode(node2);
            myGenome.includeNode(node3);
            myGenome.includeNode(node4);
            myGenome.includeNode(node5);
            myGenome.includeNode(node6);
            myGenome.includeNode(node7);
            myGenome.includeNode(node8);

            // Include connections
            myGenome.includeConnection(connection1);
            myGenome.includeConnection(connection2);
            myGenome.includeConnection(connection3);
            myGenome.includeConnection(connection4);
            myGenome.includeConnection(connection5);
            myGenome.includeConnection(connection6);
            myGenome.includeConnection(connection7);
            myGenome.includeConnection(connection8);
            myGenome.includeConnection(connection9);
            myGenome.includeConnection(connection10);
            myGenome.includeConnection(connection11);


            // Set some variables
            Reflect.set(myGenome, "inputNodeKeys", [1, 2]);
            Reflect.set(myGenome, "outputNodeKeys", [3, 4, 5]);

            // Run the function
            const network: FeedForwardNetwork = FeedForwardNetwork.create(myGenome);
            const output: number[] = network.activate([0.19, 0.78]);

            // Tests
            expect(output.length).toBe(3);
            expect(output[0]).toBeCloseTo(0.68, 2);
            expect(output[1]).toBeCloseTo(0.35, 2);
            expect(output[2]).toBeCloseTo(0.71, 2);
        })
})