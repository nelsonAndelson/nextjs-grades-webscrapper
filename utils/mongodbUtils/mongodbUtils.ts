import { StudentProfileType } from "@/types/types";
import { Db, MongoClient, WithId } from "mongodb";
import { date } from "zod";
import { getGradesAverage } from "../studentGradesUtils";

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
  email: string
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
      email,
      gradesObject,
    };

    const response = await db.collection(dbName).findOneAndUpdate(
      { firstName: firstName },
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          dateAdded: new Date().toISOString(),
          gradesObject: gradesObject,
        },
      },
      {
        upsert: true,
        projection: {
          _id: { $toString: "$_id" },
          firstName: 1,
          lastName: 1,
          email: 1,
          gradesObject: 1,
          dateAdded: 1,
        },
      }
    );

    // return response;
    console.log("data", data);
    return data;
  } catch (error) {
    console.log("Error occured while adding to db" + error);
  }
}

export async function getStudentProfiles(): Promise<
  WithId<StudentProfileType>[]
> {
  try {
    const result = await connnectToDatabase();
    if (!result) {
      throw new Error("Could not connect to DB");
    }
    const { db } = result;

    const response = await db.collection(dbName).find().toArray();
    const formattedResponse = response.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
      firstName: doc.firstName.charAt(0).toUpperCase() + doc.firstName.slice(1),
      lastName: doc.lastName.charAt(0).toUpperCase() + doc.lastName.slice(1),
      email: doc.email,
      gradesObject: doc.gradesObject,
      dateAdded: doc.dateAdded,
      gradesAverage: getGradesAverage(doc.gradesObject) || undefined,
    }));

    return formattedResponse;
  } catch (error) {
    console.error(error);
    return [];
  }
}
