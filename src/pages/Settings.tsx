import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Settings = () => {
  const [tab, setTab] = useState('brand');
  return (
    <Layout title="Workspace Settings">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Tabs defaultValue="brand" value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="brand">BRAND</TabsTrigger>
            <TabsTrigger value="member">MEMBER</TabsTrigger>
            <TabsTrigger value="plan">PLAN</TabsTrigger>
            <TabsTrigger value="billing">BILLING</TabsTrigger>
          </TabsList>
          <TabsContent value="brand">
            <Card className="p-8 mb-8">
              <h2 className="text-xl font-semibold mb-6">Brand information</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Brand name</label>
                  <Input defaultValue="AI automation" maxLength={50} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Business type</label>
                  <Input defaultValue="education" maxLength={50} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Language</label>
                  <select className="w-full border rounded px-3 py-2">
                    <option>Tiếng Việt</option>
                    <option>English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <select className="w-full border rounded px-3 py-2">
                    <option>Vietnam</option>
                    <option>USA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL - Website, fanpage... (Optional)</label>
                  <Input placeholder="www.example.com" maxLength={155} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Brand description</label>
                  <textarea className="w-full border rounded px-3 py-2 min-h-[60px]" defaultValue="khóa học" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Brand products / services (Optional)</label>
                  <textarea className="w-full border rounded px-3 py-2 min-h-[60px]" defaultValue="khóa học" />
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <Button variant="outline" disabled>Save</Button>
                  <Button disabled>Save & personalize</Button>
                </div>
              </form>
            </Card>
            <Card className="p-8">
              <h2 className="text-xl font-semibold mb-6">Brand identity</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Brand logo <span className="text-xs text-muted-foreground">(Optional, Recommend: 128px x 128px)</span></label>
                <Button variant="outline">Upload</Button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Brand cover <span className="text-xs text-muted-foreground">(Optional, Recommend: 800px x 256px)</span></label>
                <Button variant="outline">Upload</Button>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="member">
            <Card className="p-8">Member management coming soon...</Card>
          </TabsContent>
          <TabsContent value="plan">
            <Card className="p-8">Plan management coming soon...</Card>
          </TabsContent>
          <TabsContent value="billing">
            <Card className="p-8">Billing management coming soon...</Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
