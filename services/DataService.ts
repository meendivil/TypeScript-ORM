import { BaseModel } from "./BaseModel";

const { Client } = require('pg');

export class DataService<T extends BaseModel> {
    
    private connection:any;
    private client:any;
    private config:any;
    protected model:T;

    constructor(model:T) {
        this.model = model;
        this.config = {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: 5432
        };
    }

    protected async executeQuery(query:string) {
        console.log(query);
        let res:any = {};
        let client = new Client(this.config);
        try {
            await client.connect()
            let dbData = await client.query(query);
            res.data = dbData;
        } catch (err) {
            console.log(err);
            res.error = err;
        } finally {
            client.end();
        }

        return res;
    }

    public async getById(id:number) {
		let res:any = {};

        let query = `SELECT * FROM ${this.model.getTableName()} WHERE ${this.toSnakeCase(this.model.getIdName())} = ${id}`;
        let dbData = await this.executeQuery(query);
        if (!dbData.error) {
            res.data = dbData.data.rows[0];
        } else {
            res.error = dbData.error;
        }
            
        return res;
	}

    public async getAll() {
		let res:any = {};
        let query = `SELECT * FROM ${this.model.getTableName()}`;

        let dbData = await this.executeQuery(query);
        if (!dbData.error) {
            res.data = dbData.data.rows;
        } else {
            res.error = dbData.error;
        }
        
        return res;
	}

    public async softDelete(model:BaseModel) {
        const res:any = {};
        
        let query = `UPDATE ${this.model.getTableName()} SET soft_delete = true WHERE ${this.toSnakeCase(this.model.getIdName())} = ${model[this.model.getIdName() as keyof BaseModel]}`;
        let dbData = await this.executeQuery(query);
        if (!dbData.error) {
            res.message = "Successfully deleted";
        } else {
            res.error = dbData.error;
        }

        return res;
    }

    public async softDeleteById(id:number) {
        const res:any = {};
        
        let query = `UPDATE ${this.model.getTableName()} SET soft_delete = true WHERE ${this.toSnakeCase(this.model.getIdName())} = ${id}`;
        let dbData = await this.executeQuery(query);
        if (!dbData.error) {
            res.message = "Successfully deleted";
        } else {
            res.error = dbData.error;
        }

        return res;
    }

    public async update(newModel:BaseModel) {
        const res:any = {};
        let data = this.updateData(newModel);

        let query = `UPDATE ${this.model.getTableName()} ${data} WHERE ${this.toSnakeCase(this.model.getIdName())} = ${newModel[this.model.getIdName() as keyof BaseModel]}`;
        let dbData = await this.executeQuery(query);

        if (!dbData.error) {
            res.message = "Successfully updated";
        } else {
            res.error = dbData.error;
        }

        return res;
    }

    public async save(newModel:BaseModel) {
        const res:any = {};
        let data = this.insertData(newModel);

        try {
            let query = `INSERT INTO ${this.model.getTableName()} (${data.columnNames}) VALUES (${data.columnValues})`;
            let dataRes = await this.executeQuery(query);
            res.data = dataRes;
            res.message = "Successfully saved";
        } catch (err) {
            console.log(err);
            res.error = err;
        }

        return res;
    }

    public async findByCriteria(criteria:string) {
        return await this.where(criteria);
    }

    public async where(filter:any) {
        let res:any = {};
        let query:string = "";
        if(filter.and) {
            query = this.joinFilter("AND", filter.and, query);
        }

        if(filter.or) {
            query = this.joinFilter("OR", filter.or, query);
        }

        let tempQuery = query;
        query = `SELECT * FROM ${this.model.getTableName()} WHERE ${tempQuery}`;
        let dbData = await this.executeQuery(query);
        if (!dbData.error) {
            res.data = dbData.data.rows;
        } else {
            res.error = dbData.error;
        }
        return res;
    }

    private joinFilter(n:string, values:any, query:string) {
        if(n == 'AND' || n == 'OR') {
            Object.keys(values).forEach(k => {
                if (k == "eq") {
                    Object.keys(values[k]).forEach(el => {
                        query = query + `${!query?'':' '+n} ${this.toSnakeCase(el)} = `+(typeof values[k][el] === "string" || values[k][el] instanceof Date ? "'"+values[k][el]+"'" : values[k][el]);
                    });
                }

                if (k == "like") {
                    Object.keys(values[k]).forEach(el => {
                        query = query + `${!query?'':' '+n} ${this.toSnakeCase(el)} LIKE `+(typeof values[k][el] === "string" || values[k][el] instanceof Date ? "'"+values[k][el]+"'" : values[k][el]);
                    });
                }
                
            });
        }

        return query;
    } 

    private insertData(values:any) {
        let columnNames:string = '';
        let columnValues:string = '';
        Object.keys(values).forEach(el => {
            if (el != "tableName" && el != "idName") {
                columnNames = `${columnNames}${columnNames?',':''}${this.toSnakeCase(el)}`;
                columnValues = `${columnValues}${columnValues?',':''}`;
                columnValues = columnValues + (typeof values[el] === "string" || values[el] instanceof Date ? "'"+values[el]+"'" : values[el]);
            }
        });

        let res = {
            columnNames: columnNames,
            columnValues: columnValues
        };

        return res;
    }

    private updateData(values:any) {
        let setValues:string = '';

        Object.keys(values).forEach(el => {
            if (values[el] != undefined && (el != "tableName" && el != "idName") && el != values["idName"]) {
                setValues = `${setValues}${setValues?',':'SET'} ${this.toSnakeCase(el)} = `;
                setValues = setValues + (typeof values[el] === "string" || values[el] instanceof Date ? "'"+values[el]+"'" : values[el]);
            }
        });

        return setValues;
    }

    protected toSnakeCase(inputString:string) {
        return inputString.split('').map((character:any) => {
            if (character == character.toUpperCase()) {
                return '_' + character.toLowerCase();
            } else {
                return character;
            }
        })
        .join('');
    }
    
}