import Navbar from "../Header/Navbar";

export default function CarView() {
  return (
    <>
      <Navbar/>
      <h3><a href="/" className="btn btn-light">Go Back</a>View</h3>
      <div className="container">
        <div className="form-group mb-3">
          <label for="number" className="form-label">Car Number:</label>
          <div className="form-control" id="number" >???</div>
        </div>
        <div className="form-group mb-3">
          <label for="model" className="form-label">Car Model:</label>
          <div className="form-control" id="modelr" >???</div>
        </div><div className="form-group mb-3">
          <label for="type" className="form-label">Car Type(SUV/CUV/SEDAN):</label>
          <div className="form-control" id="type" >???</div>
        </div>

      </div>

    </>

  );

}
