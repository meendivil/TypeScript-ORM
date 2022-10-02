const express = require('express'); // Express dependency
import { BookModel } from './models/BookModel';
import { BookService } from './services/BookService';
const app = express();              // Express app instance.
const port = 5000;                  // Port where the server will be listening


app.get('/', async (req:any, res:any) => { 
    let book:BookModel = new BookModel(1, "Harry Potter and the Sorcerer's Stone", "Harry Potter", 6.28, "0439708184", 1, false);
    let bookService:BookService = new BookService();
    await bookService.save(book);
    await bookService.update(book);
    await bookService.getById(1);
    await bookService.getAll();
    await bookService.softDelete(book);
    await bookService.softDeleteById(1);
    await bookService.findByName("Harry");

    let criteria:any = {
        and: {
            eq: {
                isbn: "0439708184"  
            },
            like: {
                description: "%Harry Potter%"
            }
        },
        or: {
            eq: {
                price: 10
            }
        },
        like: {
            name: "Sorcerer's Stone",
        }
    }

    let a = await bookService.findByCriteria(criteria);
    console.log(a);

    res.sendFile('index.html', {root: __dirname});
});


app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});