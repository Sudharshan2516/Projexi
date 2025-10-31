import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function AddProduct() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [moq, setMoq] = useState<string>('1');
  const [imageUrls, setImageUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    setError(null);

    try {
      const images = imageUrls
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const { error: insertError } = await supabase.from('products').insert([
        {
          dealer_id: profile.id,
          name,
          description,
          price: Number(price) || 0,
          moq: Number(moq) || 1,
          image_urls: images,
        },
      ]);

      if (insertError) throw insertError;

      navigate('/my-products');
    } catch (err: any) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
        <p className="text-gray-600">Create a new product listing.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Industrial Air Compressor"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            rows={4}
            placeholder="Describe the product, specs, warranty, etc."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MOQ</label>
            <input
              type="number"
              min="1"
              step="1"
              value={moq}
              onChange={(e) => setMoq(e.target.value)}
              required
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs</label>
          <input
            type="text"
            value={imageUrls}
            onChange={(e) => setImageUrls(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Comma-separated URLs (optional)"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple URLs with commas.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
