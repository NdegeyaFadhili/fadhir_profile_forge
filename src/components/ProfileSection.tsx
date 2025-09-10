import React from "react";

const ProfileSection = () => {
  return (
    <section id="about" className="py-16 bg-muted/50">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <div className="mx-auto h-48 w-48 rounded-full bg-gradient-to-br from-primary to-secondary md:mx-0"></div>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">About Me</h2>
              <p className="text-muted-foreground leading-relaxed">
                Passionate software developer with expertise in modern web technologies. 
                I focus on creating clean, efficient, and user-friendly applications that solve real-world problems.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>📍 Gisozi, Kigali, Rwanda</p>
                <p>📧 ihirwe@example.com</p>
                <p>📱 +250 XXX XXX XXX</p>
                <p>💼 LinkedIn: linkedin.com/in/ihirwe</p>
                <p>💻 GitHub: github.com/ihirwe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;