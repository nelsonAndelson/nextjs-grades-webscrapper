import StudentProfilesTable from "@/components/student-profile-data/StudentProfilesTable";
import { getStudentProfiles } from "../../../utils/mongodbUtils/mongodbUtils";

const Page = () => {
  return <StudentProfilesTable />;
};

export default Page;
