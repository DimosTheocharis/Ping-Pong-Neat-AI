import InnovationDatabase from "../InnovationDatabase/innovationDatabase"
import { AddConnectionMutation, AddNodeMutation } from "../InnovationDatabase/innovationDatabase.types";


describe("checkAddNodeMutationExists function", () => {
    it("Should verify that the new addNodeMutation has not happened before. Innovation Database is empty.", () => {
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(2, 3);

        expect(innovationDatabase.checkAddNodeMutationExists(1, 3)).toBe(undefined);
    })

    it("Should verify that the new addNodeMutation has not happened before. Innovation Database is not empty.", () => {
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(2, 3);

        const newRecord: AddNodeMutation = {
            id: 1,
            nodeFrom: 1,
            nodeTo: 3,
            innovationNumberA: 3,
            innovationNumberB: 4,
            nodeID: 4
        }

        Reflect.set(innovationDatabase, "addNodeMutations", [newRecord]);

        expect(innovationDatabase.checkAddNodeMutationExists(2, 3)).toBe(undefined);
    })

    it("Should verify that the new addNodeMutation has happened before.", () => {
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(2, 3);

        const newRecord: AddNodeMutation = {
            id: 1,
            nodeFrom: 1,
            nodeTo: 3,
            innovationNumberA: 3,
            innovationNumberB: 4,
            nodeID: 4
        }

        Reflect.set(innovationDatabase, "addNodeMutations", [newRecord]);

        expect(innovationDatabase.checkAddNodeMutationExists(1, 3)).toBe(newRecord);
    })
})


describe("checkAddConnectionMutationExists function", () => {
    it("Should verify that the new addConnectionMutation has not happened before. Innovation Database is empty.", () => {
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(2, 3);

        expect(innovationDatabase.checkAddConnectionMutationExists(1, 2)).toBe(undefined);
    })

    it("Should verify that the new addConnectionMutation has not happened before. Innovation Database is not empty.", () => {
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(2, 3);

        const newRecord: AddConnectionMutation = {
            id: 1,
            nodeFrom: 1,
            nodeTo: 4,
            innovationNumber: 3
        }

        Reflect.set(innovationDatabase, "addConnectionMutations", [newRecord])

        expect(innovationDatabase.checkAddConnectionMutationExists(1, 2)).toBe(undefined);
    })

    it("Should verify that the new addConnectionMutation has happened before.", () => {
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(2, 3);

        const newRecord: AddConnectionMutation = {
            id: 1,
            nodeFrom: 1,
            nodeTo: 2,
            innovationNumber: 3
        }

        Reflect.set(innovationDatabase, "addConnectionMutations", [newRecord])

        expect(innovationDatabase.checkAddConnectionMutationExists(1, 2)).toBe(newRecord);
    })
})


describe("createAddNodeMutation function", () => {
    it("Should verify that the insertion of the addNodeMutation happens without problems.", () => {
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(2, 3);

        const newRecord: AddNodeMutation = {
            id: 1,
            nodeFrom: 1,
            nodeTo: 3,
            innovationNumberA: 3,
            innovationNumberB: 4,
            nodeID: 4
        }

        innovationDatabase.createAddNodeMutation(1, 3);

        expect(Reflect.get(innovationDatabase, "addNodeMutations").length).toBe(1);

        expect(Reflect.get(innovationDatabase, "addNodeMutations").find((record: AddNodeMutation) => {
            return record.nodeFrom == 1 && record.nodeTo == 3
        })).toEqual(newRecord);
    })

    it("Should verify that the insertion of the addNodeMutation triggers the console.assert statement, because it already exists.", () => {
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(2, 3);

        const consoleSpy = jest.spyOn(console, 'assert').mockImplementation(() => {});

        const newRecord: AddNodeMutation = {
            id: 1,
            nodeFrom: 1,
            nodeTo: 3,
            innovationNumberA: 3,
            innovationNumberB: 4,
            nodeID: 4
        }

        Reflect.set(innovationDatabase, "addNodeMutations", [newRecord]);

        innovationDatabase.createAddNodeMutation(1, 3);

        expect(consoleSpy).toHaveBeenCalledWith(false, "The addNode mutation between nodes 1, 3 already exists!");

        consoleSpy.mockRestore();
    })
})


describe("createAddConnectionMutation function", () => {
    it("Should verify that the insertion of the addConnectionMutation happens without problems.", () => {
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(2, 3);

        const newRecord: AddConnectionMutation = {
            id: 1,
            nodeFrom: 1,
            nodeTo: 2,
            innovationNumber: 3
        }

        innovationDatabase.createAddConnectionMutation(1, 2);

        expect(Reflect.get(innovationDatabase, "addConnectionMutations").length).toBe(1);

        expect(Reflect.get(innovationDatabase, "addConnectionMutations").find((record: AddConnectionMutation) => {
            return record.nodeFrom == 1 && record.nodeTo == 2
        })).toEqual(newRecord);

    })

    it("Should verify that the insertion of the addConnectionMutation triggers the console.assert statement, because it already exists.", () => {
        const innovationDatabase: InnovationDatabase = new InnovationDatabase(2, 3);

        const consoleSpy = jest.spyOn(console, 'assert').mockImplementation(() => {});

        const newRecord: AddConnectionMutation = {
            id: 1,
            nodeFrom: 1,
            nodeTo: 2,
            innovationNumber: 3
        }

        Reflect.set(innovationDatabase, "addConnectionMutations", [newRecord]);

        innovationDatabase.createAddConnectionMutation(1, 2);

        expect(consoleSpy).toHaveBeenCalledWith(false, "The addConnection mutation between nodes 1, 2 already exists!");

        consoleSpy.mockRestore();
    })
})