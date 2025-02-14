import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../header/PageHeader";
import axios from 'axios';

function ContactEdit() {
    const [contact, setContact] = useState({ name: '', phone: '', email: '', address: '' });
    const params = useParams();
    const navigate = useNavigate();

    const txtBoxOnChange = event => {
        const updatableContact = { ...contact };
        updatableContact[event.target.id] = event.target.value;
        setContact(updatableContact);
    };

    const readById = async () => {
        const baseUrl = "http://localhost:8080";
        try {
            const response = await axios.get(`${baseUrl}/contacts/${params.id}`);
            setContact(response.data);
        } catch (error) {
            alert('Server Error');
        }
    };

    const updateContact = async () => {
        const baseUrl = "http://localhost:8080";
        try {
            const response = await axios.put(`${baseUrl}/contacts/${params.id}`, { ...contact });
            alert(response.data.message);
            navigate('/contacts/list');
        } catch (error) {
            alert('Server Error');
        }
    };

    useEffect(() => {
        readById();
    }, []);

    return (
        <>
            <div class="container text-start">

                <h3>
                    <a href="/contacts/list" className="btn btn-light">Go Back</a> Edit Contact
                </h3>
                <div className="container">
                    <div className="form-group mb-3">
                        <label htmlFor="name" className="form-label">Name:</label>
                        <input type="text"  className="form-control" id="name"
                            placeholder="Enter contact name"
                            value={contact.name}
                            onChange={txtBoxOnChange}  class="small-input"/>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="phone" className="form-label">Phone Number:</label>
                        <input type="text" className="form-control" id="phone"
                            placeholder="Enter phone number"
                            value={contact.phone}
                            onChange={txtBoxOnChange}  class="small-input"/>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input type="email" className="form-control" id="email"
                            placeholder="Enter email address"
                            value={contact.email}
                            onChange={txtBoxOnChange}  class="small-input"/>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="address" className="form-label">Address:</label>
                        <textarea className="form-control" id="address"
                            placeholder="Enter contact address"
                            value={contact.address}
                            onChange={txtBoxOnChange} class="small-input"></textarea>
                    </div>
                    <button className="btn btn-lg btn-success shadow" onClick={updateContact}>Update Contact</button>
                </div>
            </div>
        </>
    );
}

export default ContactEdit;
