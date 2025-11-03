import React from 'react';
import { useNotes } from '../context/NoteContext';
function NoteList() {
    const {notes,activeNote,createNote,selectNote}  = useNotes();
    return(
        <div className="p-4">
            <h2 className="text-xl text-center font-bold mb-4">메모 목록</h2>
            <button onClick={createNote} className="w-full py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
                + 새 메모 작성
            </button>
            {/*메모 목록 렌더링 */}
            <div className="space-y-1">
                {notes.map((note)=>{
                    const isActive = activeNote?.id === note.id;
                    const activeClass = isActive ? 'bg-indigo-100 text-indigo-800 font-semibold' : 'hover:bg-gray-100 text-gray-700';
                    return(
                        <div key={note.id} onClick={()=> selectNote(note.id)} className={`p-3 rounded-lg cursor-pointer transition duration-150 ${activeClass}`}>
                          <h3 className='text-sm font-semibold truncate'>
                            {note.title || "제목 없음"}
                          </h3>
                          <p className='text-xs text-gray-500 mt-1'>
                            {new Date(note.updatedAt).toLocaleTimeString()}
                          </p>
                        </div>  

                    )
                })}
            </div>
        </div>
    )
}

export default NoteList;