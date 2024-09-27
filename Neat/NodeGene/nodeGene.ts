import { NodeGeneType } from "./nodeGene.types";

/**
 * Represents a node (neuron) in the neural network. 
 */
class NodeGene {
    public key: number;
    public type: NodeGeneType;
    public bias!: number; // Only for nodes with type = output or hidden

    public constructor(key: number, type: NodeGeneType) {
        this.key = key;
        this.type = type;

        if (this.type == NodeGeneType.OUTPUT) {
            this.initializeBias();
        }
    }

    /**
     * Returns a brand new NodeGene that is identical with the current NodeGene.
     */
    public getCopy(): NodeGene {
        const copy: NodeGene = new NodeGene(this.key, this.type);
        copy.bias = this.bias;

        return copy;
    }

    /**
     * Initializes the weight of the connection with a random number between -0.5 and 0.5
     */
    private initializeBias() {
        this.bias = Math.random() - 0.5;
    }
}

export default NodeGene;