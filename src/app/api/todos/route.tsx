import { NextResponse } from "next/server";
import { type } from "os";

const DATA_SOURCE_URL = "https://jsonplaceholder.typicode.com/todos"

const API_KEY: string = process.env.DATA_API_KEY as string

export async function GET() {
    const res = await fetch(DATA_SOURCE_URL)

    const todos: Todo[] = await res.json()

    return NextResponse.json(todos)
}

export async function DELETE(request: Request) {
    const { id }: Partial<Todo> = await request.json()

    if (!id) return NextResponse.json({ "message": "To id required" })

    await fetch(`${DATA_SOURCE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'API-Key': API_KEY
        }
    })
    return NextResponse.json({ "message": `Todo ${id} Deleted` })
}

export async function POST(request: Request) {
    const { userId, title }: Partial<Todo> = await request.json()

    if (!userId || !title) return NextResponse.json({ "message": "Data Missing" })

    const res = await fetch(`${DATA_SOURCE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'API-Key': API_KEY
        },
        body: JSON.stringify({ userId, title })
    })
    const newTodo: Todo = await res.json()

    return NextResponse.json(newTodo);
}

export async function PUT(request: Request) {
    const { id, userId, title, completed }: Partial<Todo> = await request.json()

    if (!userId || !title || typeof (completed) !== 'boolean') return NextResponse.json({ "message": "Missing Data" })

    const res = await fetch(`${DATA_SOURCE_URL}/${id}`, {
        method: 'PUT',
        headers : {
            'Content-Type':'application/json',
            'API-KEY':API_KEY
        },
        body: JSON.stringify({userId, title, completed})
    })
    const todo = await res.json()

    return NextResponse.json(todo) 

}