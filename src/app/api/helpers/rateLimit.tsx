import { NextResponse } from "next/server"
import { limiter } from "./limiter"

export async function checkLimit(){
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
      console.log("Limiter Called")
}