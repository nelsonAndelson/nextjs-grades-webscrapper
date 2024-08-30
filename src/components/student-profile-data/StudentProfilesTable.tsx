import { columns } from "./columns";
import { StudentProfileType } from "@/types/types";
import { DataTable } from "./DataTable";
import { studentProfiles as data } from "../../../data/studentProfiles";

async function getData(): Promise<StudentProfileType[]> {
  // Fetch data from your API here.
  return data;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
