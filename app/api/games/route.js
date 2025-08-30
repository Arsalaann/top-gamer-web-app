//create function to retrieve all games from mongodb
import clientPromise from '../../lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

async function getGames() {
  try {
    const client = await clientPromise;
    const db = client.db("topgamer");

    let games = await db.collection("games").find().toArray();

    if (games.length === 0) {
      const defaultGames = [
        { _id: 1, highScore: 0, playerName: "deadshot", playerCountry: "USA" }, // Catch Master
        { _id: 2, highScore: 0, playerName: "deadshot", playerCountry: "USA" }, // Burst Shot
        { _id: 3, highScore: 0, playerName: "deadshot", playerCountry: "USA" }, // Shapes Fit
        { _id: 4, highScore: 0, playerName: "deadshot", playerCountry: "USA" }, // Be Careful
      ];

      await db.collection("games").insertMany(defaultGames);
      games = await db.collection("games").find().toArray(); // fetch again
    }

    return games;
  } catch (error) {
    console.error("Error in getGames");
    throw error; // rethrow so GET can handle it
  }
}

export async function GET() {
  try {
    const games = await getGames();
    return new Response(JSON.stringify(games), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to fetch games data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}


//create function to update a game's high score in mongodb
export async function POST(request) {
  //check if user is authenticated
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ message: 'No token provided' }), { status: 401 });
  }

  try {
    jwt.verify(authHeader.replace('Bearer ', ''), JWT_SECRET);
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
  }

  const { gameId, highScore, playerName, playerCountry } = await request.json();
  if (!gameId || !highScore || !playerName || !playerCountry) {
    return new Response(JSON.stringify({ message: 'Missing required fields' }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db('topgamer');
    const game = await db.collection('games').findOne({ _id: gameId });

    if (!game) {
      return new Response(JSON.stringify({ message: 'Game not found' }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    await db.collection('games').updateOne(
      { _id: gameId },
      { $set: { highScore, playerName, playerCountry } }
    );
    return new Response(JSON.stringify({ message: 'High score updated successfully' }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  catch{
    console.error("Failed to Update User Data");
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 