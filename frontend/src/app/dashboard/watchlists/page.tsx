'use client';

import { useState } from 'react';
import { useWatchlists, useCreateWatchlist, useDeleteWatchlist } from '@/hooks/useWatchlists';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function WatchlistsPage() {
  const { data: watchlists, isLoading } = useWatchlists();
  const createMutation = useCreateWatchlist();
  const deleteMutation = useDeleteWatchlist();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');

  const handleCreate = () => {
    if (newWatchlistName.trim()) {
      createMutation.mutate(
        { name: newWatchlistName, description: '', accountIds: [], tickers: [] },
        {
          onSuccess: () => {
            setNewWatchlistName('');
            setShowCreateForm(false);
          },
        },
      );
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this watchlist?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Watchlists</h1>
          <p className="text-gray-600 mt-1">Manage your tracked accounts and tickers</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          New Watchlist
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Create New Watchlist</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newWatchlistName}
              onChange={(e) => setNewWatchlistName(e.target.value)}
              placeholder="Watchlist name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCreate}
              disabled={createMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {watchlists?.map((watchlist: any) => (
          <div
            key={watchlist.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{watchlist.name}</h3>
                {watchlist.description && (
                  <p className="text-sm text-gray-600">{watchlist.description}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(watchlist.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Accounts</span>
                <span className="font-semibold text-gray-900">
                  {watchlist.accounts?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tickers</span>
                <span className="font-semibold text-gray-900">
                  {watchlist.tickers?.length || 0}
                </span>
              </div>
            </div>

            {watchlist.tickers && watchlist.tickers.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {watchlist.tickers.slice(0, 5).map((ticker: any) => (
                  <span
                    key={ticker.id}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded"
                  >
                    ${ticker.ticker}
                  </span>
                ))}
                {watchlist.tickers.length > 5 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                    +{watchlist.tickers.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {watchlists?.length === 0 && !showCreateForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-600 mb-4">No watchlists yet</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Your First Watchlist
          </button>
        </div>
      )}
    </div>
  );
}
