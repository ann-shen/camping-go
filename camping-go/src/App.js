import CreateGroup from "./pages/CreateGroup";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Test from "./Test";
import Taiwan from "./component/Taiwan";
import "rsuite/dist/rsuite.min.css";

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/createGroup' element={<CreateGroup />}></Route>
          <Route path='/' element={<Test />}></Route>
          <Route path='/taiwan' element={<Taiwan />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
