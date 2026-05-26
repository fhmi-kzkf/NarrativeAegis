'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuditContextType {
  auditData: any | null;
  pastAudits: any[];
  isLoading: boolean;
  error: string | null;
  runAudit: (brand: string, competitors?: string[], markets?: any[]) => Promise<void>;
  selectAudit: (id: string) => void;
  deleteAudit: (id: string) => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const [auditData, setAuditData] = useState<any | null>(null);
  const [pastAudits, setPastAudits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on client-side mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('narrative_shield_history');
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        setPastAudits(parsed);
        
        // Restore the last active audit if it exists
        const lastActiveId = localStorage.getItem('narrative_shield_active_id');
        if (lastActiveId) {
          const active = parsed.find((a: any) => a.id === lastActiveId);
          if (active) setAuditData(active);
        } else if (parsed.length > 0) {
          setAuditData(parsed[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load audit history from localStorage:', err);
    }
  }, []);

  const runAudit = async (brand: string, competitors?: string[], markets?: any[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, competitors, markets }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to run audit');
      }
      
      const data = await response.json();
      const auditId = `audit-${Date.now()}`;
      const newAuditRecord = {
        ...data,
        id: auditId,
      };

      // Add to past audits (replace duplicate brand name to keep it clean)
      setPastAudits(prev => {
        const filtered = prev.filter((a: any) => a.brand.toLowerCase() !== brand.toLowerCase());
        const updated = [newAuditRecord, ...filtered];
        localStorage.setItem('narrative_shield_history', JSON.stringify(updated));
        return updated;
      });

      setAuditData(newAuditRecord);
      localStorage.setItem('narrative_shield_active_id', auditId);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const selectAudit = (id: string) => {
    const active = pastAudits.find((a: any) => a.id === id);
    if (active) {
      setAuditData(active);
      localStorage.setItem('narrative_shield_active_id', id);
    }
  };

  const deleteAudit = (id: string) => {
    setPastAudits(prev => {
      const updated = prev.filter((a: any) => a.id !== id);
      localStorage.setItem('narrative_shield_history', JSON.stringify(updated));
      
      if (auditData?.id === id) {
        if (updated.length > 0) {
          setAuditData(updated[0]);
          localStorage.setItem('narrative_shield_active_id', updated[0].id);
        } else {
          setAuditData(null);
          localStorage.removeItem('narrative_shield_active_id');
        }
      }
      return updated;
    });
  };

  return (
    <AuditContext.Provider value={{ auditData, pastAudits, isLoading, error, runAudit, selectAudit, deleteAudit }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (context === undefined) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
}
