import { Counter } from "../utils";
import { AddNodeMutation, AddConnectionMutation } from "./innovationDatabase.types";

/**
 * Stores the mutations that happen in the genomes of the population. 
 * It is used to ensure that if the same mutation occurs in different genomes
 * in different time, it will receive the same innovation number.
 */
class InnovationDatabase {
    private addNodeMutations: AddNodeMutation[];
    private addConnectionMutations: AddConnectionMutation[];

    private addNodeMutationCounter: Counter;
    private addConnectionMutationCounter: Counter;

    private innovationNumberCounter: Counter; // Keeps track of the innovation numbers
    private nodeIdCounter: Counter; // Keeps track  of the node's ids

    public constructor(totalInitialConnections: number, totalInitialNodes: number) {
        this.addNodeMutations = [];
        this.addConnectionMutations = [];

        this.addNodeMutationCounter = new Counter();
        this.addConnectionMutationCounter = new Counter();

        this.innovationNumberCounter = new Counter(totalInitialConnections);
        this.nodeIdCounter = new Counter(totalInitialNodes);
    }

    /*----------------------------------------Public Methods----------------------------------------*/

    /**
     * Creates a new AddNodeRecord
     */
    public createAddNodeMutation(nodeFrom: number, nodeTo: number): void {
        console.assert(nodeFrom > 0, `nodeFrom should be positive. Received: ${nodeFrom}`);
        console.assert(nodeTo > 0, `nodeTo should be positive. Received: ${nodeTo}`);

        const newRecord: AddNodeMutation = {
            id: this.addNodeMutationCounter.next(),
            nodeFrom: nodeFrom,
            nodeTo: nodeTo,
            innovationNumberA: this.innovationNumberCounter.next(),
            innovationNumberB: this.innovationNumberCounter.next(),
            nodeID: this.nodeIdCounter.next()
        };

        console.assert(this.checkAddNodeMutationExists(nodeFrom, nodeTo) == undefined, `The addNode mutation between nodes ${nodeFrom}, ${nodeTo} already exists!`);

        this.addNodeMutations.push(newRecord);
    }

    /**
     * Creates a new AddConnectionRecord
     */
    public createAddConnectionMutation(nodeFrom: number, nodeTo: number): void {
        console.assert(nodeFrom > 0, `nodeFrom should be positive. Received: ${nodeFrom}`);
        console.assert(nodeTo > 0, `nodeTo should be positive. Received: ${nodeTo}`);

        const newRecord: AddConnectionMutation = {
            id: this.addConnectionMutationCounter.next(),
            nodeFrom: nodeFrom,
            nodeTo: nodeTo,
            innovationNumber: this.innovationNumberCounter.next()
        }

        console.assert(this.checkAddConnectionMutationExists(nodeFrom, nodeTo) == undefined, `The addConnection mutation between nodes ${nodeFrom}, ${nodeTo} already exists!`);
    
        this.addConnectionMutations.push(newRecord);
    }

    /**
     * Checks if the mutation about adding a node by splitting the connection between nodes: {nodeFrom, nodeTo},
     * has happened before.
     */
    public checkAddNodeMutationExists(nodeFrom: number, nodeTo: number): AddNodeMutation | undefined {
        const foundRecord: AddNodeMutation | undefined = this.addNodeMutations.find((record: AddNodeMutation) => {
            return record.nodeFrom == nodeFrom && record.nodeTo == nodeTo;
        })

        return foundRecord;
    }

    /**
     * Checks if the mutation about adding a connection between nodes: {nodeFrom, nodeTo} has 
     * happened before.
     */
    public checkAddConnectionMutationExists(nodeFrom: number, nodeTo: number): AddConnectionMutation | undefined {
        const foundRecord: AddConnectionMutation | undefined = this.addConnectionMutations.find((record: AddConnectionMutation) => {
            return record.nodeFrom == nodeFrom && record.nodeTo == nodeTo;
        })

        return foundRecord;
    }
}

export default InnovationDatabase;