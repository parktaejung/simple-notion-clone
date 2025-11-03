function NoteList() {
    return(
        <div className="p-4">
            <h2 className="text-xl text-center font-bold mb-4">메모 목록</h2>
            <button className="w-full py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
                + 새 메모 작성
            </button>
            <p className="mt-4 text-sm text-gray-500">목록 영역(Day 2에서 Context 연결 예정)</p>
        </div>
    )
}

export default NoteList;