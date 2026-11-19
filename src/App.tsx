import { Navigate, Route, Routes } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import Header from './page/Header.tsx'
import Home from './page/Home.tsx'
import Schedule from './page/Schedule.tsx'
import Projectup from './page/Projectup.tsx'
import Project from './page/Project.tsx'
import ProjectDetail from "./page/ProjectDetail";
import ITNews from "./page/ITNews";
import Notice from './page/Notice.tsx'
import NoticeDetail from './page/NoticeDetail.tsx'
import NoticeWrite from './page/NoticeWrite.tsx'
import Join from './page/Join.tsx'
import SignIn from './page/SignIn.tsx'
import SignUp from "./page/SignUp"
import FindId from './page/FindId.tsx'
import FindPw from './page/FindPw.tsx'
import NotFound from './page/NotFound.tsx'
import Admin from './page/Admin.tsx'
import Fortune from './page/Fortune.tsx'
import Footer from './page/Footer.tsx'

export default function App() {
  return (
    <div className="mit-h-screen flex flex-col">
      <Header />
      <ScrollToTop />

      <main className="flex-1">
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/Schedule' element={<Schedule/>} />
          <Route path='/Projectup' element={<Projectup/>} />
          <Route path='/Project' element={<Project/>}/>
          <Route path='/Project/:id' element={<ProjectDetail />} />
          <Route path="/ITNews" element={<ITNews />} />
          <Route path='/Notice' element={<Notice/>} />
          <Route path='/Notice/write' element={<NoticeWrite/>} />
          <Route path='/Notice/:id' element={<NoticeDetail/>} />
          <Route path='/Notice/:id/edit' element={<NoticeWrite/>} />
          <Route path='/Join' element={<Join/>} />
          <Route path='/SignIn' element={<SignIn/>} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path='/SignIn/FindID' element={<FindId/>} />
          <Route path='/SignIn/FindPW' element={<FindPw/>} />
          <Route path='/Admin' element={<Admin/>} />
          <Route path='/Fortune' element={<Fortune/>} />
          <Route path='/Fortune/result/:id' element={<Fortune/>} />
          <Route path='/not-found' element={<NotFound/>} />
          <Route path='*' element={<Navigate to='/not-found' />} />
        </Routes>
      </main>

      <Footer/>
    </div>
  );
}
