import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  region: string;
  preRegister: boolean | null;
  stayInformed: boolean | null;
  newsletter: boolean | null;
}

interface StepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onNext: () => void;
  onBack?: () => void;
}

const LandingStep: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
    <Card className="w-full max-w-2xl shadow-card bg-gradient-subtle border-border">
      <CardContent className="p-12 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-slide-up">
            Join the ThreeFold Ecosystem!
          </h1>
          <p className="text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Take action with 3Phone, 3Browser, or support our mission and stay updated.
          </p>
        </div>
        <Button 
          onClick={onNext}
          size="lg"
          className="gradient-primary shadow-glow hover:shadow-glow transition-smooth text-lg px-12 py-6 animate-scale-in"
          style={{ animationDelay: '0.2s' }}
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  </div>
);

const PersonalInfoStep: React.FC<StepProps> = ({ formData, setFormData, onNext, onBack }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onNext();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md shadow-card bg-gradient-subtle border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl text-center">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="bg-input border-border focus:border-primary"
              />
              {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="bg-input border-border focus:border-primary"
              />
              {errors.lastName && <p className="text-destructive text-sm mt-1">{errors.lastName}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-input border-border focus:border-primary"
              />
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="flex gap-3 pt-4">
              {onBack && (
                <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <Button type="submit" className="flex-1 gradient-primary shadow-glow">
                OK
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const IntroductionStep: React.FC<StepProps> = ({ onNext, onBack }) => (
  <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
    <Card className="w-full max-w-lg shadow-card bg-gradient-subtle border-border">
      <CardContent className="p-8 text-center space-y-6">
        <h2 className="text-2xl font-semibold">Let's find out what you're interested in.</h2>
        <p className="text-muted-foreground text-lg">
          We'll walk you through a couple of quick questions.
        </p>
        <div className="flex gap-3 pt-4">
          {onBack && (
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          <Button onClick={onNext} className="flex-1 gradient-primary shadow-glow">
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

const RegionStep: React.FC<StepProps> = ({ formData, setFormData, onNext, onBack }) => (
  <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
    <Card className="w-full max-w-lg shadow-card bg-gradient-subtle border-border">
      <CardContent className="p-8 text-center space-y-6">
        <h2 className="text-2xl font-semibold">Please select your preferred delivery region for your 3Phone.</h2>
        <div className="space-y-3">
          <Button
            onClick={() => {
              setFormData({ ...formData, region: 'north-america' });
              onNext();
            }}
            variant="outline"
            className="w-full py-6 text-lg hover:gradient-primary hover:border-primary transition-smooth"
          >
            North America
          </Button>
          <Button
            onClick={() => {
              setFormData({ ...formData, region: 'europe' });
              onNext();
            }}
            variant="outline"
            className="w-full py-6 text-lg hover:gradient-primary hover:border-primary transition-smooth"
          >
            Europe/Worldwide
          </Button>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack} className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
      </CardContent>
    </Card>
  </div>
);

const ConditionalMessageStep: React.FC<StepProps> = ({ formData, onNext, onBack }) => {
  const isEurope = formData.region === 'europe';
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-lg shadow-card bg-gradient-subtle border-border">
        <CardContent className="p-8 text-center space-y-6">
          <h2 className="text-2xl font-semibold">Thank you for your interest in 3Phone!</h2>
          <p className="text-muted-foreground text-lg">
            {isEurope 
              ? "For customers in Europe / Worldwide, we invite you to contact info@threefold.io."
              : "For customers in North America, you can place your order with DualCam Era."
            }
          </p>
          <div className="flex gap-3 pt-4">
            {onBack && (
              <Button variant="outline" onClick={onBack} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            <Button onClick={onNext} className="flex-1 gradient-primary shadow-glow">
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const QuestionStep: React.FC<StepProps & { 
  question: string;
  field: 'preRegister' | 'stayInformed' | 'newsletter';
}> = ({ formData, setFormData, onNext, onBack, question, field }) => (
  <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
    <Card className="w-full max-w-lg shadow-card bg-gradient-subtle border-border">
      <CardContent className="p-8 text-center space-y-6">
        <h2 className="text-2xl font-semibold">{question}</h2>
        <div className="space-y-3">
          <Button
            onClick={() => {
              setFormData({ ...formData, [field]: true });
              onNext();
            }}
            variant="outline"
            className="w-full py-6 text-lg hover:gradient-primary hover:border-primary transition-smooth"
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              setFormData({ ...formData, [field]: false });
              onNext();
            }}
            variant="outline"
            className="w-full py-6 text-lg hover:gradient-primary hover:border-primary transition-smooth"
          >
            No
          </Button>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack} className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
      </CardContent>
    </Card>
  </div>
);

const CommunityStep: React.FC<StepProps & { isSubmitting?: boolean }> = ({ onNext, onBack, isSubmitting }) => (
  <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
    <Card className="w-full max-w-lg shadow-card bg-gradient-subtle border-border">
      <CardContent className="p-8 text-center space-y-6">
        <h2 className="text-2xl font-semibold">Be sure to participate in our various online platforms.</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="hover:gradient-primary transition-smooth" asChild>
            <a href="https://t.me/threefold" target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
          </Button>
          <Button variant="outline" className="hover:gradient-primary transition-smooth" asChild>
            <a href="https://discord.gg/threefold" target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          </Button>
          <Button variant="outline" className="hover:gradient-primary transition-smooth" asChild>
            <a href="https://twitter.com/threefold_io" target="_blank" rel="noopener noreferrer">
              X (Twitter)
            </a>
          </Button>
          <Button variant="outline" className="hover:gradient-primary transition-smooth" asChild>
            <a href="https://youtube.com/@threefold" target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
          </Button>
        </div>
        <div className="flex gap-3 pt-4">
          {onBack && (
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          <Button 
            onClick={onNext} 
            className="flex-1 gradient-primary shadow-glow"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
            <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ThankYouStep: React.FC<{ onReturnHome: () => void }> = ({ onReturnHome }) => (
  <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
    <Card className="w-full max-w-lg shadow-card bg-gradient-subtle border-border">
      <CardContent className="p-8 text-center space-y-6">
        <div className="mb-6">
          <CheckCircle className="mx-auto h-16 w-16 text-secondary mb-4 animate-scale-in" />
          <h2 className="text-3xl font-bold text-secondary">Thank you for joining us!</h2>
        </div>
        <p className="text-muted-foreground text-lg">
          We'll keep you updated with the latest news and opportunities.
        </p>
        <Button onClick={onReturnHome} className="w-full gradient-primary shadow-glow py-6 text-lg">
          Return to Home
        </Button>
      </CardContent>
    </Card>
  </div>
);

export const ThreeFoldForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    region: "",
    preRegister: null,
    stayInformed: null,
    newsletter: null,
  });

  const handleSubmitForm = async () => {
    setIsSubmitting(true);
    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('user_responses')
        .insert({
          full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          interests: [
            formData.region,
            ...(formData.preRegister ? ['pre-register'] : []),
            ...(formData.stayInformed ? ['stay-informed'] : []),
            ...(formData.newsletter ? ['newsletter'] : [])
          ].filter(Boolean)
        });

      if (dbError) {
        console.error('Error submitting form:', dbError);
        toast({
          title: "Error",
          description: "Failed to submit form. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Send emails
      const { error: emailError } = await supabase.functions.invoke('send-emails', {
        body: {
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          interests: [
            formData.region,
            ...(formData.preRegister ? ['pre-register'] : []),
            ...(formData.stayInformed ? ['stay-informed'] : []),
            ...(formData.newsletter ? ['newsletter'] : [])
          ].filter(Boolean)
        }
      });

      if (emailError) {
        console.error('Error sending emails:', emailError);
        // Still show success since data was saved, but mention email issue
        toast({
          title: "Submitted Successfully",
          description: "Your information was saved, but there was an issue sending confirmation emails.",
        });
      } else {
        toast({
          title: "Success!",
          description: "Your information has been submitted and confirmation emails have been sent.",
        });
      }
      
      setStep(9);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    () => <LandingStep onNext={() => setStep(1)} />,
    () => (
      <PersonalInfoStep
        formData={formData}
        setFormData={setFormData}
        onNext={() => setStep(2)}
        onBack={() => setStep(0)}
      />
    ),
    () => (
      <IntroductionStep
        formData={formData}
        setFormData={setFormData}
        onNext={() => setStep(3)}
        onBack={() => setStep(1)}
      />
    ),
    () => (
      <RegionStep
        formData={formData}
        setFormData={setFormData}
        onNext={() => setStep(4)}
        onBack={() => setStep(2)}
      />
    ),
    () => (
      <ConditionalMessageStep
        formData={formData}
        setFormData={setFormData}
        onNext={() => setStep(5)}
        onBack={() => setStep(3)}
      />
    ),
    () => (
      <QuestionStep
        formData={formData}
        setFormData={setFormData}
        onNext={() => setStep(6)}
        onBack={() => setStep(4)}
        question="Would you like to pre-register for the 3Phone? Pre-registration is required before production starts."
        field="preRegister"
      />
    ),
    () => (
      <QuestionStep
        formData={formData}
        setFormData={setFormData}
        onNext={() => setStep(7)}
        onBack={() => setStep(5)}
        question="Would you like to be informed about new devices, software releases, and upcoming initiatives for the 3Phone ecosystem?"
        field="stayInformed"
      />
    ),
    () => (
      <QuestionStep
        formData={formData}
        setFormData={setFormData}
        onNext={() => setStep(8)}
        onBack={() => setStep(6)}
        question="Would you like to join our general newsletter for project updates?"
        field="newsletter"
      />
    ),
    () => (
      <CommunityStep
        formData={formData}
        setFormData={setFormData}
        onNext={() => handleSubmitForm()}
        onBack={() => setStep(7)}
        isSubmitting={isSubmitting}
      />
    ),
    () => <ThankYouStep onReturnHome={() => setStep(0)} />,
  ];

  return <div className="bg-background">{steps[step]()}</div>;
};