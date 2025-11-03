import { useState, useEffect } from "react";

//[Custom hook] 로컬 스토리지에 데이터를 저장하고 불러오는 훅
//제네릭 <T>를 사용하여 어떤 타입의 데이터든 저장할수있도록함

function useLocalStorage<T>(key:string,initialValue: T):[T,(value:T) => void]{
    const [storedValue, setStoredValue] = useState<T>(()=>{
        try{
            if(typeof window === 'undefined'){
                return initialValue;
            }
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        }catch(error){
            console.error(error);
            return initialValue;
        }
    })

    useEffect(()=>{
        try{
            if(typeof window === 'undefined'){
                return;
            }
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        }catch(error){  
            console.error(error);
        }
    },[key,storedValue])

    return [storedValue,setStoredValue];
}

export default useLocalStorage;

