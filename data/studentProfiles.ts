import { StudentProfileType } from "@/types/types";
import { getGradesAverage } from "../utils/studentGradesUtils";

const studentProfiles: StudentProfileType[] = [
  {
    _id: "65aae662813ed40b7ecb3595",
    firstName: "jack",
    email: "jack.kiza@cmsdk12.org",
    gradesObject: {
      "English III": "100%",
      "Health Education": "100%",
      "Jobs - II": "100%",
      "Senior Seminar": "100%",
    },
    lastName: "kiza",
    dateAdded: "2024-08-27T15:35:23.889Z",
    get gradesAverage() {
      const grades = Object.values(this.gradesObject).map((grade) =>
        parseFloat(grade.replace("%", ""))
      );
      const total = grades.reduce((acc, grade) => acc + grade, 0);
      return total / grades.length;
    },
  },
  {
    _id: "65aae662813ed40b7ecb3596",
    firstName: "John",
    email: "john.doe@cmsdk12.org",
    gradesObject: {
      "English III": "80%",
      "Health Education": "90%",
      "Jobs - II": "85%",
      "Senior Seminar": "95%",
    },
    lastName: "Doe",
    dateAdded: "2024-08-27T15:35:23.890Z",
    get gradesAverage() {
      const grades = Object.values(this.gradesObject).map((grade) =>
        parseFloat(grade.replace("%", ""))
      );
      const total = grades.reduce((acc, grade) => acc + grade, 0);
      return total / grades.length;
    },
  },
  {
    _id: "65aae662813ed40b7ecb3597",
    firstName: "Jane",
    email: "jane.doe@cmsdk12.org",
    gradesObject: {
      "English III": "75%",
      "Health Education": "85%",
      "Jobs - II": "90%",
      "Senior Seminar": "80%",
    },
    lastName: "Doe",
    dateAdded: "2024-08-27T15:35:23.891Z",
    get gradesAverage() {
      const grades = Object.values(this.gradesObject).map((grade) =>
        parseFloat(grade.replace("%", ""))
      );
      const total = grades.reduce((acc, grade) => acc + grade, 0);
      return total / grades.length;
    },
  },
];

export { studentProfiles };
