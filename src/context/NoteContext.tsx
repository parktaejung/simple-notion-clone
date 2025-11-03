import { createContext,useState,useContext,ReactNode,useCallback } from "react";
import {v4 as uuidv4} from 'uuid';
import {Note} from '../types/note';
import useLocalStorage from "../hook/useLocalStorage";

//1. contextType정의 (전역 상태의 설계도)
//이 인터페이스는 Context가 제공할 모든 값(데이터와 함수)의 타입을 명시합니다

interface NoteContextType{
    notes: Note[];  //모든 메모 객체들의 배열
    activeNote : Note | null; //현재 편집중이거나 선택된 메모 객체 없으면 null
    selectNote : (id:string) => void; //특정 id의 메모를 선택하는 함수
    saveNote : (note:Partial<Note>) => void; //메모 내용을 저장/업데이트 하는 함수
    deleteNote : (id:string) => void; //특정 id의 메모를 제거하는 함수
    createNote : () => void; //새로운 빈 메모를 생성하는 함수
}

//초기 메모데이터 : 앱 시작시 로컬 스토리지에 아무겂도 없을 때 사용 될 기본 메모
// typescript에게 배열의 타입이 Note[]임을 명시적으로 알려줌

const INITIAL_NOTES : Note[] = [
    {
        id : uuidv4(), //고유id생성
        title : "환영합니다! 🚀",
        content : "이 메모장은 React Context로 전역 상태를 관리하며, Local Storage에 저장됩니다.\n\n왼쪽 목록에서 메모를 선택하거나, '+ 새 메모 작성' 버튼을 눌러 새로운 메모를 만들어보세요.",
        createdAt: Date.now(),
        updatedAt:Date.now()
    }
]

//2.  context 객체 생성
// createContext에 초기값으로 undefined를 넘기고, 타입은 NoteContextType또는  undefined
const NoteContext = createContext<NoteContextType | undefined>(undefined);

//3. Custom hook : useNotes
// 하위 컴포넌트들이 NoteContext의 값을 편리하고 안전하게 사용할 수 있도록 돕는 훅이다.
export const useNotes = () => {
    const context = useContext(NoteContext);
    if(context === undefined){
        throw new Error('useNotes는  NoteProvider안에서만 사용해야함')
    }
    return context;
}

//4. provider정의 여기서 상태 생성 및 관리의 핵심을 다 구현
interface NoteProviderProps { 
    children : ReactNode,
}

//NoteProvider는 Context의 값을 생성하고 관리하며, 자식 컴포턴트들에게 이를 제공합니다...
export const NoteProvider:React.FC<NoteProviderProps> = ({children}) => {
    //[상태1] 모든 메모 목록을 관리합니다. useLocalStorage 훅을 사용하여 영속성을 확보합니다.
    const [notes, setNotes] = useLocalStorage<Note[]>('simple-notion-notes',INITIAL_NOTES);

    //상태2 현재 활성화 된 메모의 id를 관리합니다.
    //notes배열이 비어있지 않다면 첫번째 메모를 기본 활성화 메모로 설정합니다.
    const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);

    //activeNoteId를 사용하여 실제 Note객체를 notes배열에서 찾아옵니다.
    //find()메서드는 조건에 맞는 첫번째요소를 반환하고, 없으면undefined를 반환합니다.
    const activeNote = notes.find(note => note.id === activeNoteId) || null;

    //CURD함수 정의 usecallback으로 성능 최적화
    //useCallback을 사용하는 이유 : 함수가 불필요하게 리렌더링을 하지 않도록 성능을 최적화합니다
    //특히 하위컴포넌트에 함수를 props로 넘길때 유용

    //메모 선택 : 특정 id의 메모를 활성화합니다
    const selectNote = useCallback((id:string)=>{
        setActiveNoteId(id);
    },[])
    
    //새 메모 생성 : 새로운 빈 메모를 생성하여 목록에 추가하고 즉시 활성화합니다.
    const createNote = useCallback(()=>{
        const newNote : Note = {
            id: uuidv4(),
            title: "제목 없음",
            content : "새로운 메모 내용 ...",
            createdAt : Date.now(),
            updatedAt : Date.now(),
        }
        setNotes([newNote, ...notes]); // 새 메모를 목록의 맨 위에 추가 
        setActiveNoteId(newNote.id);

    },[notes,setNotes]);

    //메모저장/업데이트 , 현재 활성화된 메모의 제목과 내용을 업데이트 합니다..
    //Pratial<Note>를 사용하여 Note객체의 모든 필드를 넘기지 않고, 변경된 필드만 넘길 수 있음
    const saveNote = useCallback((updatedFields:Partial<Note>) => {
        if(!activeNoteId) return;

        setNotes(notes.map(note => {
            if(note.id !== activeNoteId) return note;

            return {
                ...note,
                ...updatedFields,
                updatedAt:Date.now(),
            }
        }))
    },[activeNoteId,notes,setNotes]);

    //메모 삭제  특정 id의 메모를 목록에서 제거 
    const deleteNote = useCallback((id:string)=>{
        const newNotes = notes.filter(note => note.id !== id);

        setNotes(newNotes);

        if(id === activeNoteId){
            setActiveNoteId(newNotes[0]?.id || null);
        }
    },[activeNoteId,notes,setNotes]);
    

    //최종 contextvalue
    //Context Provider를 통해 하위 컴포넌트들에게 제공될 값들을 정의합니다.
    const value: NoteContextType = {
        notes,
        activeNote,
        selectNote,
        saveNote,
        deleteNote,
        createNote,
    }

    return (
        <NoteContext.Provider value={value}>
            {children}
        </NoteContext.Provider>
    )
}