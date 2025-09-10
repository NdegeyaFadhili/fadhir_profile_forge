import React from "react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 bg-muted/50">
      <div className="container mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Get In Touch</h2>
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3 text-muted-foreground">
                <p className="flex items-center gap-3">
                  <span className="font-medium">Email:</span> ihirwe@example.com
                </p>
                <p className="flex items-center gap-3">
                  <span className="font-medium">Phone:</span> +250 XXX XXX XXX
                </p>
                <p className="flex items-center gap-3">
                  <span className="font-medium">Location:</span> Gisozi, Kigali, Rwanda
                </p>
                <p className="flex items-center gap-3">
                  <span className="font-medium">LinkedIn:</span> 
                  <a href="#" className="text-primary hover:underline">linkedin.com/in/ihirwe</a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="font-medium">GitHub:</span> 
                  <a href="#" className="text-primary hover:underline">github.com/ihirwe</a>
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Send a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Message subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;