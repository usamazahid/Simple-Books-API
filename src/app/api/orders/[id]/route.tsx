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
    if(result.length > 0){
        return new NextResponse(JSON.stringify(result));
        }else{
            return new NextResponse(JSON.stringify({
                "Message":"Could not find Order.",
            }));
        }
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

    let query = `UPDATE orders SET clientName = '${clientName}', modifiedat=CURRENT_TIMESTAMP where id = '${id}' RETURNING id`;
    console.log(query)
    const result = await conn.unsafe(query);

    console.log(result)
    if(result.length > 0){
        return new NextResponse(JSON.stringify({
            "Message":"Order Updated Successfully.",
            "result":result,
        }));
        }else{
            return new NextResponse(JSON.stringify({
                "Message":"Could not find Order.",
            }));
        }
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

    const result = await conn.unsafe(`DELETE from orders where id = '${id}' Returning id;
    update books set is_available = true`);

    console.log(result)
    if(result.length > 0){
    return new NextResponse(JSON.stringify({
        "Message":"Order Deleted Successfully.",
        "result":result,
    }));
    }else{
        return new NextResponse(JSON.stringify({
            "Message":"Could not find Order.",
        }));
    }
}

