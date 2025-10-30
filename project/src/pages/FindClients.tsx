//

export function FindClients() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Find Clients</h1>
      <p className="text-gray-600">Discover and connect with potential clients for your products.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded-xl border border-gray-200">Client directory and leads...</div>
        <div className="p-6 bg-white rounded-xl border border-gray-200">Filters and outreach...</div>
      </div>
    </div>
  );
}
