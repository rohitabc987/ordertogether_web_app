import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-semibold text-foreground">1. Agreement to Terms</h2>
          <p>
            By using our application, OrderlyGather, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the application.
          </p>

          <h2 className="text-xl font-semibold text-foreground">2. User Accounts</h2>
          <p>
            When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>
          
          <h2 className="text-xl font-semibold text-foreground">3. User Conduct</h2>
          <div>
            You agree not to use the Service to:
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Violate any local, state, national, or international law.</li>
              <li>Harass, abuse, or harm another person.</li>
              <li>Post any content that is fraudulent, false, misleading, or deceptive.</li>
            </ul>
            We are not responsible for coordinating orders or payments. All transactions and communications are solely between users.
          </div>

          <h2 className="text-xl font-semibold text-foreground">4. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

           <h2 className="text-xl font-semibold text-foreground">5. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at: <a href="mailto:legal@orderlygather.com" className="text-primary hover:underline">legal@orderlygather.com</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
