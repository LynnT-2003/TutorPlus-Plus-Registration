import { connect, model, models, Schema } from "mongoose";
// const connectionString =
//   "mongodb+srv://user1:d1aVx26YFCCnVKgr@cluster0.e6jfgzx.mongodb.net/tutorplus";
const connectionString = process.env.MONGODB_URI;

export default async function handler(req, res) {
  await connect(connectionString);
  console.log("req.method: ", req.method);

  if (req.method === "GET") {
    const docs = await Sessions.find();
    res.status(200).json(docs);
  } else if (req.method === "POST") {
    console.log(req.body);
    // res.status(200).json(req.body);
    const doc = await Sessions.create(req.body);
    res.status(201).json(doc);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const sessionSchema = new Schema({
  sessionId: String,
  sessionTime: Date,
  tutorId: String,
});

console.log("Mongoose Models", models);
const Sessions = models?.sessions || model("sessions", sessionSchema);
