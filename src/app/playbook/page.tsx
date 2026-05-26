'use client';

import Navbar from '@/components/Navbar';
import Playbook from '@/components/Playbook';
import { useAudit } from '@/context/AuditContext';

export default function PlaybookPage() {
  const { auditData } = useAudit();

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 px-6 pb-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-3">
              <span className="tag tag-success">Global Playbook</span>
              <span className="text-caption text-ghost/40">
                Aggregated Action Items
              </span>
            </div>
            <h1 className="text-heading-lg text-ghost text-4xl mb-2">
              Action Center
            </h1>
            <p className="text-body text-ghost/50">
              Your master list of AI-generated corrective actions across all tracked brands to improve AI Visibility Scores.
            </p>
          </div>
          <Playbook liveData={auditData} />
        </div>
      </main>
    </>
  );
}
