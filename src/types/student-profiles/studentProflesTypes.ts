type StudentProfileType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gradesObject: GradesObjectType;
  dateAdded: string;
  gradesAverage?: number | undefined;
};

interface GradesObjectType {
  [courseName: string]: string;
}

export type { StudentProfileType, GradesObjectType };
