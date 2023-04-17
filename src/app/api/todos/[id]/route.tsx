import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

const DATA_SOURCE_URL = "https://jsonplaceholder.typicode.com/todos"

type Props = {
    params:{
        id:string
    }
}

export async function GET(request:Request, {params}){
// const id = await request.url.slice(request.url.lastIndexOf('/')+1)
const id = 1
console.log(params)
const res = await fetch(`${DATA_SOURCE_URL}/${id}`)
const todo :Todo = await res.json()

if(!todo.id) return NextResponse.json({"message":"id not found"})

return NextResponse.json(todo)

}