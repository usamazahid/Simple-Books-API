import { NextRequest, NextResponse } from "next/server";
var jwt = require('jsonwebtoken');
import decode from 'jwt-decode';
import postgres from "postgres";
import { checkLimit } from "../helpers/rateLimit";

const conn = postgres({
    ssl: require,
});

type Props = {
        exists:boolean,
}

export async function POST(request:NextRequest){
    checkLimit();
    const res : Partial<Client> = await request.json();
    const token = jwt.sign(res, process.env.SECRETKEY, {
        expiresIn:'7d'
    });

    let query = `SELECT id FROM clients where clientName = '${res.clientName}' and clientEmail = '${res.clientEmail}'`;
    console.log(query);
    const exists = await conn.unsafe(query);
    console.log(exists);
    if(exists.length > 0){
        return new NextResponse(JSON.stringify({"Message":"API client already registered. Try changing the values for clientEmail and clientName to something else."}), 
        {
            status:409,
        });
    }

    query = `INSERT INTO clients(token, clientName, clientEmail) VALUES('${token}', '${res.clientName}', '${res.clientEmail}')`;
    console.log(query);
    const result = await conn.unsafe(query);
    console.log(result)

    console.log(token);
    var decoded =  decode(token);
    console.log(decoded);

    return new NextResponse(JSON.stringify({
        "Auth-Token":token
    }));
}