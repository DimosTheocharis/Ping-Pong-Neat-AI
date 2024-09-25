import ConnectionGene from "../ConnectionGene/connectionGene";
import { NodeGeneType } from "../NodeGene/nodeGene.types";
import { Counter } from "../utils/counter";
import BaseClass from "../baseClass";
import NodeGene from "../NodeGene/nodeGene";
import InnovationDatabase from "../InnovationDatabase/innovationDatabase";
import { AddConnectionMutation, AddNodeMutation } from "../InnovationDatabase/innovationDatabase.types";
import Graph from "../utils/graph";

/**
 * Represents a neural network that consists of Nodes (neurons) and Connections (synapses).
 */
class Genome extends BaseClass {
    private nodes!: Map<number, NodeGene>;
    private connections!: Map<number, ConnectionGene>;

    private fitness: number;

    private nodeKeyCounter: Counter;
    private connectionKeyCounter: Counter; 

    static C1: number = 1; // The coefficient for the excess nodes
    static C2: number = 1; // The coefficient for the disjoint nodes
    static C3: number = 0.4; // The coefficient for the weight difference

    private addNodeProbability: number = 0.05;
    private addConnectionProbability: number = 0.15;
    private mutateWeightProbability: number = 0.8;
    

    public constructor(key: number, totalInputNodes: number, totalOutputNodes: number) {
        super(key);

        this.nodeKeyCounter = new Counter();
        this.connectionKeyCounter = new Counter();
        this.nodes = new Map();
        this.connections = new Map();
        this.fitness = 0;

        this.initializeGenome(totalInputNodes, totalOutputNodes);
    }

    /*----------------------------------------Getters Methods----------------------------------------*/
    public get _connections(): Map<number, ConnectionGene> {
        return this.connections;
    }

    public get _nodes(): Map<number, NodeGene> {
        return this.nodes;
    }

    public get _fitness(): number {
        return this.fitness;
    }

    /*----------------------------------------Setter Methods ----------------------------------------*/
    public set _nodes(nodes: Map<number, NodeGene>) {
        this.nodes = nodes;
    }

    public set _connections(connections: Map<number, ConnectionGene>) {
        this.connections = connections;
    }

    public set _fitness(fitness: number) {
        this.fitness = fitness;
    }

    /*----------------------------------------Public Methods----------------------------------------*/

    /**
     * Calculates and returns the genomic distance between this genome and the given genome
     * distance = (c1 * E) / N + (c2 * D) / N + c3 * W
     * where:
     * E = the number of excess genes
     * D = the number of disjoint genes
     * W = the average weight difference of matching genes
     * N = the number of connection genes (of the genome with the most connection genes)
     */
    public distance(genome: Genome): number {
        let genomicDistance: number = 0;

        const {disjointGenes, excessGenes} = this.findDisjointAndExcessGenes(genome); 
        const matchingGeneKeys: number[] = this.findMatchingGeneKeys(genome);


        const E: number = excessGenes.length;
        const D: number = disjointGenes.length;
        const N: number = Math.max(this._connections.size, genome._connections.size);

        let totalWeightDifference: number = 0;
        matchingGeneKeys.forEach((key: number) => {
            totalWeightDifference += Math.abs(this._connections.get(key)!._weight - genome._connections.get(key)!._weight);
        })

        const W: number = matchingGeneKeys.length > 0 ? totalWeightDifference / matchingGeneKeys.length : 0;

        if (N > 0) {
            genomicDistance = (Genome.C1 * E) / N + (Genome.C2 * D) / N + Genome.C3 * W;
        } else {
            genomicDistance = Genome.C3 * W;
        }
 
        return genomicDistance;
    }

    /**
     * Mutates the genome in various ways:
     * 1) Add a node where a connection used to be
     * 2) Add a connection between 2 unconnected nodes
     * 3) Change the weight of a connection 
     */
    public mutate(innovationDatabase: InnovationDatabase): void {
        const randomNumber: number = Math.random();

        if (randomNumber <= this.addNodeProbability) {
            this.addNodeMutation(innovationDatabase);
            console.log(`Μετάλλαξη: Προσθήκη κόμβου στο γονιδίωμα ${this._key}`);
        } 

        if (randomNumber <= this.addConnectionProbability) {
            const success: boolean = this.addConnectionMutation(innovationDatabase);
            if (success) {
                console.log(`Μετάλλαξη: Προσθήκη σύνδεσης στο γονιδίωμα ${this._key}`);
            } else {
                console.log(`ΑΠΟΤΥΧΙΑ μετάλλαξης: Προσθήκη σύνδεσης στο γονιδίωμα ${this._key}`);
            }
        }

        if (randomNumber <= this.mutateWeightProbability) {
            this.weightMutation();
            console.log(`Μετάλλαξη: Αλλαγή βάρους σύνδεσης στο γονιδίωμα ${this._key}`);
        }
    }


