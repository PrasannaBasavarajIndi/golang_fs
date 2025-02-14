import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ContactList from "./contact/ContactList";
import ContactCreate from "./contact/ContactCreate";
import ContactEdit from "./contact/ContactEdit";
import ContactView from "./contact/ContactView";
import PageHeader from "./header/PageHeader";
import "./App.css";

function App() {
  return (
    <Router>
      <PageHeader />
      <div className="container">
        

        <Routes>
          <Route path="/contacts/list" element={<ContactList />} />
          <Route path="/contacts/create" element={<ContactCreate />} />
          <Route path="/contacts/edit/:id" element={<ContactEdit />} />
          <Route path="/contacts/view/:id" element={<ContactView />} />
          <Route path="" element={<ContactList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
