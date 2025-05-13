
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';

const Analytics = () => {
  return (
    <Layout title="Analytics">
      <Card>
        <CardContent className="flex items-center justify-center min-h-[300px] text-center">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Analytics & Reporting</h2>
            <p className="text-muted-foreground">Track usage, performance metrics, and other insights.</p>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Analytics;
