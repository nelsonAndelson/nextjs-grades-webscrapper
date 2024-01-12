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

export default function DisplayGrades() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Zakaria Mayada</CardTitle>
        <CardDescription>Grade: 11th | I don't know</CardDescription>
      </CardHeader>
      <CardContent>
        <section className="p-2 border border-gray-700 rounded">
          Alg I 92% Art 1 99% Business 83% Citizenship 91% English I 91% Phy Sci
          94% World His 93%
        </section>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Add to spreadsheet</Button>
        <Button>Copy</Button>
      </CardFooter>
    </Card>
  );
}
