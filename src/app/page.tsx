"use client";
import { Provider } from "react-redux";
import store from "@/redux/store";

import StudentForm from "@/components/StudentForm";
import TestCredentials from "@/components/TestCredentials";
import DisplayGrades from "@/components/DisplayGrades";

export default function page() {
  return (
    <Provider store={store}>
      <main className="flex min-h-screen flex-col gap-6 items-center justify-center p-24">
        <TestCredentials />
        <StudentForm />
        <DisplayGrades />
      </main>
    </Provider>
  );
}
