import { Db, MongoClient, WithId } from "mongodb";
import { date } from "zod";

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
    console.error("DB Error occured: " + error);
  }
};

export async function addToDbAndReturnProfile(
  gradesObject: {},
  firstName: string,
  lastName: string,
  email: string,
  dateAdded: Date
): Promise<WithId<any>> {
  // Todo:Make type for object returned from db
  console.log(gradesObject, firstName, lastName, email);

  try {
    if (!gradesObject) {
      throw new Error("Invalid grades data.");
    }

    const result = await connnectToDatabase();

    if (!result) {
      throw new Error("Could not connect to DB");
    }

    const { db } = result;
    // const { db } = await connnectToDatabase();

    // console.log(gradesObject);

    const data: any = {
      // TODO: fix types
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
          dateAdded: new Date(),
          gradesObject: gradesObject,
        },
      },
      { upsert: true }
    );

    return response;
  } catch (error) {
    console.log("Error occured while adding to db" + error);
  }
}
