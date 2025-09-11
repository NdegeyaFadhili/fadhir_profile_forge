import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Certificate = Database['public']['Tables']['certificates']['Row'];

const CertificatesSection = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) throw error;
        setCertificates(data || []);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <section id="certificates" className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Certificates</h2>
          <div className="text-center">Loading certificates...</div>
        </div>
      </section>
    );
  }

  if (certificates.length === 0) {
    return (
      <section id="certificates" className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Certificates</h2>
          <div className="text-center text-muted-foreground">No certificates to display yet.</div>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="py-16">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Certificates</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <div key={cert.id} className="rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {cert.image_url && (
                <img 
                  src={cert.image_url} 
                  alt={cert.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-semibold">{cert.title}</h3>
                <p className="text-primary font-medium">{cert.issuer}</p>
                <div className="text-sm text-muted-foreground">
                  <p>Issued: {formatDate(cert.issue_date)}</p>
                  {cert.expiry_date && (
                    <p>Expires: {formatDate(cert.expiry_date)}</p>
                  )}
                  {cert.credential_id && (
                    <p>ID: {cert.credential_id}</p>
                  )}
                </div>
                {cert.credential_url && (
                  <a 
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-primary hover:underline"
                  >
                    View Credential
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;