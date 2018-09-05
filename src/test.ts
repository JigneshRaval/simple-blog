export class Hero {
    id: number;
    name: string;

    constructor(name: any) {
        this.name = name;
    }

    myName() {
        return this.name;
    }
}
