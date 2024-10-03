import { NodeGeneType } from "./nodeGene.types";

/**
 * Represents a node (neuron) in the neural network. 
 */
class NodeGene extends Object {
    public key: number;
    public type: NodeGeneType;
    private bias!: number; // Only for nodes with type = output or hidden

    public constructor(key: number, type: NodeGeneType) {
        super();
        this.key = key;
        this.type = type;

        this.initializeBias(type);
    }

    /*----------------------------------------Getters Methods----------------------------------------*/
    public get _bias(): number {
        return this.bias;
    }

    /*----------------------------------------Setters Methods----------------------------------------*/
    public set _bias(bias: number) {
        this.bias = bias;
    }

    /*----------------------------------------Public Methods----------------------------------------*/


    /**
     * Returns a brand new NodeGene that is identical with the current NodeGene.
     */
    public getCopy(): NodeGene {
        const copy: NodeGene = new NodeGene(this.key, this.type);
        copy.bias = this.bias;

        return copy;
    }

    public override toString(): string {
        return `{NodeId = ${this.key}, type = ${this.type}}`;
    }

    /**
     * Initializes the bias of the node with a random number between -0.5 and 0.5
     */
    private initializeBias(type: NodeGeneType) {
        if (type == NodeGeneType.INPUT) {
            this.bias = 0;
        } else {
            this.bias = Math.random() - 0.5;
        }
    }
}

export default NodeGene;