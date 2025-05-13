import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Settings, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const user = {
  name: 'Huy',
  email: 'ndhuy0904@gmail.com',
  password: '********',
};

const workspaces = [
  {
    name: 'AI automation',
    members: 0,
    plan: 'B2B Trial',
  },
];

const Profile = () => {
  return (
    <Layout title="Profile">
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-semibold mb-6">Hello, {user.name}</h2>
        <Card className="flex items-center gap-8 p-8 mb-8">
          <div className="w-32 h-32 rounded-full bg-teal-100 flex items-center justify-center text-5xl font-bold text-teal-600">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <div className="mb-2"><span className="font-semibold">Name:</span> {user.name}</div>
              <div className="mb-2"><span className="font-semibold">Email:</span> {user.email}</div>
              <div className="mb-2"><span className="font-semibold">Password:</span> {user.password}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline"><span className="mr-2">✏️</span>Edit</Button>
              <Button variant="outline"><span className="mr-2">🔒</span>Change password</Button>
            </div>
          </div>
        </Card>
        <div className="mb-2 text-lg font-medium">Your workspace</div>
        <Card className="flex items-center gap-6 p-6">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-lg font-bold text-red-600">A</div>
          <div className="flex-1">
            <div className="font-medium">{workspaces[0].name}</div>
            <div className="text-xs text-muted-foreground">{workspaces[0].members} members</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">⭐ {workspaces[0].plan}</span>
            <Button variant="outline" size="sm" className="flex gap-1"><Settings className="w-4 h-4" />Setting</Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile; 