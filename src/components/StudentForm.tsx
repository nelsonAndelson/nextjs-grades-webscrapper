"use client";

import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { run } from "../../actions/collect-grades";
import { setStudentGrades } from "@/redux/slices/studentGradesSlice";
import { useDispatch } from "react-redux";
import { StudentGradesType } from "@/types/student-grades/studentGradesTypes";

const formSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

export default function StudentForm() {
  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const [studentGrades, setStudentGrades] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const email = form.getValues().email;
    const password = form.getValues().password;
    const collectedGrades = await run(email, password);
    const formattedGrades = formatGrades(collectedGrades as StudentGradesType);
    dispatch(setStudentGrades(formattedGrades as string));
  };

  function formatGrades(grades: StudentGradesType): string {
    return Object.entries(grades)
      .map(([subject, grade]) => `${subject.replace(" - Honors", "")} ${grade}`)
      .join(" ");
  }
  return (
    <>
      <Form {...form}>
        <form
          action={run} /* TODO: fix type */
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-md w-full flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Student Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Student Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <Button>Fetch Grades</Button>
        </form>
      </Form>
    </>
  );
}
