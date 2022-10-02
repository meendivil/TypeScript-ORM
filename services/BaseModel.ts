
export abstract class BaseModel {

    private tableName:string;
    private idName:string;

    constructor(tableName:string, idName:string) {
        this.tableName = tableName;
        this.idName = idName;
    }

    public getTableName(): string {
        return this.tableName;
    }

    public getIdName(): string {
        return this.idName;
    }
    
}