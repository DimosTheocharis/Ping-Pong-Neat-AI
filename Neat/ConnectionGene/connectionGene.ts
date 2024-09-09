import NodeGene from "../NodeGene/NodeGene";

/**
 * Represents a connection (synapse) between two nodes in the neural network. 
 */
class ConnectionGene {
    public key: number;
    private nodeFrom: NodeGene;
    private nodeTo: NodeGene;
    private weight!: number;

    public constructor(key: number, nodeFrom: NodeGene, nodeTo: NodeGene) {
        this.key = key;
        this.nodeFrom = nodeFrom;
        this.nodeTo = nodeTo;

        this.initializeWeight();
    }

    /**
     * Initializes the weight of the connection with a random number between -1 and 1
     */
    private initializeWeight() {
        this.weight = Math.random() * 2 - 1;
    }
}


export default ConnectionGene;