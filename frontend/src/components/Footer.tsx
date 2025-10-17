import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail, Instagram, Heart } from 'lucide-react';
import logoPlaceholder from '@/assets/logo-placeholder.jpg';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Products', href: '#products' },
    { name: 'Testimonial', href: '#testimonial' },
    { name: 'Contact', href: '#contact' },
  ];

  const productCategories = [
    'Straight Hair',
    'Curly Hair',
    'Body Wave',
    'Deep Wave',
    'Kinky Straight',
    'Water Wave',
  ];

  const socialLinks = [
    { icon: MessageCircle, href: 'https://wa.me/15551234567', label: 'WhatsApp' },
    { icon: Instagram, href: 'https://instagram.com/faridaabdulhair', label: 'Instagram' },
    { icon: Phone, href: 'tel:+15551234567', label: 'Phone' },
    { icon: Mail, href: 'mailto:hello@faridaabdulhair.com', label: 'Email' },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <img 
                src={logoPlaceholder} 
                alt="Farida Abdul Hair Logo" 
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-luxury font-bold text-gradient-gold mb-2">
                Farida Abdul Hair
              </h3>
              <p className="text-secondary-foreground/80 font-elegant text-sm leading-relaxed">
                Premium 100% human hair extensions and raw donor hair. 
                Transform your look with our luxury collection.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="sm"
                  className="hover-gold p-2 h-auto"
                  onClick={() => window.open(social.href, '_blank')}
                >
                  <social.icon className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-elegant font-bold text-secondary-foreground mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-secondary-foreground/80 hover-gold transition-colors font-elegant text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="font-elegant font-bold text-secondary-foreground mb-6">
              Hair Types
            </h4>
            <ul className="space-y-3">
              {productCategories.map((category) => (
                <li key={category}>
                  <a
                    href="#products"
                    className="text-secondary-foreground/80 hover-gold transition-colors font-elegant text-sm"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-elegant font-bold text-secondary-foreground mb-6">
              Contact Info
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-secondary-foreground/80 font-elegant text-sm mb-1">
                  WhatsApp & Phone
                </p>
                <a 
                  href="https://wa.me/233500017587"
                  className="text-primary hover-gold font-medium text-sm"
                >
                  +233 500 017587
                </a>
              </div>
              
              <div>
                <p className="text-secondary-foreground/80 font-elegant text-sm mb-1">
                  Email
                </p>
                <a 
                  href="mailto:hello@faridaabdulhair.com"
                  className="text-primary hover-gold font-medium text-sm"
                >
                  hello@faridaabdulhair.com
                </a>
              </div>

              <div>
                <p className="text-secondary-foreground/80 font-elegant text-sm mb-1">
                  Business Hours
                </p>
                <p className="text-secondary-foreground/80 font-elegant text-sm">
                  Mon-Sat: 9AM-8PM<br />
                  Sun: Closed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-secondary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-secondary-foreground/80 font-elegant text-sm">
                © 2025 Farida Abdul Hair. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-1 text-secondary-foreground/80 font-elegant text-sm">
             
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;