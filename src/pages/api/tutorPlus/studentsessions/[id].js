import { connect, model, models, Schema } from "mongoose";
const connectionString =
  "mongodb+srv://user1:d1aVx26YFCCnVKgr@cluster0.e6jfgzx.mongodb.net/tutorplus";
// const connectionString = process.env.MONGODB_URI;

export default async function handler(req, res) {
  await connect(connectionString);
  console.log("req.method: ", req.method);
  console.log("req.query.id", req.query.id);

  const id = req.query.id;
  if (req.method === "GET") {
    // Get only one document
    const doc = await StudentSessions.findOne({ _id: id });
    res.status(200).json(doc);
  } else if (req.method === "DELETE") {
    const deletedDoc = await StudentSessions.deleteOne({ _id: id });
    res.status(200).json(deletedDoc);
  } else if (req.method === "PUT") {
    console.log("id", req.query.id);
    console.log(req.body);
    const updatedDoc = await StudentSessions.updateOne({ _id: id }, req.body);
    res.status(200).json(updatedDoc);
  } else {
    res.setHeader("Allow", ["GET", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const studentSessionSchema = new Schema({
  sessionId: String,
  studentId: String,
});

console.log("Mongoose Models", models);
const StudentSessions =
  models?.studentsessions || model("studentsessions", studentSessionSchema);
