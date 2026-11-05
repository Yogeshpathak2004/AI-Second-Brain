import React, { useEffect, useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { memoryService } from '../../services/memoryService';

export const Layout: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'healthy' | 'offline' | 'checking'>('checking');
  const [totalMemories, setTotalMemories] = useState<number>(0);
  const location = useLocation();

  const fetchHealth = useCallback(async () => {
    try {
      const data = await memoryService.getHealth();
      if (data.status === 'healthy') {
        setBackendStatus('healthy');
        setTotalMemories(data.total_memories);
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    // Poll health status every 15 seconds
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  // Re-fetch on navigation changes (e.g., after adding or deleting memory)
  useEffect(() => {
    fetchHealth();
  }, [location.pathname, fetchHealth]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar memoryCount={totalMemories} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header backendStatus={backendStatus} totalMemories={totalMemories} />
        <main className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
          <div className="max-w-6xl mx-auto">
            <Outlet context={{ refreshGlobalStats: fetchHealth, totalMemories }} />
          </div>
        </main>
      </div>
    </div>
  );
};

