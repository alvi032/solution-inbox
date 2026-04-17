'use client';

export default function ResetButton() {
  const handleReset = () => {
    localStorage.removeItem('evoSearchInstalled');
    localStorage.removeItem('quizzesInstalled');
    window.dispatchEvent(new Event('evo-search-reset'));
  };

  return (
    <button
      onClick={handleReset}
      className="fixed bottom-6 right-6 h-9 px-4 rounded-lg bg-[#18181b] text-[#fafafa] text-sm font-medium shadow-lg hover:bg-[#27272a] transition-colors"
    >
      Reset
    </button>
  );
}
