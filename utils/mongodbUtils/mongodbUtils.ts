import { Db, MongoClient } from "mongodb";

const uri: string = process.env.MONGODB_URI;
const dbName: string = "student-grades";

let cachedClient: MongoClient;
let cachedDB: Db;

export const connnectToDatabase = async () => {
  try {
    if (cachedClient && cachedDB) {
      return { client: cachedClient, db: cachedDB };
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);

    cachedClient = client;
    cachedDB = db;

    return { client, db };
  } catch (error) {
    console.error("Error occured:" + error);
  }
};

export async function addGradeToDatabase(
  gradesObject: {},
  firstName: string,
  lastName: string,
  email: string,
): Promise<void> {
  console.log(gradesObject, firstName, lastName, email);

  try {
    const { db } = await connnectToDatabase();
    // console.log(gradesObject);

    if (!gradesObject) {
      throw new Error("Invalid grades data.");
    }

    const data: any = {
      firstName,
      lastName,
      gradesObject,
    };

    const response = await db.collection(dbName).findOneAndUpdate(
      { firstName: firstName },
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          gradesObject: gradesObject,
        },
      },
      { upsert: true }
    );
    console.log("response");
    return response;
  } catch (error) {
    console.log("Error occured while adding to db" + error);
  }
}
