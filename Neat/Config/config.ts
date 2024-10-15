
/**
 * This class is responsible for reading the configuration file that contains the hyper-parameters for the system.
 * 
 */
class Config {
    private path!: string;

    // GENOME Settings
    private static genomicDistanceThreshold: number = 2
    private static addNodeProbability: number = 0.05;
    private static addConnectionProbability: number = 0.15;
    private static mutateWeightProbability: number = 0.8;
    private static perturbationProbability: number = 0.9;
    private static mutatePower: number = 0.05;

    private static C1: number = 1; // The coefficient for the excess nodes
    private static C2: number = 1; // The coefficient for the disjoint nodes
    private static C3: number = 0.4; // The coefficient for the weight difference

    
    /*----------------------------------------Private Methods----------------------------------------*/
    

    /*----------------------------------------Getters Methods----------------------------------------*/
    public static get _addNodeProbability(): number {
        return Config.addNodeProbability;
    }

    public static get _addConnectionProbability(): number {
        return Config.addConnectionProbability;
    }

    public static get _mutateWeightProbability(): number {
        return Config.mutateWeightProbability;
    }

    public static get _genomicDistanceThreshold(): number {
        return Config.genomicDistanceThreshold;
    }

    public static get _perturbationProbability(): number {
        return Config.perturbationProbability;
    }

    public static get _mutatePower(): number {
        return Config.mutatePower;
    }

    public static get _C1(): number {
        return Config.C1;
    }

    public static get _C2(): number {
        return Config.C2;
    }

    public static get _C3(): number {
        return Config.C3;
    }
}