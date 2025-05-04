import { useState } from 'react';
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import CardBox from "../../shared/CardBox";
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

const ContactForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!firstName || !lastName || !email) {
      toast.error('Please fill in all required fields (*).');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: email,
          message: message || null,
          status: 'new'
        });

      if (error) {
        throw error;
      }

      toast.success('Message sent successfully! We will get back to you soon.');
      setFirstName('');
      setLastName('');
      setEmail('');
      setMessage('');

    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast.error(`Failed to send message: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="container-1218 mx-auto mt-30">
        <div className="grid grid-cols-12 lg:gap-30 gap-6">
          <div className="lg:col-span-4 col-span-12">
            <div className="overflow-hidden rounded-lg bg-primary relative p-6 md:p-8 h-full flex flex-col justify-center after:absolute after:content-[''] after:bg-[url('/src/assets/images/front-pages/background/contact-icon.png')] after:bg-no-repeat after:bg-right-top after:top-0 after:right-0   after:w-[325px] after:h-[325px] after:opacity-20">
              <h5 className="text-xl font-bold text-white pb-3 relative z-10">
                Reach Out Today
              </h5>
              <p className="text-base text-white leading-relaxed relative z-10">
                Have questions or need assistance? Fill out the form and we'll get back to you as soon as possible.
              </p>
            </div>
          </div>
          <div className="lg:col-span-8 col-span-12">
            <CardBox>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-12 lg:gap-6 gap-4">
                  <div className="col-span-12">
                    <div className="mb-2 block">
                      <Label htmlFor="nm" value="First Name *" />
                    </div>
                    <TextInput
                      id="nm"
                      type="text"
                      placeholder="First Name"
                      required
                      className="form-control"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-span-12">
                    <div className="mb-2 block">
                      <Label htmlFor="lnm" value="Last Name *" />
                    </div>
                    <TextInput
                      id="lnm"
                      type="text"
                      placeholder="Last Name"
                      required
                      className="form-control"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-span-12">
                    <div className="mb-2 block">
                      <Label htmlFor="em" value="Email *" />
                    </div>
                    <TextInput
                      id="em"
                      type="email"
                      placeholder="Email address"
                      required
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-span-12">
                    <div className="mb-2 block">
                      <Label htmlFor="msg" value="Message" />
                    </div>
                    <Textarea
                      id="msg"
                      placeholder="Write your message here..."
                      className="form-control-textarera rounded-md"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-span-12">
                    <div className="block ">
                      <Button type="submit" color={"primary"} className="sm:w-auto w-full ms-auto" disabled={isSubmitting} isProcessing={isSubmitting}>
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </CardBox>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
