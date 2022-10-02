import { BookModel } from "../models/BookModel";
import { DataService } from "./DataService";


export class BookService extends DataService<BookModel> {

    constructor() {
        super(new BookModel());  
    }

    public async findByName(name:string) {
        let res:any = {};
        let query = `SELECT * FROM ${this.model.getTableName()} WHERE name = '${name}'`;
            
        let dbData = await this.executeQuery(query);
        if (!dbData.error) {
            res.data = dbData.rows[0];
        } else {
            res = dbData
        }

        return res;
    }

}
