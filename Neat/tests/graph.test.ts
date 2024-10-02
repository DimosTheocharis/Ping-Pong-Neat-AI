import Graph from "../utils/graph";

describe("createsCircle function", () => {
    it("Should detect the presence of the circle I.", () => {
        const connections: Map<number, number[]> = new Map();

        connections.set(0, [1, 2]);
        connections.set(1, []);
        connections.set(2, [0, 3]);
        connections.set(3, []);
        
        expect(Graph.createsCircle(connections, {nodeFrom: 1, nodeTo: 2})).toBe(true);
    })

    it("Should detect the presence of the circle II.", () => {
        const connections: Map<number, number[]> = new Map();

        connections.set(0, [1]);
        connections.set(1, []);
        connections.set(2, [1, 3]);
        connections.set(3, [4]);
        connections.set(4, [0]);
        
        expect(Graph.createsCircle(connections, {nodeFrom: 4, nodeTo: 2})).toBe(true);
    })


    it("Should detect the absence of the circle II.", () => {
        const connections: Map<number, number[]> = new Map();

        connections.set(1, [2]);
        connections.set(2, []);
        connections.set(3, []);
        
        expect(Graph.createsCircle(connections, {nodeFrom: 2, nodeTo: 3})).toBe(false);
    })
})

describe("feedForwardLayers function", () => {
    it("Should correctly find all the layers of the feedForwardNetwork and the nodes contained inside. Test 1", () => {
        const nodes: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
        const inputNodes: number[] = [1];

        const connections: Map<number, number[]> = new Map();

        connections.set(1, [2, 3]);
        connections.set(2, [3, 5, 4]);
        connections.set(3, [5, 7, 8]);
        connections.set(4, [5]);
        connections.set(5, [6]);
        connections.set(6, []);
        connections.set(7, [8]);
        connections.set(8, []);

        const layers: number[][] = Graph.feedForwardLayers(nodes, inputNodes, connections);

        expect(layers[0].length).toBe(2);
        expect(layers[0]).toContain(2);
        expect(layers[0]).toContain(3);

        expect(layers[1].length).toBe(4);
        expect(layers[1]).toContain(4);
        expect(layers[1]).toContain(5);
        expect(layers[1]).toContain(7);
        expect(layers[1]).toContain(8);

        expect(layers[2].length).toBe(1);
        expect(layers[2]).toContain(6);
    })

    it("Should correctly find all the layers of the feedForwardNetwork and the nodes contained inside. Test 2", () => {
        const nodes: number[] = [1, 2, 3, 4, 5, 6];
        const inputNodes: number[] = [1, 6];

        const connections: Map<number, number[]> = new Map();

        connections.set(1, [2, 3, 4]);
        connections.set(2, [4]);
        connections.set(3, [4]);
        connections.set(4, [5]);
        connections.set(5, []);
        connections.set(6, [2]);

        const layers: number[][] = Graph.feedForwardLayers(nodes, inputNodes, connections);

        expect(layers[0].length).toBe(3);
        expect(layers[0]).toContain(2);
        expect(layers[0]).toContain(3);
        expect(layers[0]).toContain(4);

        expect(layers[1].length).toBe(1);
        expect(layers[1]).toContain(5);
    })
})