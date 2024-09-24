

class Graph {

    /**
     * Checks if the addition of the newConnection in the directed graph forms a circle 
     * @param connections A list of connections (nodeFrom -> nodeTo)
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
     * Returns true or false whether or not a circle is formed in the graph, starting from the {currentNode}
     * @param visited Whether or not the algorithm has examined a node
     * @param recurrentStack True means that the particular node is part of the path we currently examine for being a circle 
     * @param currentNode 
     * @param connections 
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