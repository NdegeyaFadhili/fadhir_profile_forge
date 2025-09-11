import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Reference = Database['public']['Tables']['references']['Row'];

const ReferencesSection = () => {
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const { data, error } = await supabase
          .from('references')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) throw error;
        setReferences(data || []);
      } catch (error) {
        console.error('Error fetching references:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferences();
  }, []);

  if (loading) {
    return (
      <section id="references" className="py-16 bg-muted/50">
        <div className="container mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-center mb-12">References</h2>
          <div className="text-center">Loading references...</div>
        </div>
      </section>
    );
  }

  if (references.length === 0) {
    return (
      <section id="references" className="py-16 bg-muted/50">
        <div className="container mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-center mb-12">References</h2>
          <div className="text-center text-muted-foreground">No references to display yet.</div>
        </div>
      </section>
    );
  }

  return (
    <section id="references" className="py-16 bg-muted/50">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold text-center mb-12">References</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {references.map((ref) => (
            <div key={ref.id} className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{ref.name}</h3>
                  <p className="text-primary font-medium">{ref.title}</p>
                  <p className="text-sm text-muted-foreground">{ref.company}</p>
                </div>
                
                {ref.relationship && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Relationship:</span> {ref.relationship}
                  </p>
                )}

                {ref.recommendation && (
                  <blockquote className="text-sm text-muted-foreground italic border-l-2 border-primary pl-4">
                    "{ref.recommendation}"
                  </blockquote>
                )}

                <div className="space-y-1 text-sm text-muted-foreground">
                  {ref.email && (
                    <p>
                      <span className="font-medium">Email:</span> {ref.email}
                    </p>
                  )}
                  {ref.phone && (
                    <p>
                      <span className="font-medium">Phone:</span> {ref.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReferencesSection;