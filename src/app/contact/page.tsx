import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Contact Us</CardTitle>
          <CardDescription>
            We'd love to hear from you. Please reach out with any questions or feedback.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full border border-primary/30 mt-1">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-muted-foreground">For general inquiries, support, or feedback.</p>
              <a href="mailto:support@orderlygather.com" className="text-primary hover:underline">
                support@orderlygather.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full border border-primary/30 mt-1">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-muted-foreground">For urgent matters, please call us.</p>
              <a href="tel:+911234567890" className="text-primary hover:underline">
                +91 123 456 7890
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
