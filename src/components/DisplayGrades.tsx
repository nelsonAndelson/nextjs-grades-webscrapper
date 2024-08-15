import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSelector } from "react-redux";

export default function DisplayGrades() {

  const studentProfile = useSelector(
    (state: any) => state.studentProfile.studentProfile // TODO: fix type
  );

  function formatNames(student: {
    firstName: string;
    lastName: string;
  }): string {
    const { firstName, lastName } = student;
    if (!student) return "";
    return `${firstName?.charAt(0).toUpperCase() + firstName?.slice(1)} ${
      lastName?.charAt(0).toUpperCase() + lastName?.slice(1)
    }`;
  }

  function formatGrades(grades: any): string {
    //Todo: fix type

    return Object.entries(grades)
      .map(([subject, grade]) => `${subject.replace(" - Honors", "")} ${grade}`)
      .join(" ");
  }

  const formattedNames = studentProfile ? formatNames(studentProfile) : "";
  const formattedGrades = studentProfile
    ? formatGrades(studentProfile?.gradesObject)
    : "";

  const [isCopying, setIsCopying] = React.useState(false);
  const [hasCopied, setHasCopied] = React.useState(false);

  const handleCopy = async (text: string) => {
    setIsCopying(true);
    setHasCopied(false);
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard");
      setHasCopied(true);
    } catch (error) {
      console.error("Failed to copy text: ", error);
      setIsCopying(false);
    } finally {
      setIsCopying(false);
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    }
  };

  if (!studentProfile) return <></>;
  return (
    <Card className={`w-[350px] ${studentProfile ? "" : "hidden"}`}>
      <CardHeader>
        <CardTitle>{formattedNames}</CardTitle>
        <CardDescription>{studentProfile.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <section className="p-2 border border-gray-700 rounded">
          {formattedGrades}
        </section>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Add to spreadsheet</Button>
        <Button
          onClick={() => handleCopy(formattedGrades)}
          disabled={isCopying || hasCopied}
        >
          {isCopying ? "Copying..." : hasCopied ? "Copied!" : "Copy"}
        </Button>
      </CardFooter>
    </Card>
  );
}
