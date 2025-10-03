
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
          <p>Last updated: {lastUpdated}</p>
          
          <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
          <p>
            Welcome to OrderlyGather. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
          </p>

          <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
          <div>
            We may collect information about you in a variety of ways. The information we may collect on the App includes:
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the App.</li>
              <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the App, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the App.</li>
            </ul>
          </div>

          <h2 className="text-xl font-semibold text-foreground">3. Use of Your Information</h2>
          <div>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the App to:
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Create and manage your account.</li>
              <li>Enable user-to-user communications.</li>
              <li>Email you regarding your account or order.</li>
              <li>Increase the efficiency and operation of the App.</li>
            </ul>
          </div>

          <h2 className="text-xl font-semibold text-foreground">4. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@orderlygather.com" className="text-primary hover:underline">privacy@orderlygather.com</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
