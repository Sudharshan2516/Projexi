export function Portfolio() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
      <p className="text-gray-600">Track your investments and performance.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded-xl border border-gray-200">Holdings and returns...</div>
        <div className="p-6 bg-white rounded-xl border border-gray-200">Recent activity...</div>
      </div>
    </div>
  );
}
