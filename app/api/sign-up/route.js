import clientPromise from "@/app/lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
export async function POST(req) {
    const { username, password, country } = await req.json();
    //connect to mongodb
    const client = await clientPromise;
    const db = client.db("topgamer");
    //check if username already exist
    const user = await db.collection("users").findOne({ username });
    if (user) {
        return new Response(
            JSON.stringify({ message: "Username already exists" }),
            { status: 409 }
        );
    }
    //if not exist then create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //store hashed password in mongodb
    const newUser = {
        username,
        password: hashedPassword,
        country,
        games: Array.from({ length: 4 }, () =>
            Array.from({ length: 5 }, () =>
                [0, new Date().toLocaleDateString(), new Date().toLocaleTimeString()]
            )),
        createdAt: new Date(),
    };

    try {
        await db.collection("users").insertOne(newUser);
        await db.collection('count').updateOne(
            { _id: "countsDoc" },
            { $inc: { usersCount: 1 } }
        );
        const { password: _, ...userWithoutPassword } = newUser;

        const token = jwt.sign(
            { id: userWithoutPassword._id, username: userWithoutPassword.username },
            JWT_SECRET,
            { expiresIn: "7d" }
        );
        return new Response(
            JSON.stringify({ user: userWithoutPassword, token }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in sign-up");
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        );
    }
}

