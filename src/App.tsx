import React from 'react';

import './index.css';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';

function App() {
  return (
    <div className="flex h-screen antialiased text-gray-800 bg-gray-50">
      <div className='flex flex-col w-64 border-r border-gray-200 bg-white'>
        <NoteList />
        f
      </div>
      <div className='flex-1 p-4 bg-gray-100'>
        <NoteEditor />
        f
      </div>
    </div>
  );
}

export default App;
