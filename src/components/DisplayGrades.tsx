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

export default function DisplayGrades(props) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Zakaria Mayada</CardTitle>
        <CardDescription>Grade: 11th | I don't know</CardDescription>
      </CardHeader>
      <CardContent>
        <section className="p-2 border border-gray-700 rounded">
          {props.studentGrades}
        </section>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Add to spreadsheet</Button>
        <Button>Copy</Button>
      </CardFooter>
    </Card>
  );
}
