import { columns } from "./columns";
import { StudentProfileType } from "@/types/types";
import { DataTable } from "./DataTable";
import { studentProfiles as data } from "../../../data/studentProfiles";
import { getStudentProfiles } from "../../../utils/mongodbUtils/mongodbUtils";

// async function getData(): Promise<StudentProfileType[]> {
//   // Fetch data from your API here.
//   const stundentProfiles = await getStudentProfiles();
//   return stundentProfiles;
// }

export default async function DemoPage() {
  const stundentProfiles = await getStudentProfiles();

  console.log("stundentProfiles", stundentProfiles);
  //   const data = await getData();
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={stundentProfiles} />
    </div>
  );
}
