import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Ihirwe Ndegeya Fadhiri | Professional Portfolio</title>
        <meta name="description" content="Professional portfolio of Ihirwe Ndegeya Fadhiri: projects, experience, certificates, and references." />
        <link rel="canonical" href={`${window.location.origin}/`} />
      </Helmet>

      <section className="container mx-auto grid max-w-5xl gap-8 px-6 py-24 md:grid-cols-2 md:py-32">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Ihirwe Ndegeya Fadhiri</h1>
          <p className="text-lg text-muted-foreground">Software Developer • Kigali, Rwanda</p>
          <p className="text-muted-foreground">
            Building reliable, user-focused software. Explore selected projects, certifications, and professional
            experience.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="#projects">View Projects</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/auth">Owner Login</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-2xl font-semibold">Highlights</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Clean, modern, responsive UI</li>
            <li>Project gallery with GitHub and demo links</li>
            <li>Certificates and professional references</li>
            <li>Secure owner-only editing</li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default Index;

