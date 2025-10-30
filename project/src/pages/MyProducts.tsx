export function MyProducts() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
      <p className="text-gray-600">Manage your dealer products and inventory.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded-xl border border-gray-200">Product list and statuses...</div>
        <div className="p-6 bg-white rounded-xl border border-gray-200">Orders and inquiries...</div>
      </div>
    </div>
  );
}
