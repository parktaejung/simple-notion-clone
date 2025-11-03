import React from 'react';

import './index.css';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import { NoteProvider } from './context/NoteContext';

function App() {
  return (
    <NoteProvider>
      <div className="flex h-screen antialiased text-gray-800 bg-gray-50">
        <div className='flex flex-col w-64 border-r border-gray-200 bg-white'>
          <NoteList />
    
        </div>
        <div className='flex-1 p-4 bg-gray-100'>
          <NoteEditor />

        </div>
      </div>
    </NoteProvider>
  );
}

export default App;
