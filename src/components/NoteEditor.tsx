import React,{useState ,useEffect, useCallback} from 'react';
import { useNotes } from '../context/NoteContext';

function NoteEditor() {
    const {activeNote, saveNote,deleteNote} = useNotes();

    const [title,setTitle] = useState('');
    const [content,setContent] = useState('');

    useEffect(()=>{
        if(activeNote){
            setTitle(activeNote.title);
            setContent(activeNote.content);
        }
    },[activeNote])
    const handleSave = useCallback(()=>{
        if(!activeNote) return;

        saveNote({title,content});

    },[activeNote,title,content,saveNote])
    if(!activeNote){
        return(
            <div className='h-full flex items-center justify-center bg-white rounded-lg shadow-md'>
                <p className='text-xl text-gray-400'>메모를 선택하거나 새로 작성해주세요</p>
            </div>
        )
    }
 return(
    <div className="flex flex-col h-full bg-white p-6 shadow-2xl rounded-xl">
        <input type="text" 
               value={title} 
               onChange={(e)=>setTitle(e.target.value)} 
               onBlur={handleSave} 
               className='w-full text-3xl font-bold mb-4 border-b pb-2 focus:outline-none '
               placeholder='제목을 입력하세요' />

        <textarea
            value={content}
            onChange={(e)=>{setContent(e.target.value)}}
            onBlur={handleSave}
            className='flex-1 w-full text-lg resize-none focus:outline-none placeholder-gray-400'
            placeholder='여기에 메모 내용을 작성하세요...' />

        <div className='mt-4 flex justify-between items-center border-t pt-4'>
            <p className='text-sm text-gray-500'>
                최근 수정 : {new Date(activeNote.updatedAt).toLocaleDateString()}
            </p>
            <button
                onClick={()=>{deleteNote(activeNote.id)}}
                className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200'>
                    ❌ 메모 삭제
            </button>
        </div>
    </div>
 )
}

export default NoteEditor;