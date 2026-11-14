import { columns } from "./columns";
import { DataTable } from "./DataTable";
import { getStudentProfiles } from "../../../utils/db";

export default async function StudentProfilesTable() {
  const studentProfiles = await getStudentProfiles();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={studentProfiles} />
    </div>
  );
}
