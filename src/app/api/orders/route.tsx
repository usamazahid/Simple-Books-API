import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";
import { limiter } from "../helpers/limiter";

const conn = postgres({
    ssl: require,
});


export async function POST(request: NextRequest) {
    const remainingLimit = await limiter.removeTokens(1)
    if(remainingLimit < 0){return  new NextResponse(JSON.stringify({
      "Error":"Too many requests!"
    }), 
        {
          status:429,
          statusText:"Too many requests!",
          headers:{
            'Access-Control-Allow-Origin':'*'
          }
    
        }
      )}

    const {bookId, clientName} : Partial<Order> = await request.json();
    if(!bookId|| !clientName)    {
        return new NextResponse(JSON.stringify({
            "message":"Missing required Data!",
        }));
    }
    let query = `SELECT 1 as status from books where is_available is false and id = ${bookId}`;
    console.log(query);
    const checkBookStatus = await conn.unsafe(query);
    console.log(checkBookStatus)

    if(checkBookStatus.length > 0){
        return new NextResponse(JSON.stringify({
            "Message":"Book Unavailable",
        }));
    }

    query = `INSERT INTO orders (bookId, clientName) values('${bookId}', '${clientName}') RETURNING id as orderId;
    UPDATE books set is_available = false where id = '${bookId}'`;
    console.log(query);
    const result = await conn.unsafe(query);
    console.log(result)


    return new NextResponse(JSON.stringify(result));
}

export async function GET(request: NextRequest) {
  const remainingLimit = await limiter.removeTokens(1)
  if(remainingLimit < 0){return  new NextResponse(JSON.stringify({
    "Error":"Too many requests!"
  }), 
      {
        status:429,
        statusText:"Too many requests!",
        headers:{
          'Access-Control-Allow-Origin':'*'
        }
  
      }
    )}

  
  let query = `SELECT * from orders`;
  console.log(query);
  const result = await conn.unsafe(query);
  console.log(result)

  return new NextResponse(JSON.stringify(result));
}
