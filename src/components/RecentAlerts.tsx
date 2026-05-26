'use client';

export interface DeltaAlert {
  id: string;
  type: 'drop' | 'spike' | 'new_source';
  severity: 'critical' | 'warning' | 'info';
  metric: string;
  brand: string;
  change: string;
  title: string;
  market: string;
  description: string;
  timestamp: string;
}

const mockAlerts: DeltaAlert[] = [
  {
    id: 'a1',
    type: 'drop',
    severity: 'critical',
    metric: 'AVS',
    brand: 'NexaFin',
    change: '-8 pts',
    title: 'NexaFin AVS Drop',
    market: 'US',
    description: 'Significant AVS drop due to new negative AI Overview in US market.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a2',
    type: 'new_source',
    severity: 'critical',
    metric: 'Poison Source',
    brand: 'NexaFin',
    change: 'New',
    title: 'New Poison Source Detected',
    market: 'US',
    description: 'TechAudit Weekly article cited in 72% of security queries.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a3',
    type: 'spike',
    severity: 'warning',
    metric: 'Competitor SOV',
    brand: 'FinGuard Pro',
    change: '+12%',
    title: 'FinGuard Pro SOV Spike',
    market: 'DE',
    description: 'FinGuard Pro is now recommended over NexaFin in EU markets.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

function getSeverityStyles(severity: DeltaAlert['severity']) {
  switch (severity) {
    case 'critical':
      return { dot: '#ff4d4d', bg: 'rgba(255, 77, 77, 0.08)', border: 'rgba(255, 77, 77, 0.2)' };
    case 'warning':
      return { dot: '#ffc412', bg: 'rgba(255, 196, 18, 0.08)', border: 'rgba(255, 196, 18, 0.2)' };
    case 'info':
      return { dot: '#478bff', bg: 'rgba(71, 139, 255, 0.08)', border: 'rgba(71, 139, 255, 0.2)' };
  }
}

function getTypeIcon(type: DeltaAlert['type']): string {
  switch (type) {
    case 'drop': return '📉';
    case 'spike': return '📈';
    case 'new_source': return '🔗';
    default: return '🔔';
  }
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}

export default function RecentAlerts() {
  return (
    <div className="card" id="recent-alerts">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-heading-lg text-ghost">Delta Alerts</h2>
          <p className="text-caption text-ghost/40 mt-1">
            24-hour narrative changes detected
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-danger" />
          </span>
          <span className="text-caption text-danger font-medium">
            {mockAlerts.filter((a) => a.severity === 'critical').length} critical
          </span>
        </div>
      </div>

      <div className="space-y-2 stagger-children">
        {mockAlerts.map((alert) => {
          const styles = getSeverityStyles(alert.severity);

          return (
            <div
              key={alert.id}
              className="flex items-start gap-4 p-4 rounded-xl transition-all duration-200 hover:bg-ghost/[0.03] cursor-pointer"
              style={{
                border: `1px solid ${styles.border}`,
                background: styles.bg,
              }}
              id={`alert-${alert.id}`}
            >
              {/* Timeline Dot */}
              <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: styles.dot, boxShadow: `0 0 8px ${styles.dot}40` }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{getTypeIcon(alert.type)}</span>
                  <h3 className="text-sm font-medium text-ghost/90 truncate">
                    {alert.title}
                  </h3>
                </div>
                <p className="text-sm text-ghost/50 line-clamp-2">
                  {alert.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="tag tag-neutral text-xs">{alert.market}</span>
                  <span className="text-caption text-ghost/30">
                    {formatTimeAgo(alert.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
