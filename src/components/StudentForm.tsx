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
import { useDispatch } from "react-redux";
import { setStudentProfile } from "@/redux/slices/studentProfileSlice";
import { useState } from "react";

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

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const email = form.getValues().email;
    const password = form.getValues().password;

    try {
      const studentProfile = await run(email, password);
      dispatch(setStudentProfile(studentProfile as any));
      form.reset();
    } catch (error) {
      console.error("Error fetching student profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          action={run} /* TODO: fix type */
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-md w-full flex flex-col gap-4 "
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Student Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email" disabled={loading} />
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
                    <Input
                      {...field}
                      type="password"
                      placeholder="Password"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <Button disabled={loading}>
            {loading ? "Loading..." : "Fetch Grades"}
          </Button>
        </form>
      </Form>
    </>
  );
}
