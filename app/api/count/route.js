//create api get request handler to get total players and total games played
import clientPromise from "@/app/lib/mongodb";

async function getPlayersAndGamesPlayedCount(x) {
    try {
        const client = await clientPromise;
        const db = await client.db("topgamer");
        let countDoc = await db.collection("count").findOne({ _id: "countsDoc" });
        if (!countDoc) {
            countDoc = { _id: "countsDoc", usersCount: 1234, gamesPlayedCount: 123456 };
            await db.collection("count").insertOne(countDoc);
        }
        if(x){
           await db.collection("count").updateOne(
                { _id: "countsDoc" },
                { $inc: { gamesPlayedCount: 1 } }
            );
            countDoc = await db.collection("count").findOne({ _id: "countsDoc" });
        }
        return countDoc;
    } catch {
        console.error("Failed to fetch counts");
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const shouldIncrement = searchParams.get("increment") === "true";
    const countDoc = await getPlayersAndGamesPlayedCount(shouldIncrement?1:0);
    if (countDoc)
        return new Response(JSON.stringify(countDoc), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    else
        return new Response(
            JSON.stringify({ message: "Failed to fetch counts data" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
}

