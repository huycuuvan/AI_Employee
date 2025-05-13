
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';

const Tasks = () => {
  return (
    <Layout title="Tasks">
      <Card>
        <CardContent className="flex items-center justify-center min-h-[300px] text-center">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Tasks Management</h2>
            <p className="text-muted-foreground">Create, assign, and track tasks for your team and agents.</p>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Tasks;
