import DisplayGrades from "@/components/DisplayGrades";
import StudentForm from "@/components/StudentForm";

export default function page() {
  return (
    <main className="flex min-h-screen flex-col gap-6 items-center justify-center p-24">
      <StudentForm />
    </main>
  );
}
