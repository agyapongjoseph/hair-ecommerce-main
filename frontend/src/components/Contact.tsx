import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MessageCircle, Instagram, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Chat with us instantly',
      value: '+233 500 017587',
      action: () => window.open('https://wa.me/233500017587', '_blank'),
      primary: true,
    },
    {
      icon: Phone,
      title: 'Phone Call',
      description: 'Speak with our team',
      value: '+233 500 017587',
      action: () => window.location.href = 'tel:+233500017587',
      primary: false,
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Send us a message',
      value: 'hello@faridaabdulhair.com',
      action: () => window.open('mailto:hello@faridaabdulhair.com'),
      primary: false,
    },
    {
      icon: Instagram,
      title: 'Instagram',
      description: 'Follow our journey',
      value: '@farida_abdulhair',
      action: () => window.open('https://www.instagram.com/farida_abdulhair/', '_blank'),
      primary: false,
    },
  ];

  const businessInfo = [
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Sat: 9:00 AM - 8:00 PM', 'Sun: Closed'],
    },
    {
      icon: MapPin,
      title: 'Service Areas',
      details: ['Worldwide Shipping', 'Express Delivery Available', 'Local Pickup Options', 'Center Point Mall'],
    },
  ];

  const paymentMethods = [
    {
      name: 'Bank Transfer',
      description: 'Secure bank-to-bank transfer',
      icon: '🏦',
      available: true,
    },
    {
      name: 'Mobile Money',
      description: 'MTN, Vodafone, AirtelTigo',
      icon: '📱',
      available: true,
    },
  ];

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary hover:bg-primary/20">
            Get in Touch
          </Badge>
          <h2 className="text-3xl md:text-5xl font-luxury font-bold mb-6 text-foreground">
            Contact <span className="text-gradient-gold">Us</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-elegant">
            Ready to transform your look? Get in touch with us through your preferred method.
            We're here to help you find the perfect hair for your style.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-luxury font-bold mb-8 text-foreground">
              How to Reach Us
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {contactMethods.map((method, index) => (
                <Card 
                  key={method.title}
                  className={`group overflow-hidden border-0 shadow-card hover-lift cursor-pointer transition-all duration-300 animate-scale-in ${
                    method.primary ? 'bg-primary/5 border border-primary/20' : 'bg-card'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={method.action}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${
                        method.primary 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground'
                      } group-hover:scale-110 transition-transform`}>
                        <method.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-elegant font-bold text-card-foreground">
                            {method.title}
                          </h4>
                          {method.primary && (
                            <Badge className="bg-primary text-primary-foreground text-xs">
                              Fastest
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {method.description}
                        </p>
                        <p className="text-sm font-medium text-primary">
                          {method.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="mt-12">
              <h3 className="text-2xl font-luxury font-bold mb-8 text-foreground">
                Payment Methods
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {paymentMethods.map((method, index) => (
                  <Card 
                    key={method.name}
                    className="group overflow-hidden border-0 shadow-card hover-lift animate-scale-in"
                    style={{ animationDelay: `${(index + 4) * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{method.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-elegant font-bold text-card-foreground mb-1">
                            {method.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                        <Badge 
                          variant={method.available ? "default" : "secondary"}
                          className={method.available ? "bg-green-500 text-white" : ""}
                        >
                          {method.available ? 'Available' : 'Coming Soon'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-luxury font-bold mb-8 text-foreground">
              Business Information
            </h3>
            <div className="space-y-6">
              {businessInfo.map((info, index) => (
                <Card 
                  key={info.title}
                  className="border-0 shadow-card bg-card animate-scale-in"
                  style={{ animationDelay: `${(index + 6) * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-secondary text-secondary-foreground">
                        <info.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-elegant font-bold text-card-foreground mb-3">
                          {info.title}
                        </h4>
                        <div className="space-y-1">
                          {info.details.map((detail, i) => (
                            <p key={i} className="text-sm text-muted-foreground">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Quick Contact CTA */}
              <Card className="border-0 shadow-card bg-gradient-gold animate-scale-in" style={{ animationDelay: '0.8s' }}>
                <CardContent className="p-6 text-center">
                  <h4 className="font-luxury font-bold text-primary-foreground mb-2 text-lg">
                    Ready to Order?
                  </h4>
                  <p className="text-sm text-primary-foreground/80 mb-4">
                    Get instant support on WhatsApp
                  </p>
                  <Button 
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-elegant font-bold"
                    onClick={() => window.open('https://wa.me/+233500017587', '_blank')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;