    /**
     * Adds a new node in the graph by splitting an existing random connection into 2 new connections that connect with the
     * new node. The old connection gets disabled.
     */
    public addNodeMutation(innovationDatabase: InnovationDatabase): void {
        // Randomly find a connection that is going to be splitted.
        const randomConnection: ConnectionGene = this.getRandomConnection();
        
        // Disable the connection
        randomConnection._activated = false;

        // Check if the mutation that adds a node between the nodeFrom and nodeTo of the randomConnection, has happened again.
        const existingMutation: AddNodeMutation | undefined = innovationDatabase.checkAddNodeMutationExists(randomConnection._nodeFrom.key, randomConnection._nodeTo.key);

        let newNodeGene: NodeGene; // The new node
        let newConnectionA: ConnectionGene; // The first new connection. Connects the nodeFrom and the new node.
        let newConnectionB: ConnectionGene; // The second new connection. Connects the new node and the nodeTo.
        
        if (existingMutation) {
            newNodeGene = new NodeGene(existingMutation.nodeID, NodeGeneType.HIDDEN);
            newConnectionA = new ConnectionGene(existingMutation.innovationNumberA, this.nodes.get(existingMutation.nodeFrom)!, newNodeGene, 1); 
            newConnectionB = new ConnectionGene(existingMutation.innovationNumberB, newNodeGene, this.nodes.get(existingMutation.nodeTo)!, randomConnection._weight);
        } else {
            // Create a new addNodeMutation about this mutation
            const newAddNodeMutation: AddNodeMutation = innovationDatabase.createAddNodeMutation(randomConnection._nodeFrom.key, randomConnection._nodeTo.key);

            newNodeGene = new NodeGene(newAddNodeMutation.nodeID, NodeGeneType.HIDDEN);
            newConnectionA = new ConnectionGene(newAddNodeMutation.innovationNumberA, randomConnection._nodeFrom, newNodeGene, 1);
            newConnectionB = new ConnectionGene(newAddNodeMutation.innovationNumberB, newNodeGene, randomConnection._nodeTo, randomConnection._weight);
        }
    
        // Add the new node in the list of the nodes of the genome
        this.nodes.set(newNodeGene.key, newNodeGene);

        // Add the new two connections in the list of the connections of the genome
        this.connections.set(newConnectionA.key, newConnectionA);
        this.connections.set(newConnectionB.key, newConnectionB);
    }

    /**
     * Connects 2 previously unconnected nodes. Specifically, it randomly selects 2 nodes and if they can get connected
     * without breaking any condition, then a new ConnectionGene is created. The conditions are: 
     * 1) The nodes should not be already connected
       2) Self-connections are not allowed
     * 3) Two input nodes cannot be connected
     * 4) Two output nodes cannot be connected
     * 5) The addition of the connection should not provoke any circle
     * @returns true/false based on whether the nodes connected succesfully or not
     */
    public addConnectionMutation(innovationDatabase: InnovationDatabase): boolean {
        // Randomly find two nodes
        const nodeFrom: NodeGene = this.getRandomNode();
        const nodeTo: NodeGene = this.getRandomNode();

        // If the two nodes are now allowed to connect, then terminate the mutation.
        if (!this.canConnect(nodeFrom, nodeTo)) return false;

        // Check if this mutation, that connects these two nodes, has happened in the past in some other genome
        const existingMutation: AddConnectionMutation | undefined = innovationDatabase.checkAddConnectionMutationExists(nodeFrom.key, nodeTo.key);

        let newConnectionGene: ConnectionGene;

        if (existingMutation) {
            newConnectionGene = new ConnectionGene(existingMutation.innovationNumber, nodeFrom, nodeTo);
        } else {
            const newAddConnectionMutation: AddConnectionMutation = innovationDatabase.createAddConnectionMutation(nodeFrom.key, nodeTo.key);

            newConnectionGene = new ConnectionGene(newAddConnectionMutation.innovationNumber, nodeFrom, nodeTo);
        }

        this.connections.set(newConnectionGene.key, newConnectionGene);

        return true;
    }


    /**
     * Randomly picks a connection and mutate its weight.
     */
    public weightMutation(): void {
        const randomConnection: ConnectionGene = this.getRandomConnection();
        randomConnection.mutateWeight();
    }


    /*----------------------------------------Private Methods----------------------------------------*/

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

