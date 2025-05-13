import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle } from 'lucide-react';

const Tasks = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  // Dữ liệu mock, chưa có task
  const tasks = [];

  if (showCreate) {
    return (
      <Layout title="Task">
        <div className="max-w-3xl mx-auto py-8 px-4">
          <h2 className="text-3xl font-semibold mb-8">Create new task</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-base font-medium mb-1">Name</label>
              <Input
                placeholder="E.g. Translate documents, Write Facebook post,..."
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1">Description</label>
              <Input
                placeholder="A short brief about what this task will be for"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1">Prompt content</label>
              <div className="text-xs text-muted-foreground mb-2">
                Use [variable] as placeholders to make your prompts more flexible and adaptable to dynamic inputs. Each variable should have a unique name because the same variable will only need to be entered once, even if it appears in multiple sections of the prompt.
              </div>
              <textarea
                className="w-full border rounded px-3 py-2 min-h-[120px] bg-muted/20"
                placeholder={'Example: "Translate the document from [language 1] to [language 2]. Make sure the [language 2] translated document is concise and reflective".'}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mt-8">
              <Button variant="outline" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button variant="outline" type="button" disabled>👁 Preview</Button>
              <Button type="button" disabled={!name || !description || !prompt}>+ Create new</Button>
            </div>
          </form>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Task">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-semibold">Task <span className="text-gray-400 text-2xl">(0/50)</span></h2>
          </div>
          <Button className="bg-black text-white flex gap-2" onClick={() => setShowCreate(true)}><Plus className="w-4 h-4" />Create</Button>
        </div>
        <div className="mb-4 max-w-xs">
          <Input placeholder="Find task" />
        </div>
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-2 text-left font-semibold text-sm text-gray-500 w-10"><input type="checkbox" disabled /></th>
                <th className="py-3 px-2 text-left font-semibold text-sm">NAME</th>
                <th className="py-3 px-2 text-left font-semibold text-sm">DESCRIPTION</th>
                <th className="py-3 px-2 text-left font-semibold text-sm">CREATED BY</th>
                <th className="py-3 px-2 text-left font-semibold text-sm">LAST UPDATE</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2 text-yellow-600 mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Empty section. Please create a new task.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                tasks.map((task, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-2"><input type="checkbox" /></td>
                    <td className="py-2 px-2">{task.name}</td>
                    <td className="py-2 px-2">{task.description}</td>
                    <td className="py-2 px-2">{task.createdBy}</td>
                    <td className="py-2 px-2">{task.lastUpdate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
        <div className="flex items-center gap-4 mt-6">
          <Button variant="outline" disabled>5</Button>
          <Button variant="outline" disabled>&laquo; Previous</Button>
          <Button variant="outline" disabled>Next &raquo;</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Tasks;
