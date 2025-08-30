//we are on backend.Now if a user request this route it means he is logged in
//but asking for his data.So we will provide his data but first we will verify jwt token
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
        return new Response(JSON.stringify({ message: "No token provided" }), { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const client = await clientPromise;
        const db = client.db("topgamer");
        const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.id) });
        if (!user) {
            console.log('user not found');
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        const { password, ...userWithoutPassword } = user;
        return new Response(JSON.stringify(userWithoutPassword), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
    }
}

//create function to update user data in mongodb
export async function POST(request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return new Response(JSON.stringify({ message: "No token provided" }), { status: 401 });
    }
    const { games } = await request.json();
    if(!games){
        return new Response(JSON.stringify({ message: 'Missing required fields' }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
    }

    const client = await clientPromise;
    const db = client.db('topgamer');
    
    const token = authHeader.replace("Bearer ", "");
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.id) });
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        await db.collection('users').updateOne(
            { _id: new ObjectId(decoded.id) },
            { $set: { games } }
        );
        return new Response(JSON.stringify({ message: 'User data updated successfully' }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
    }   

}

