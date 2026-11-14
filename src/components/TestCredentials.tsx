import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
} from "../../utils/mockPortal/mockPortal";

const TestCredentials = () => {
  return (
    <Card className="min-w-[350px] max-w-md">
      <CardHeader>
        <CardTitle>Test Credentials</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 text-sm">
        <p>Email: {DEMO_EMAIL}</p>
        <p>Password: {DEMO_PASSWORD}</p>
        <p className="mt-2 text-muted-foreground">
          Any <code>first.last@demo-school.edu</code> email works. The scraper
          logs into a{" "}
          <Link href="/mock-portal/login" target="_blank" className="underline">
            demo school portal
          </Link>{" "}
          with a headless browser and reads the gradebook.
        </p>
      </CardContent>
    </Card>
  );
};

export default TestCredentials;
