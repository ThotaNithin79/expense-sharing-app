import React from 'react';

// --- A small library of icons for different expense categories ---
const CategoryIcon = ({ category }) => {
    let icon;
    switch (category?.toLowerCase()) {
        case 'groceries':
            icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.099-.816l1.884-5.46a1.75 1.75 0 0 0-3.028-1.219l-7.1 11.667M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
            break;
        case 'rent':
            icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
            break;
        case 'utilities':
            icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>;
            break;
        case 'transport':
             icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.139a48.554 48.554 0 0 0-10.026 0 1.139 1.139 0 0 0-.987 1.139v.958m0-11.177h2.25m11.25 2.25-5.518-4.414A2.25 2.25 0 0 0 13.5 6.25l-2.25.9-2.25-.9a2.25 2.25 0 0 0-1.406.314L4.5 8.5" /></svg>;
             break;
        case 'entertainment':
             icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h14.25c.621 0 1.125-.504 1.125-1.125V9.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v6.375c0 .621.504 1.125 1.125 1.125Z" /></svg>;
             break;
        default:
            icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.924-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
            break;
    }
    return <div className="flex-shrink-0 size-12 rounded-full bg-slate-700 flex items-center justify-center">{icon}</div>;
};


const ExpenseItem = ({ expense }) => {
  // Helper to format the date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    // --- IMPROVEMENT: Added transition effects ---
    <div className="bg-slate-800 p-4 rounded-lg shadow-md flex items-center gap-4 transition-all duration-200 hover:bg-slate-700/50 hover:scale-[1.01]">
      {/* --- IMPROVEMENT: Category Icon --- */}
      <CategoryIcon category={expense.category} />

      {/* --- IMPROVEMENT: Better layout with flex-grow --- */}
      <div className="flex-grow">
        <p className="text-lg font-semibold text-white">{expense.title}</p>
        <p className="text-sm text-slate-400">
          Paid by <span className="font-medium text-slate-300">{expense.addedBy}</span> on {formatDate(expense.createdAt)}
        </p>
      </div>

      {/* --- IMPROVEMENT: Better typography for the amount --- */}
      <div className="text-right">
        <p className="text-xl font-bold text-white">₹{expense.amount.toFixed(2)}</p>
        <p className="text-xs text-slate-500 uppercase">{expense.category}</p>
      </div>
    </div>
  );
};

export default ExpenseItem;