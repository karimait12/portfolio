import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { Experience as ExperienceType } from '../../lib/supabase/types';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

export function ExperienceManager() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ExperienceType | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyExperience: ExperienceType = {
    id: '',
    company: '',
    role: '',
    description: '',
    start_date: '',
    end_date: '',
    current: false,
    logo_url: '',
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    const { data, error } = await supabase.from('experience').select('*').order('start_date', { ascending: false });
    if (error) {
      console.error('Error fetching experiences:', error);
      return;
    }
    setExperiences(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    if (editing.id) {
      await supabase.from('experience').update(editing).eq('id', editing.id);
    } else {
      await supabase.from('experience').insert([{ ...editing, id: crypto.randomUUID() }]);
    }

    fetchExperiences();
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this experience?')) {
      await supabase.from('experience').delete().eq('id', id);
      fetchExperiences();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-accent">Experience</h2>
        <button
          onClick={() => {
            setEditing(emptyExperience);
            setShowForm(true);
          }}
          className="tech-border px-4 py-2 text-accent hover:bg-accent/10 flex items-center gap-2"
        >
          <Plus size={18} />
          <span className="font-mono">Add Experience</span>
        </button>
      </div>

      {showForm && editing && (
        <div className="tech-border bg-background/50 p-6 space-y-4">
          <h3 className="text-lg font-bold text-accent">{editing.id ? 'Edit' : 'New'} Experience</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Company"
                value={editing.company}
                onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                className="bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono"
                required
              />
              <input
                type="text"
                placeholder="Role"
                value={editing.role}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                className="bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono"
                required
              />
            </div>
            <textarea
              placeholder="Description"
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className="w-full bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono"
              rows={3}
              required
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Start Date (YYYY-MM)"
                value={editing.start_date}
                onChange={(e) => setEditing({ ...editing, start_date: e.target.value })}
                className="bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono"
                required
              />
              <input
                type="text"
                placeholder="End Date (YYYY-MM)"
                value={editing.end_date || ''}
                onChange={(e) => setEditing({ ...editing, end_date: e.target.value })}
                className="bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono"
                disabled={editing.current}
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editing.current}
                onChange={(e) => setEditing({ ...editing, current: e.target.checked })}
                className="accent-accent"
              />
              <span className="text-gray-400 font-mono">Current Position</span>
            </label>
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
        {experiences.map((exp) => (
          <div key={exp.id} className="tech-border bg-background/50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-accent font-bold">{exp.role}</h3>
                <p className="text-gray-400 font-mono">{exp.company}</p>
                <p className="text-gray-500 font-mono text-sm">
                  {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditing(exp);
                    setShowForm(true);
                  }}
                  className="p-2 text-accent hover:bg-accent/10"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="p-2 text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
