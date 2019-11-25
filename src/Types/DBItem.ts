import { v4 as uuid } from "uuid";

class DBItem {
    public id: string;
    constructor() {
        this.id = uuid();
    }
}

export default DBItem;
