import React from "react";

const ProjectsSection = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with React, Node.js, and PostgreSQL",
      image: "https://via.placeholder.com/400x250",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      githubUrl: "#",
      demoUrl: "#"
    },
    {
      title: "Task Management App",
      description: "Collaborative task management with real-time updates",
      image: "https://via.placeholder.com/400x250",
      technologies: ["React", "Firebase", "Tailwind"],
      githubUrl: "#",
      demoUrl: "#"
    },
    {
      title: "Weather Dashboard",
      description: "Weather forecasting app with location-based services",
      image: "https://via.placeholder.com/400x250",
      technologies: ["React", "OpenWeather API", "Chart.js"],
      githubUrl: "#",
      demoUrl: "#"
    }
  ];

  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div key={index} className="rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="text-muted-foreground text-sm">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <a href={project.githubUrl} className="text-sm text-primary hover:underline">
                    GitHub
                  </a>
                  <a href={project.demoUrl} className="text-sm text-primary hover:underline">
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;