import React from "react";

const Navigation = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        <div className="font-semibold">Ihirwe Portfolio</div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="#home" className="hover:text-primary">Home</a>
          <a href="#about" className="hover:text-primary">About</a>
          <a href="#projects" className="hover:text-primary">Projects</a>
          <a href="#certificates" className="hover:text-primary">Certificates</a>
          <a href="#references" className="hover:text-primary">References</a>
          <a href="#contact" className="hover:text-primary">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;