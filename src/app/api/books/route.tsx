import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";
import { limiter } from "../helpers/limiter";


const conn = postgres({
ssl:require,
});

export async function GET(request:NextRequest) {
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
  const result = await conn.unsafe("SELECT * FROM books");
  console.log(result)
  return new NextResponse(JSON.stringify(result));
}

