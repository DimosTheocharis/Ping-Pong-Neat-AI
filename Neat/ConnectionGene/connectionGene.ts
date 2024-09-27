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

    /**
     * Creates a new ConnectionGene with the given parameters. If weight is undefined, then a random weight
     * is assigned 
     * @param key 
     * @param nodeFrom 
     * @param nodeTo 
     * @param weight 
     */
    public constructor(key: number, nodeFrom: NodeGene, nodeTo: NodeGene, weight?: number) {
        this.key = key;
        this.nodeFrom = nodeFrom;
        this.nodeTo = nodeTo;
        this.activated = true;

        this.initializeWeight(weight);
    }

    /**
     * Sets the weight of the connection with a random value between -1 and 1
     */
    public mutateWeight(): void {
        this.weight = Math.random() * 2 - 1;
    }

    /**
     * Returns a brand new ConnectionGene that is identical with the current ConnectionGene.
     * It internally gets a copy of the nodes too
     */
    public getCopy(): ConnectionGene {
        const nodeFromCopy: NodeGene = this.nodeFrom.getCopy();
        const nodeToCopy: NodeGene = this.nodeTo.getCopy();

        const copy: ConnectionGene = new ConnectionGene(this.key, nodeFromCopy, nodeToCopy, this.weight);
        copy._activated = this.activated;

        return copy;
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
     * Initializes the weight of the connection with a random number between -1 and 1. This happens
     * only if the parameter weight is defined
     */
    private initializeWeight(weight?: number) {
        if (weight) {
            this.weight = weight;
        } else {
            this.weight = Math.random() * 2 - 1;
        }
    }
}


export default ConnectionGene;