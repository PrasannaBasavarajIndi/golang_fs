import CarCreate from "./Cars/CarsCreate";
import CarsList from "./Cars/CarsList"
import CarsVieww from "./Cars/CarsVieww"
import {BrowserRouter,Routes,Route} from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="" element={<CarsList/>}/>
            <Route path="" element={<CarsList/>}/>
            <Route path="/car/create" element={<CarCreate />}/>
            <Route path="/car/view" element={<CarsVieww/>}/>
        </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App