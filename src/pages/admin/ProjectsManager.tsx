import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { Project as ProjectType } from '../../lib/supabase/types';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

export function ProjectsManager() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProjectType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const emptyProject: ProjectType = {
    id: '',
    title: '',
    description: '',
    tags: [],
    github_url: '',
    live_url: '',
    image_url: '',
    featured: true,
    created_at: '',
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching projects:', error);
      return;
    }
    setProjects(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    setSaveError(null);
    setSaveSuccess(false);

    // Remove empty id and created_at for new records
    const projectData = { ...editing };
    if (!projectData.id) {
      delete (projectData as any).id;
      delete (projectData as any).created_at;
    }

    try {
      if (editing.id) {
        const { error } = await supabase.from('projects').update(projectData).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('projects').insert([projectData]).select();
        if (error) throw error;
        if (data && data.length > 0) {
          setEditing({ ...editing, id: data[0].id });
        }
      }

      setSaveSuccess(true);
      fetchProjects();
      setShowForm(false);
      setEditing(null);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save project';
      setSaveError(message);
      console.error('Save error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this project?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-accent">Projects</h2>
        <button
          onClick={() => {
            setEditing(emptyProject);
            setShowForm(true);
          }}
          className="tech-border px-4 py-2 text-accent hover:bg-accent/10 flex items-center gap-2"
        >
          <Plus size={18} />
          <span className="font-mono">Add Project</span>
        </button>
      </div>

      {showForm && editing && (
        <div className="tech-border bg-background/50 p-6 space-y-4">
          <h3 className="text-lg font-bold text-accent">{editing.id ? 'Edit' : 'New'} Project</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono"
                required
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.featured}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                  className="accent-accent"
                />
                <span className="text-gray-400 font-mono">Featured</span>
              </label>
            </div>
            <textarea
              placeholder="Description"
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className="w-full bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono"
              rows={3}
              required
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={editing.tags.join(', ')}
              onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(',').map(t => t.trim()) })}
              className="w-full bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="url"
                placeholder="GitHub URL"
                value={editing.github_url || ''}
                onChange={(e) => setEditing({ ...editing, github_url: e.target.value })}
                className="bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono"
              />
              <input
                type="url"
                placeholder="Live URL"
                value={editing.live_url || ''}
                onChange={(e) => setEditing({ ...editing, live_url: e.target.value })}
                className="bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="tech-border px-6 py-3 text-accent hover:bg-accent/10 flex items-center gap-2">
                <Save size={18} />
                <span className="font-mono">Save</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="tech-border px-6 py-3 text-gray-400 hover:bg-gray-800 flex items-center gap-2"
              >
                <X size={18} />
                <span className="font-mono">Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="tech-border bg-background/50 p-4 flex items-center justify-between">
            <div>
              <h3 className="text-accent font-bold">{project.title}</h3>
              <p className="text-gray-400 font-mono text-sm">{project.description.substring(0, 80)}...</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditing(project);
                  setShowForm(true);
                }}
                className="p-2 text-accent hover:bg-accent/10"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="p-2 text-red-400 hover:bg-red-900/20"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