    /**
     * Finds the disjoint and the excess connections genes. Both type of connection genes
     * are present in one genome but not at the other. However,
     * Disjoint genes: the keys of these genes must exist inside the range of the smallest gene
     * Excess genes: the keys of these genes must exist outside the range of the smallest gene
     */
    private findDisjointAndExcessGenes(genome: Genome): {disjointGenes: ConnectionGene[], excessGenes: ConnectionGene[]} {
        const disjointGenes: ConnectionGene[] = [];
        const excessGenes: ConnectionGene[] = [];

        let smallGenome: Genome;
        let bigGenome: Genome; // Its biggest key is greater than smallGenome's biggest key

        if (this.isMoreAdvancedThan(genome)) {
            bigGenome = this;
            smallGenome = genome;
        } else {
            bigGenome = genome;
            smallGenome = this;
        }

        const minimumConnectionGenes: number = smallGenome._connections.size;

        // Find the disjoint connection genes that belong to the small genome
        smallGenome._connections.forEach((gene: ConnectionGene, key: number) => {
            if (!bigGenome._connections.has(key)) {
                // The current key is not present in the keys of bigGenome
                disjointGenes.push(gene);
            }
        })


        // Find the disjoint connection genes that belong to the big genome
        bigGenome._connections.forEach((gene: ConnectionGene, key: number) => {
            if (!smallGenome._connections.has(key)) {
                // The current key is not present in the keys of smallGenome
                if (key <= minimumConnectionGenes) {
                    // Disjoint gene
                    disjointGenes.push(gene);
                } {
                    // Excess gene
                    excessGenes.push(gene);
                }
            }
        })

        

        return {
            disjointGenes: disjointGenes,
            excessGenes: excessGenes
        }
    }

    /**
     * Finds the keys of the connections genes that are present in both genomes
     */
    private findMatchingGeneKeys(genome: Genome): number[] {
        const matchingGeneKeys: number[] = [];

        this._connections.forEach((gene: ConnectionGene, key: number) => {
            if (genome._connections.has(key)) {
                matchingGeneKeys.push(key);
            }
        })

        return matchingGeneKeys;
    }

    /**
     * Returns true if the biggest connection-key of the current genome is bigger than
     * the corresponding of the genome in the parameters
     */
    private isMoreAdvancedThan(genome: Genome): boolean {
        // Find the biggest key of the connections of each genome among the current genome and the parameter genome
        const a: number = Math.max(...this._connections.keys());
        const b: number = Math.max(...genome._connections.keys());

        return a >= b;
    }

    /**
     * Checks if the two given nodes can get connected, without breaking any condition.
     */
    private canConnect(nodeFrom: NodeGene, nodeTo: NodeGene): boolean {
        // 1) The nodes should not be already connected
        const existingConnection: ConnectionGene | undefined = Array.from(this.connections.values()).find((value: ConnectionGene) => {
            return value._nodeFrom == nodeFrom && value._nodeTo == nodeTo;
        })

        if (existingConnection) {
            console.log(`The nodes ${nodeFrom.key} and ${nodeTo.key} are already connected.`);
            return false;
        }
        // 2) Self-connections are not allowed
        if (nodeFrom == nodeTo) {
            console.log(`The nodes ${nodeFrom.key} and ${nodeTo.key} are not distinct.`);
            return false;
        }

        // 3) Two input nodes cannot be connected
        if (nodeFrom.type == NodeGeneType.INPUT && nodeTo.type == NodeGeneType.INPUT) {
            console.log(`The nodes ${nodeFrom.key} and ${nodeTo.key} are both input nodes.`);
            return false;
        }
        
        // 4) Two output nodes cannot be connected
        if (nodeFrom.type == NodeGeneType.OUTPUT && nodeTo.type == NodeGeneType.OUTPUT) {
            console.log(`The nodes ${nodeFrom.key} and ${nodeTo.key} are both output nodes.`);
            return false;
        }

        // 5) The addition of the connection should not provoke any circle
        const createsCircle: boolean = Graph.createsCircle(this.extractConnectionKeys(), {nodeFrom: nodeFrom.key, nodeTo: nodeTo.key});
        if (createsCircle) {
            console.log(`The connection (${nodeFrom.key} -> ${nodeTo.key}) will provoke a circle.`);
            return false;
        }


        return true;
    }

    /**
     * Randomly selects a node of this genome and returns it.
     */
    private getRandomNode(): NodeGene {
        const randomKey: number = Array.from(this.nodes.keys()).sort()[Math.floor(Math.random() * this.nodes.size)];

        return this.nodes.get(randomKey)!;
    }

    /**
     * Randomly selects a connection of this genome and returns it.
     */
    private getRandomConnection(): ConnectionGene {
        const randomKey: number = Array.from(this.connections.keys()).sort()[Math.floor(Math.random() * this.connections.size)];

        return this.connections.get(randomKey)!;
    }

    private extractConnectionKeys(): Map<number, number[]> {
        const connectionKeys: Map<number, number[]> = new Map();

        // Initialize the neighbors array for each node
        this.nodes.forEach((node: NodeGene, key: number) => {
            connectionKeys.set(key, []);
        })

        // Add the information (nodeFrom, nodeTo) into the connectionKeys map, for each connection
        this.connections.forEach((connection: ConnectionGene, key: number) => {
            const neighbors: number[] = connectionKeys.get(connection._nodeFrom.key)!;

            neighbors.push(connection._nodeTo.key);
            
            connectionKeys.set(connection._nodeFrom.key, neighbors);
        })

        return connectionKeys;
    }
}

export default Genome;