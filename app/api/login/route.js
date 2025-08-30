import clientPromise from "@/app/lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function POST(req) {
  const { username, password } = await req.json();
  const client = await clientPromise;
  const db = client.db("topgamer");
  const user = await db.collection("users").findOne({ username });
  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return new Response(JSON.stringify({ message: "Invalid password" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  //if password is valid return user except password and jwt token
  const { password: _, ...userWithoutPassword } = user;
  const token = jwt.sign(
    { id: userWithoutPassword._id, username: userWithoutPassword.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  return new Response(JSON.stringify({ user: userWithoutPassword, token }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}