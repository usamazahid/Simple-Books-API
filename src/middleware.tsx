import { NextRequest, NextResponse } from "next/server"
import {verify} from './app/api/helpers/tokenVerification'

export async function middleware(request:NextRequest){
    
    console.log('Middleware!')
    console.log(request.method)
    console.log(request.url)
    const Authorization = request.headers.get('Authorization')
    console.log(Authorization)
    if(!Authorization){
        return new NextResponse(JSON.stringify({
            "Error":"Unauthorized Access!"
        }), 
        {
            status:401,
            statusText:"Unauthorized Access"
        })
    }
    try {
        await verify(Authorization, process.env.SECRETKEY!);
        return NextResponse.next();
      } catch (error) {
        return new NextResponse(JSON.stringify({
            "Error":"Unauthorized Access!"
        }), 
        {
            status:401,
            statusText:"Unauthorized Access"
        })
      }
    // const { payload } = await jwtVerify(Authorization, new TextEncoder().encode(process.env.SECRETKEY!));
    // console.log(payload);
    return NextResponse.next();
}

export const config = {
    matcher:'/api/orders/:path*'
}
