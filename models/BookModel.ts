import { BaseModel } from '../services/BaseModel';

export class BookModel extends BaseModel {

    private bookId:number;
    private name:string;
    private description:string;
    private price:number;
    private isbn:string;
    private stock:number;
    private softDelete:boolean;

    constructor();
    constructor(bookId:number, name:string, description:string, price:number, isbn:string, stock:number, softDelete:boolean);
    constructor(bookId?:number, name?:string, description?:string, price?:number, isbn?:string, stock?:number, softDelete?:boolean) {
        super("book", "bookId");
        this.bookId = bookId? bookId : 0;
        this.name = name? name : "";
        this.description = description? description : "";
        this.price = price? price : 0;
        this.isbn = isbn ? isbn : "";
        this.stock = stock? stock : 0;
        this.softDelete = softDelete? softDelete : false;
    }
    
    public getName(): string {
        return this.name;
    }

    public setName(name:string): void {
        this.name = name;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description:string): void {
        this.description = description;
    }

    public getPrice(): number {
        return this.price;
    }

    public setPrice(price:number): void {
        this.price = price;
    }

    public getIsbn(): string {
        return this.isbn;
    }

    public setIsbn(isbn:string): void {
        this.isbn = isbn;
    }

    public getStock(): number {
        return this.stock;
    }

    public setStock(stock:number): void {
        this.stock = stock;
    }
}