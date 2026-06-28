import { useState } from 'react';
import Input from '../components/Input';

export default function Join() {
  
  const [isWriting, setIsWriting] = useState<boolean>(true);

  return (
    <div className="join-container min-h-screen flex flex-col justify-center items-center  p-6">
      {isWriting ? (
       <div className="relative w-[700px] h-[200px]">
        <div className="absolute inset-0 bg-[#014BAA] opacity-20 rounded-2xl -translate-x-4 -translate-y-4 shadow-md"></div>

         <div className="absolute inset-0 bg-white p-12 rounded-2xl shadow-xl border border-gray-100 text-center flex flex-col items-center justify-center gap-6">
         
         
          <h1 className="text-3xl font-bold text-[#014BAA] mb-4">구석방 가입 신청</h1>
          <p className="text-gray-600 mb-6">구석방 동아리에 오신 것을 환영합니다!</p>
          <h2 
            onClick={() => setIsWriting(false)} 
            className="text-xl font-semibold text-[#014BAA] underline cursor-pointer hover:scale-105 transition duration-200"
          >
            👉 신청하러 가기 (클릭!)
          </h2>
         
         </div>
        </div>
       
      
       
       
      ) : (
        
        <div className="w-[400px] bg-white p-8 rounded-xl shadow-md animate-fade-in">
          <h2 className="text-xl font-bold mb-6 text-gray-800">📋 신청서 작성</h2>
          
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-600">이름</span>
              <Input 
                placeholder="이름을 입력하세요" 
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#014BAA]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-600">학번</span>
              <Input 
                placeholder="학번을 입력하세요" 
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#014BAA]"
              />
            </div>

            <div className="flex gap-2 mt-4">
              
              <button 
                type="button"
                onClick={() => setIsWriting(true)} 
                className="w-1/3 bg-gray-200 text-gray-700 p-2 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                이전으로
              </button>
              <button 
                type="submit" 
                className="w-2/3 bg-[#014BAA] text-white p-2 rounded-lg font-medium hover:bg-[#013b85] transition"
              >
                제출하기
              </button>
            </div>
          </form>
        </div>
      )}
      
    </div>
  );
}