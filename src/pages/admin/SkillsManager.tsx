import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { Skill as SkillType } from '../../lib/supabase/types';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { CircularProgress } from '../../components/ui/CircularProgress';

export function SkillsManager() {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SkillType | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptySkill: SkillType = {
    id: '',
    name: '',
    category: '',
    proficiency: 50,
    icon: '',
    order: 0,
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data, error } = await supabase.from('skills').select('*').order('order_index');
    if (error) {
      console.error('Error fetching skills:', error);
      return;
    }
    setSkills(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    if (editing.id) {
      await supabase.from('skills').update(editing).eq('id', editing.id);
    } else {
      await supabase.from('skills').insert([{ ...editing, id: crypto.randomUUID() }]);
    }

    fetchSkills();
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this skill?')) {
      await supabase.from('skills').delete().eq('id', id);
      fetchSkills();
    }
  };

  const updateProficiency = async (skill: SkillType, delta: number) => {
    const newProficiency = Math.max(0, Math.min(100, skill.proficiency + delta));
    await supabase.from('skills').update({ proficiency: newProficiency }).eq('id', skill.id);
    fetchSkills();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-accent">Skills</h2>
        <button
          onClick={() => {
            setEditing(emptySkill);
            setShowForm(true);
          }}
          className="tech-border px-4 py-2 text-accent hover:bg-accent/10 flex items-center gap-2"
        >
          <Plus size={18} />
          <span className="font-mono">Add Skill</span>
        </button>
      </div>

      {showForm && editing && (
        <div className="tech-border bg-background/50 p-6 space-y-4">
          <h3 className="text-lg font-bold text-accent">{editing.id ? 'Edit' : 'New'} Skill</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Skill name"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className="bg-background/80 border border-accent-dim text-gray-300 px-4 py-3 font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-mono text-accent">
                Proficiency: {editing.proficiency}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={editing.proficiency}
                onChange={(e) => setEditing({ ...editing, proficiency: parseInt(e.target.value) })}
                className="w-full accent-accent"
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="tech-border bg-background/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-accent font-bold">{skill.name}</h3>
                <p className="text-gray-400 font-mono text-xs">{skill.category}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateProficiency(skill, -5)}
                  className="p-1 text-gray-400 hover:text-accent"
                >
                  -
                </button>
                <span className="text-accent font-mono w-8 text-center">{skill.proficiency}%</span>
                <button
                  onClick={() => updateProficiency(skill, 5)}
                  className="p-1 text-gray-400 hover:text-accent"
                >
                  +
                </button>
              </div>
            </div>
            <CircularProgress percentage={skill.proficiency} label="" size={80} strokeWidth={8} />
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setEditing(skill);
                  setShowForm(true);
                }}
                className="p-2 text-accent hover:bg-accent/10"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(skill.id)}
                className="p-2 text-red-400 hover:bg-red-900/20"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
