import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Package, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DealerDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeDeals: 0,
    totalRevenue: 0,
    connections: 0,
  });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [profile]);

  const loadDashboardData = async () => {
    if (!profile) return;

    try {
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('dealer_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(6);

      const { count } = await supabase
        .from('connections')
        .select('*', { count: 'exact', head: true })
        .eq('requester_id', profile.id)
        .eq('status', 'accepted');

      if (productsData) {
        setProducts(productsData);
        setStats(prev => ({
          ...prev,
          totalProducts: productsData.length,
        }));
      }

      if (count) {
        setStats(prev => ({ ...prev, connections: count }));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Active Products', value: stats.totalProducts, icon: 'https://cdn.lordicon.com/dxoycpzg.json', color: 'bg-blue-500' },
    { label: 'Active Deals', value: stats.activeDeals, icon: 'https://cdn.lordicon.com/mrjuyheh.json', color: 'bg-green-500' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: 'https://cdn.lordicon.com/fgxwhgdl.json', color: 'bg-purple-500' },
    { label: 'Connections', value: stats.connections, icon: 'https://cdn.lordicon.com/mfslghfy.json', color: 'bg-orange-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dealer Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your products and connect with clients</p>
        </div>
        <button
          onClick={() => navigate('/add-product')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg flex items-center justify-center`}>
                <lord-icon src={stat.icon} trigger="loop" delay="1500" colors="primary:#ffffff" style={{ width: 28, height: 28 }} />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Your Products</h2>
          <button
            onClick={() => navigate('/my-products')}
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {products.length === 0 ? (
            <div className="col-span-full p-12 text-center">
              <Package className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Yet</h3>
              <p className="text-gray-600 mb-6">Add your first product to start connecting with clients</p>
              <button
                onClick={() => navigate('/add-product')}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                {product.image_urls && product.image_urls[0] ? (
                  <img
                    src={product.image_urls[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <Package size={48} className="text-gray-400" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">${Number(product.price).toLocaleString()}</span>
                    <span className="text-sm text-gray-500">MOQ: {product.moq}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white shadow-lg">
          <lord-icon src="https://cdn.lordicon.com/mfslghfy.json" trigger="loop" delay="1500" colors="primary:#ffffff" style={{ width: 40, height: 40 }} />
          <h3 className="text-2xl font-bold mb-2">Find Clients</h3>
          <p className="text-blue-100 mb-6">
            Connect with entrepreneurs and startups looking for materials and services
          </p>
          <button
            onClick={() => navigate('/find-clients')}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Browse Startups
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-8 text-white shadow-lg">
          <lord-icon src="https://cdn.lordicon.com/mrjuyheh.json" trigger="loop" delay="1500" colors="primary:#ffffff" style={{ width: 40, height: 40 }} />
          <h3 className="text-2xl font-bold mb-2">Partnership Opportunities</h3>
          <p className="text-green-100 mb-6">
            View partnership requests and manage your business relationships
          </p>
          <button
            onClick={() => navigate('/partnerships')}
            className="px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
          >
            View Partnerships
          </button>
        </div>
      </div>
    </div>
  );
}
