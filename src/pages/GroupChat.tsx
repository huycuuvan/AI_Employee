
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users } from 'lucide-react';

const GroupChat = () => {
  return (
    <Layout title="Group Chat">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 space-y-4 min-h-[200px]">
              <div className="h-12 w-12 rounded-full bg-teampal-100 text-teampal-700 flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold">Chat with Agents</h2>
              <p className="text-muted-foreground text-center">Have a one-on-one conversation with any of your AI agents</p>
              <Link to="/agents/chat">
                <Button className="bg-teampal-500 hover:bg-teampal-600">Start a Chat</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 space-y-4 min-h-[200px]">
              <div className="h-12 w-12 rounded-full bg-teampal-100 text-teampal-700 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold">Group Discussions</h2>
              <p className="text-muted-foreground text-center">Chat with multiple agents simultaneously for complex tasks</p>
              <Button variant="outline">Create Group Chat</Button>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Conversations</h2>
            <div className="text-center text-muted-foreground py-8">
              <p>No recent conversations found.</p>
              <p className="text-sm mt-2">Start a new chat to see it listed here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GroupChat;
