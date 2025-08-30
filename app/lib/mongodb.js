// create function to connect to mongodb
import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI || `mongodb+srv://databaseformongodb:JAHcKSZgZtAl9v2I@cluster0.2wu77hr.mongodb.net/rentify?retryWrites=true&w=majority&appName=Cluster0`;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to hold the client
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}else {
  // In production mode, create a new client for each request
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  clientPromise = client.connect();
}

export default clientPromise;


