import AppSidebar from '@/components/app-sidebar';

export default function QuizzesPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-[#f6f6f7]">
        <div className="max-w-4xl mx-auto px-8 py-8">
          <h1 className="text-xl font-semibold text-[#18181b]">Quizzes</h1>
          <p className="text-sm text-[#71717a] mt-0.5">Manage your product quizzes and recommendations.</p>
        </div>
      </main>
    </div>
  );
}
