import Navbar from "../Header/Navbar";

export default function CarList() {
  return (
    <>
      <Navbar/>
      <h4>Car List</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Number</th>
            <th scope="col">Model</th>
            <th scope="col">className</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>KA 09 ASC 1231</td>
            <td>Zen</td>
            <td>Smallcar</td>
            <td><a className="btn btn-success" href="/car/view?id=1">view</a></td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>KA 09 ASC 3211</td>
            <td>Beetle</td>
            <td>Hatchback</td>
            <td><a className="btn btn-success" href="/car/view?id=2">view</a></td>
          </tr>

        </tbody>
      </table>
    </>

  );

}
