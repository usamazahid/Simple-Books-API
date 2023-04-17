import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";
import { limiter } from "../../helpers/limiter";

const conn = postgres({
    ssl: require,
});

type Props = {
    params: {
        id: string
    }
}

export async function GET(request: NextRequest, {params:{id}}:Props) {
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
  
    const result = await conn.unsafe(`SELECT * FROM orders where id = '${id}'`);
    console.log(result)
    return new NextResponse(JSON.stringify(result));
}

export async function PATCH(request: NextRequest, {params:{id}}:Props) {
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
    const {clientName} : Partial<Client> = await request.json();
    const result = await conn.unsafe(`UPDATE orders SET clientName = '${clientName}' where id = '${id}' RETURNING id`);

    console.log(result)
    return new NextResponse(JSON.stringify({
        "Message":"Order Updated Successfully.",
        "result":result,
    }));
}

export async function DELETE(request: NextRequest, {params:{id}}:Props) {
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

    const result = await conn.unsafe(`DELETE from orders where id = '${id}' Returning id`);

    console.log(result)
    if(result.length > 0){
    return new NextResponse(JSON.stringify({
        "Message":"Order Updated Successfully.",
        "result":result,
    }));
    }else{
        return new NextResponse(JSON.stringify({
            "Message":"Could not found Order.",
        }));
    }
}

