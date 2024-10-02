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
        const nodeEvaluationData: Map<number, EvaluationData[]> = Reflect.get(network, "nodeEvaluationData");

        // Tests
        expect(nodeEvaluationData.size).toBe(7);
        
        expect(nodeEvaluationData.get(2)?.length).toBe(1);
        expect(nodeEvaluationData.get(2)).toContainEqual({nodeFrom: 1, weight: 0.2, bias: node2._bias});

        expect(nodeEvaluationData.get(3)?.length).toBe(2);
        expect(nodeEvaluationData.get(3)).toContainEqual({nodeFrom: 1, weight: 0.1, bias: node3._bias});
        expect(nodeEvaluationData.get(3)).toContainEqual({nodeFrom: 2, weight: 0.3, bias: node3._bias});

        expect(nodeEvaluationData.get(4)?.length).toBe(1);
        expect(nodeEvaluationData.get(4)).toContainEqual({nodeFrom: 2, weight: 0.4, bias: node4._bias});

        expect(nodeEvaluationData.get(5)?.length).toBe(3);
        expect(nodeEvaluationData.get(5)).toContainEqual({nodeFrom: 2, weight: 0.5, bias: node5._bias});
        expect(nodeEvaluationData.get(5)).toContainEqual({nodeFrom: 4, weight: 0.9, bias: node5._bias});
        expect(nodeEvaluationData.get(5)).toContainEqual({nodeFrom: 3, weight: 0.6, bias: node5._bias});

        expect(nodeEvaluationData.get(6)?.length).toBe(1);
        expect(nodeEvaluationData.get(6)).toContainEqual({nodeFrom: 5, weight: 1.1, bias: node6._bias});

        expect(nodeEvaluationData.get(7)?.length).toBe(1);
        expect(nodeEvaluationData.get(7)).toContainEqual({nodeFrom: 3, weight: 0.7, bias: node7._bias});

        expect(nodeEvaluationData.get(8)?.length).toBe(2);
        expect(nodeEvaluationData.get(8)).toContainEqual({nodeFrom: 3, weight: 0.8, bias: node8._bias});
        expect(nodeEvaluationData.get(8)).toContainEqual({nodeFrom: 7, weight: 1, bias: node8._bias});
    })
})