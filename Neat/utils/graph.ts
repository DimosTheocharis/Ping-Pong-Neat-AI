

class Graph {

    /*----------------------------------------Public Methods----------------------------------------*/

    /**
     * Checks if the addition of the newConnection in the directed graph forms a circle.
     * Internally it runs DFS.
     * @param connections A Map object whose keys are nodes (number). The value of each node is a list of other nodes 
     * (number[]) you can move to through connections.
     * 
     * @param newConnection The new connection
     * @returns 
     */
    public static createsCircle(connections: Map<number, number[]>, newConnection: {nodeFrom: number, nodeTo: number}): boolean {
        const visited: Map<number, boolean> = new Map();
        const recurrentStack: Map<number, boolean> = new Map();

        // Get the nodes of the graph
        const nodes: number[] = Array.from(connections.keys());

        // Initialize the maps
        nodes.forEach((node: number) => {
            visited.set(node, false);
            recurrentStack.set(node, false);
        })

        // Add the {newConnection} to the graph
        const neighbors: number[] = connections.get(newConnection.nodeFrom)!;
        neighbors.push(newConnection.nodeTo);

        connections.set(newConnection.nodeFrom, neighbors);

        // Check if a circle is formed starting from {nodeFrom}
        if (this.isCyclic(visited, recurrentStack, newConnection.nodeFrom, connections)) {
            return true;
        }

        return false;
    }


    /**
     * Finds the layers of the feedForwardNetwork that consists of the given {nodes} and the given {connections}.
     * Each layer i includes nodes that are i connections far from the layer of the {inputNodes}. The method
     * internally runs the BFS.
     * @param nodes 
     * @param inputNodes 
     * @param connections A Map object whose keys are nodes (number) of the network. The value of each node is a list 
     * of other nodes (number[]) you can move to through connections.
     */
    public static feedForwardLayers(nodes: number[], inputNodes: number[], connections: Map<number, number[]>): number[][] {
        const discovered: Map<number, boolean> = new Map();

        // Set discovered = false for every node
        nodes.forEach((node: number) => {
            discovered.set(node, false);
        })

        // Set discovered = true for input nodes
        inputNodes.forEach((inputNode: number) => {
            discovered.set(inputNode, true);
        })

        const layers: number[][] = [];

        // The first layer should consist of input nodes. (it will be excluded from the final result)
        layers.push(inputNodes)
        
        let currentLayerIndex: number = 0;
        let running: boolean = true;

        while (running) {
            const nextLayer: number[] = [];
            running = false;

            // For every node in the current layer
            layers[currentLayerIndex].forEach((node: number) => {
                // For every connection starting from the current node
                connections.get(node)!.forEach((neighbor: number) => {
                    if (discovered.get(neighbor) == false) {
                        // You haven't explore this neighbor yet.
                        discovered.set(neighbor, true);
                        nextLayer.push(neighbor);
                        running = true;
                    }
                })
            })

            // If any node added to the nextLayer, then add the layer to the known layers
            if (running) {
                layers.push(nextLayer);
                currentLayerIndex += 1;
            }
        }

        // Remove the input layer and return the others
        return layers.slice(1);
    }



    /*----------------------------------------Private Methods----------------------------------------*/

    /**
     * Returns true or false whether or not a circle is formed in the graph, starting from the {currentNode}
     * @param visited Whether or not the algorithm has examined a node
     * @param recurrentStack True means that the particular node is part of the path we currently examine for being a circle 
     * @param currentNode 
     * @param connections A Map object whose keys are nodes (number) of the network. The value of each node is a list 
     * of other nodes (number[]) you can move to through connections.
     */
    private static isCyclic(
        visited: Map<number, boolean>, recurrentStack: Map<number, boolean>, currentNode: number,
        connections: Map<number, number[]>
    ): boolean {
        // The {currentNode} is now being visited
        visited.set(currentNode, true);

        // Mark the node as part of the path
        recurrentStack.set(currentNode, true);
        
        // Get the neighbors of the {currentNode}
        const neighbors: number[] = connections.get(currentNode)!;

        for (const neighbor of neighbors) {
            if (visited.get(neighbor) == false) {
                // The neighbor is not being visited yet. Visit the neighbor.
                const cyclic: boolean = this.isCyclic(visited, recurrentStack, neighbor, connections);

                if (cyclic) {
                    // A circle begins from the neighbor
                    return true;
                } else if (recurrentStack.get(neighbor) == true) {
                    // The neighbor is part of the current path.
                    return true;
                }
            } else if (recurrentStack.get(neighbor) == true) {
                // The neighbor has already been visited and is part of the current path. A circle is formed.
                return true;
            }
        }

        // Remove the node from the path
        recurrentStack.set(currentNode, false);

        return false;
    }   
}

export default Graph;