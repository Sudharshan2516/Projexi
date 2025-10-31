export function FindInvestors() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Find Investors</h1>
      <p className="text-gray-600">Discover and connect with potential investors.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded-xl border border-gray-200">Investor directory...</div>
        <div className="p-6 bg-white rounded-xl border border-gray-200">Filters and matchmaking...</div>
      </div>
    </div>
  );
}
