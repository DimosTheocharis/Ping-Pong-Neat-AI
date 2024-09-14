
class BaseClass {
    private key: number;

    public constructor(key: number) {
        this.key = key;
    }

    /** Returns the key of the genome */
    public get _key() { return this.key; }
}

export default BaseClass;