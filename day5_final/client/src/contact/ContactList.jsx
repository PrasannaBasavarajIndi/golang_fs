import { useEffect, useState } from "react";
import PageHeader from "../header/PageHeader";
import axios from 'axios';

function ContactList() {
    const [contacts, setContacts] = useState([{ id: '', name: '', phone: '', email: '', address: '' }]);

    const readAllContacts = async () => {
        try {
            const baseUrl = 'http://localhost:8080';
            const response = await axios.get(`${baseUrl}/contacts`);
            setContacts(response.data);
        } catch (error) {
            alert('Server Error');
        }
    };

    const deleteContact = async (id) => {
        if (!confirm("Are you sure to delete?")) {
            return;
        }
        const baseUrl = "http://localhost:8080";
        try {
            const response = await axios.delete(`${baseUrl}/contacts/${id}`);
            alert(response.data.message);
            await readAllContacts();
        } catch (error) {
            alert('Server Error');
        }
    };

    useEffect(() => {
        readAllContacts();
    }, []);

    return (
        <>
            
            <h3>List of Contacts</h3>
            <div className="container">
                <table className="table table-success table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Email</th>
                            <th scope="col">Address</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts && contacts.length > 0 ? contacts.map((contact) => (
                            <tr key={contact.id}>
                                <th scope="row">{contact.id}</th>
                                <td>{contact.name}</td>
                                <td>{contact.phone}</td>
                                <td>{contact.email}</td>
                                <td>{contact.address}</td>
                                <td>
                                    <a href={`/contacts/view/${contact.id}`} className="btn btn-primary shadow">View</a>
                                    &nbsp;
                                    <a href={`/contacts/edit/${contact.id}`} className="btn btn-info shadow">Edit</a>
                                    &nbsp;
                                    <button className="btn btn-danger shadow" onClick={() => deleteContact(contact.id)}>Delete</button>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="6">No Data Found</td></tr>}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ContactList;
