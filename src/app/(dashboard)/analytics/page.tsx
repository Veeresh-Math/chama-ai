'use client';

import * as React from 'react';
import DashboardLayout from '@/components/dashboard-layout';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-gray-500">
            Cycle performance, contribution health and trust trends across your circles
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
