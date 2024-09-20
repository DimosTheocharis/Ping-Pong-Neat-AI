import NodeGene from "../NodeGene/nodeGene";

/**
 * Represents a connection (synapse) between two nodes in the neural network. 
 */
class ConnectionGene {
    public key: number;
    private nodeFrom: NodeGene;
    private nodeTo: NodeGene;
    private weight!: number;
    private activated!: boolean;

    public constructor(key: number, nodeFrom: NodeGene, nodeTo: NodeGene, weight?: number) {
        this.key = key;
        this.nodeFrom = nodeFrom;
        this.nodeTo = nodeTo;
        this.activated = true;

        this.initializeWeight();

        if (weight) {
            this.weight = weight;
        }
    }

    /*----------------------------------------Getters Methods----------------------------------------*/
    public get _weight(): number {
        return this.weight;
    }

    public get _nodeFrom(): NodeGene {
        return this.nodeFrom;
    }

    public get _nodeTo(): NodeGene {
        return this.nodeTo;
    }

    public get _activated(): boolean {
        return this.activated;
    }

    /*----------------------------------------Setters Methods----------------------------------------*/
    public set _activated(value: boolean) {
        this.activated = value;
    }


    /*----------------------------------------Private Methods----------------------------------------*/

    /**
     * Initializes the weight of the connection with a random number between -1 and 1
     */
    private initializeWeight() {
        this.weight = Math.random() * 2 - 1;
    }
}


export default ConnectionGene;