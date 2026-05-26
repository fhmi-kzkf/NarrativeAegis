'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import RecentAlerts from '@/components/RecentAlerts';
import DashboardEntrance from '@/components/DashboardEntrance';
import { useAudit } from '@/context/AuditContext';

export default function Dashboard() {
  const { auditData, pastAudits, selectAudit, deleteAudit } = useAudit();
  const router = useRouter();

  const handleBrandClick = (id: string) => {
    selectAudit(id);
    router.push('/audit/nexafin');
  };

  const trackedBrands = [];
  if (pastAudits && pastAudits.length > 0) {
    pastAudits.forEach((audit) => {
      trackedBrands.push({
        id: audit.id,
        name: audit.brand,
        avs: audit.avs.overall,
        status: audit.avs.overall >= 70 ? 'Healthy' : audit.avs.overall >= 50 ? 'Warning' : 'Needs attention',
        statusColor: audit.avs.overall >= 70 ? 'text-lime' : audit.avs.overall >= 50 ? 'text-warning' : 'text-danger',
        lastAudited: audit.timestamp ? new Date(audit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' today' : 'Just now',
        icon: '🏦',
        isPrimary: true,
        isMock: false,
      });
    });
  } else {
    trackedBrands.push({
      id: 'mock-nexafin',
      name: 'NexaFin',
      avs: 42,
      status: 'Needs attention',
      statusColor: 'text-danger',
      lastAudited: '2 hours ago',
      icon: '🏦',
      isPrimary: true,
      isMock: true,
    });
    trackedBrands.push({
      id: 'mock-finguard',
      name: 'FinGuard Pro',
      avs: 84,
      status: 'Healthy',
      statusColor: 'text-lime',
      lastAudited: '1 day ago',
      icon: '🛡️',
      isPrimary: false,
      isMock: true,
    });
  }

  const avgAVS = Math.round(trackedBrands.reduce((sum, b) => sum + b.avs, 0) / trackedBrands.length);
  const activeMonitors = trackedBrands.length;
  const criticalPoisonSources = auditData ? (auditData.poisonSources?.length || 0) : 7;

  return (
    <DashboardEntrance>
      <Navbar />

      <main className="flex-1 pt-24 px-6 pb-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-10 animate-fade-in-up">
            <h1 className="text-heading-lg text-ghost text-4xl mb-2">
              Global Dashboard
            </h1>
            <p className="text-body text-ghost/50">
              Overview of your tracked brands and recent AI narrative changes.
            </p>
          </div>

          {/* Top Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="card bg-surface-card border-lime/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <h3 className="text-sm font-medium text-ghost/50 uppercase tracking-wider mb-2">Average Global AVS</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-ghost" style={{ fontFamily: 'var(--font-display)' }}>{avgAVS}</span>
                <span className={`text-sm ${auditData ? 'text-lime' : 'text-danger'} flex items-center gap-1`}>
                  {auditData ? '✓ Active' : '↓ 4.2 points'}
                </span>
              </div>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-ghost/50 uppercase tracking-wider mb-2">Active Monitors</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-ghost" style={{ fontFamily: 'var(--font-display)' }}>{activeMonitors}</span>
                <span className="text-sm text-ghost/40">brands tracked</span>
              </div>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-ghost/50 uppercase tracking-wider mb-2">Critical Poison Sources</h3>
              <div className="flex items-baseline gap-3">
                <span className={`text-5xl font-bold ${criticalPoisonSources > 0 ? 'text-danger' : 'text-lime'}`} style={{ fontFamily: 'var(--font-display)' }}>{criticalPoisonSources}</span>
                <span className="text-sm text-ghost/40">{criticalPoisonSources > 0 ? 'require action' : 'secured'}</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-[1fr_380px] gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            
            {/* Recent Audits List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-heading text-ghost">Tracked Brands</h2>
                <Link href="/audit/new" className="text-sm text-lime hover:underline">
                  + New Audit
                </Link>
              </div>

              {trackedBrands.map((brand) => (
                <div 
                  key={brand.id} 
                  className={`group flex items-center justify-between card p-5 border-ghost/10 hover:border-lime/30 transition-colors cursor-pointer`}
                  onClick={() => {
                    if (brand.isMock) {
                      router.push('/audit/nexafin');
                    } else {
                      handleBrandClick(brand.id);
                    }
                  }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-lime/10`}>
                      {brand.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-ghost group-hover:text-lime transition-colors">
                        {brand.name}
                      </h3>
                      <p className="text-sm text-ghost/50">Last audited: {brand.lastAudited}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${brand.statusColor}`} style={{ fontFamily: 'var(--font-display)' }}>
                        {brand.avs} <span className="text-sm text-ghost/40 font-normal">AVS</span>
                      </div>
                      <p className={`text-xs ${brand.statusColor}`}>{brand.status}</p>
                    </div>
                    
                    {!brand.isMock && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAudit(brand.id);
                        }}
                        className="text-ghost/30 hover:text-danger p-2 transition-colors z-10 rounded-lg hover:bg-danger/10"
                        title="Delete audit from history"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    )}

                    <div className="text-ghost/20 group-hover:text-lime transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar: Recent Alerts */}
            <div>
              <RecentAlerts />
            </div>

          </div>
        </div>
      </main>
    </DashboardEntrance>
  );
}
