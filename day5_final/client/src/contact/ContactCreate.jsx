import { useState } from "react";
import PageHeader from "../header/PageHeader";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function ContactCreate() {
    const [contact, setContact] = useState({ id: '', name: '', phone: '', email: '', address: '' });
    const navigate = useNavigate();

    const txtBoxOnChange = event => {
        const updatableContact = { ...contact };
        updatableContact[event.target.id] = event.target.value;
        setContact(updatableContact);
    };

    const createContact = async () => {
        const baseUrl = "http://localhost:8080";
        try {
            const response = await axios.post(`${baseUrl}/contacts`, { ...contact });
            const createdContact = response.data.contact;
            setContact(createdContact);
            alert(response.data.message);
            navigate('/contacts/list');
        } catch (error) {
            alert('Server Error');
        }
    };

    return (
        <>
            
            <h3><a href="/contacts/list" className="btn btn-light">Go Back</a> Add Contact</h3>
            <div className="container">
                <div className="form-group mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input type="text" className="form-control" id="name"
                        placeholder="Enter contact name"
                        value={contact.name}
                        onChange={txtBoxOnChange} />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number:</label>
                    <input type="text" className="form-control" id="phone"
                        placeholder="Enter phone number"
                        value={contact.phone}
                        onChange={txtBoxOnChange} />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input type="email" className="form-control" id="email"
                        placeholder="Enter email address"
                        value={contact.email}
                        onChange={txtBoxOnChange} />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="address" className="form-label">Address:</label>
                    <textarea className="form-control" id="address"
                        placeholder="Enter contact address"
                        value={contact.address}
                        onChange={txtBoxOnChange}></textarea>
                </div>
                <button className="btn btn-lg btn-success shadow"
                    onClick={createContact}>Create Contact</button>
            </div>
        </>
    );
}

export default ContactCreate;
