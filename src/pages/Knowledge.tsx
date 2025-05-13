
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BookOpen, Database, User, Users } from 'lucide-react';

const Knowledge = () => {
  return (
    <Layout title="Knowledge Base">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Tabs defaultValue="knowledge" className="w-full">
            <TabsList className="w-full md:w-auto mb-6">
              <TabsTrigger value="knowledge" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Tri thức</span>
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Cơ sở dữ liệu</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="knowledge" className="space-y-6">
              {/* Personal Knowledge */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4 gap-2">
                    <User className="h-5 w-5 text-teampal-500" />
                    <h2 className="text-xl font-semibold">Tri thức cá nhân</h2>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-6 text-center">
                    <p className="text-muted-foreground mb-4">Upload files for your personal knowledge base.</p>
                    <button className="bg-teampal-500 hover:bg-teampal-600 text-white px-4 py-2 rounded-md">
                      Upload Files
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Business Knowledge */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4 gap-2">
                    <Users className="h-5 w-5 text-teampal-500" />
                    <h2 className="text-xl font-semibold">Tri thức doanh nghiệp</h2>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-6 text-center">
                    <p className="text-muted-foreground mb-4">Upload files for your business or organization.</p>
                    <button className="bg-teampal-500 hover:bg-teampal-600 text-white px-4 py-2 rounded-md">
                      Upload Files
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="database">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4 gap-2">
                    <Database className="h-5 w-5 text-teampal-500" />
                    <h2 className="text-xl font-semibold">Cơ sở dữ liệu</h2>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-6 text-center">
                    <p className="text-muted-foreground mb-4">Connect and manage your databases here.</p>
                    <button className="bg-teampal-500 hover:bg-teampal-600 text-white px-4 py-2 rounded-md">
                      Connect Database
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Knowledge;
