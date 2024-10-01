import { Group } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const TestCredentials = () => {
  return (
    <Card className="min-w-[350px] ">
      <CardHeader>
        <CardTitle>Test Credentials</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Email: gloria.peruth@cmsdk12.org</p>
        <p>Password: G26097gg</p>
      </CardContent>
    </Card>
  );
};

export default TestCredentials;
