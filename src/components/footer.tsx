import Link from 'next/link';
import { UtensilsCrossed, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-footer">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline text-lg">OrderlyGather</span>
            </div>
            <p className="text-sm text-secondary-foreground">
              Combine small orders, save on delivery fees.
            </p>
          </div>

          {/* Links Sections */}
          <div className="col-span-1 md:col-start-2 md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold font-headline mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-secondary-foreground hover:text-primary">About</Link></li>
                <li><Link href="/pricing" className="text-sm text-secondary-foreground hover:text-primary">Pricing Plan</Link></li>
                <li><Link href="/contact" className="text-sm text-secondary-foreground hover:text-primary">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold font-headline mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/how-it-works" className="text-sm text-secondary-foreground hover:text-primary">How it Works</Link></li>
                <li><Link href="/feedback" className="text-sm text-secondary-foreground hover:text-primary">Give Feedback</Link></li>
                <li><Link href="/know-more" className="text-sm text-secondary-foreground hover:text-primary">Know More</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold font-headline mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/legal/privacy-policy" className="text-sm text-secondary-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/legal/terms-of-service" className="text-sm text-secondary-foreground hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary-foreground">
            © {new Date().getFullYear()} OrderlyGather. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-secondary-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-secondary-foreground hover:text-primary">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-secondary-foreground hover:text-primary">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
