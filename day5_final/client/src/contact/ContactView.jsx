import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../header/PageHeader";
import axios from 'axios';

function ContactView() {
    const [contact, setContact] = useState({ id: '', name: '', phone: '', email: '', address: '' });
    const params = useParams();

    const readById = async () => {
        const baseUrl = "http://localhost:8080";
        try {
            const response = await axios.get(`${baseUrl}/contacts/${params.id}`);
            setContact(response.data);
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

                <h3><a href="/contacts/list" className="btn btn-light">Go Back</a> View Contact</h3>
                <div className="container">
                    <div className="form-group mb-3">
                        <label htmlFor="name" className="form-label">Name:</label>
                        <div className="form-control" id="name" class="small-input">{contact.name}</div>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="phone" className="form-label">Phone Number:</label>
                        <div className="form-control" id="phone" class="small-input">{contact.phone}</div>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <div className="form-control" id="email" class="small-input">{contact.email}</div>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="address" className="form-label">Address:</label>
                        <div className="form-control" id="address" class="small-input">{contact.address}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ContactView;
