import NodeGene from "../NodeGene/NodeGene";
import ConnectionGene from "../ConnectionGene/connectionGene";
import { NodeGeneType } from "../NodeGene/nodeGene.types";
import { Counter } from "../utils";


/**
 * Represents a neural network that consists of Nodes (neurons) and Connections (synapses).
 */
class Genome {
    public nodes!: Map<number, NodeGene>;
    public connections!: Map<number, ConnectionGene>;
    private key: number;

    public bestNode = new NodeGene(10, NodeGeneType.INPUT);

    private nodeKeyCounter: Counter;
    private connectionKeyCounter: Counter; 
    

    public constructor(key: number, totalInputNodes: number, totalOutputNodes: number) {
        this.key = key;

        this.nodeKeyCounter = new Counter();
        this.connectionKeyCounter = new Counter();
        this.nodes = new Map();
        this.connections = new Map();

        this.initializeGenome(totalInputNodes, totalOutputNodes);
    }

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
}

export default Genome;