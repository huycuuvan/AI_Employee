
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';

const Settings = () => {
  return (
    <Layout title="Settings">
      <Card>
        <CardContent className="flex items-center justify-center min-h-[300px] text-center">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Settings</h2>
            <p className="text-muted-foreground">Manage your workspace settings, profile, and preferences.</p>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Settings;
