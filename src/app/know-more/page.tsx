import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, Target, Users } from "lucide-react";

export default function KnowMorePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Our Mission & Vision</h1>
        <p className="text-lg text-muted-foreground mt-2">Connecting communities, one order at a time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader className="items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full w-fit">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              To provide a simple, effective platform that helps people save money on deliveries by easily forming group orders within their local communities, such as apartments, hostels, and college campuses.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="items-center text-center">
             <div className="bg-primary/10 p-4 rounded-full w-fit">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Who We Are</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              We are a team of students who faced the same problem you do: being just a few rupees short of a free delivery deal. We built OrderlyGather to solve this common frustration for ourselves and others.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="items-center text-center">
             <div className="bg-primary/10 p-4 rounded-full w-fit">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              We believe in community, simplicity, and practicality. Our goal is to foster connections and make everyday life a little more affordable and convenient for everyone.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
