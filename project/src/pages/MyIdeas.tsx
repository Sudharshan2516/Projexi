export function MyIdeas() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Ideas</h1>
          <p className="text-gray-600">Create, track, and manage your startup ideas here.</p>
        </div>
        <a
          href="/post-idea"
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          Post Idea
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded-xl border border-gray-200">Idea canvas coming soon...</div>
        <div className="p-6 bg-white rounded-xl border border-gray-200">Pitch drafts and notes...</div>
      </div>
    </div>
  );
}
