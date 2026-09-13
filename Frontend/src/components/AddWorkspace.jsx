import { useState } from 'react';
import axiosClient from '../api/axiosClient';

export default function AddWorkspace({ onCreated }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { data } = await axiosClient.post('/workspaces', {
        name: name.trim(),
      });

      setName('');
      if (onCreated) onCreated(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New workspace name..."
        className="flex-1 rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="rounded-lg bg-blue-600 px-6 font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create'}
      </button>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}