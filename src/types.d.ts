type Book = {
    id:number,
    name:string,
    author:string,
    genre:string,
    is_available:boolean
}
type Client = {
    clientName:string,
    clientEmail:string,
}

type Order = {
    bookId:number,
    customerName:string,
}