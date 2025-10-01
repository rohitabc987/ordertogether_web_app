import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Target, Users } from "lucide-react";

const sections = [
  {
    label: "MISSION",
    icon: <Target className="w-8 h-8 text-primary" />,
    title: 'Our Mission',
    description: 'To provide a simple, effective platform that helps people save money on deliveries by easily forming group orders within their local communities, such as apartments, hostels, and college campuses.',
  },
  {
    label: "ABOUT US",
    icon: <Users className="w-8 h-8 text-primary" />,
    title: 'Who We Are',
    description: 'We are a team of students who faced the same problem you do: being just a few rupees short of a free delivery deal. We built OrderlyGather to solve this common frustration for ourselves and others.',
  },
  {
    label: "VALUES",
    icon: <Award className="w-8 h-8 text-primary" />,
    title: 'Our Values',
    description: 'We believe in community, simplicity, and practicality. Our goal is to foster connections and make everyday life a little more affordable and convenient for everyone.',
  },
];

export default function KnowMorePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Our Mission & Vision</h1>
        <p className="text-lg text-muted-foreground mt-2">Connecting communities, one order at a time.</p>
      </div>

      <div className="max-w-[70rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map(section => (
            <Card key={section.label} className="text-center flex flex-col">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  {section.icon}
                </div>
                <div className="text-sm font-bold text-primary">{section.label}</div>
              </CardHeader>
              <CardContent className="py-8">
                <CardTitle className="text-xl mb-2">{section.title}</CardTitle>
                <p className="text-muted-foreground">{section.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
