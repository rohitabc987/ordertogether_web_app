import Link from 'next/link';
import { UtensilsCrossed, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline text-lg">OrderlyGather</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Combine small orders, save on delivery fees.
            </p>
          </div>

          {/* Links Sections */}
          <div className="col-span-1 md:col-start-2 md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold font-headline mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing Plan</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold font-headline mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/about#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">How it Works</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Give Feedback</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Know More</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold font-headline mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OrderlyGather. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
