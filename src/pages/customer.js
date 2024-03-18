import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
    
import { Button, Card, Form, Table } from 'react-bootstrap';

function CustomerDetails({ customer, onDelete }) {
    const [showDetails, setShowDetails] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editedFormData, setEditedFormData] = useState({ ...customer });
  
    const handleChange = (e) => {
      setEditedFormData({ ...editedFormData, [e.target.name]: e.target.value });
    };
  
    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.put(`http://127.0.0.1:5000/customers-edit/${customer.customer_id}`, editedFormData);
        console.log(response.data);
        // If update is successful, exit edit mode
        setEditing(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    const handleDelete = async () => {
      try {
        const response = await axios.delete(`http://127.0.0.1:5000/delete_customer/${customer.customer_id}`);
        console.log(response.data);
        onDelete(customer.customer_id); // Trigger parent component's delete function
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    return (
      <Card style={{ width: '100%', marginBottom: '20px' }}>
        <Card.Body>
          <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {customer.first_name} {customer.last_name}
          </Card.Title>
          <Card.Text>Email: {customer.email}</Card.Text>
          <Button variant="primary" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide Customer Details' : 'Show Customer Details'}
          </Button>
          <Button variant="warning" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel Edit' : 'Edit Customer'}
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          {showDetails && (
            <div style={{ marginTop: '20px' }}>
              <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '1.2rem' }}>
                Customer Details:
              </Card.Subtitle>
              <Card.Text>Customer ID: {customer.customer_id}</Card.Text>
              <Card.Text>Active: {customer.active ? 'Yes' : 'No'}</Card.Text>
              <Card.Text>Address ID: {customer.address_id}</Card.Text>
              <Card.Text>Store ID: {customer.store_id}</Card.Text>
              <Card.Text>Create Date: {customer.create_date}</Card.Text>
              <Card.Text>Last Update: {customer.last_update}</Card.Text>
            </div>
          )}
          {editing && (
            <div style={{ marginTop: '20px' }}>
              <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '1.2rem' }}>
                Edit Customer:
              </Card.Subtitle>
              <Form onSubmit={handleUpdate}>
                <Form.Control type="text" name="first_name" value={editedFormData.first_name} onChange={handleChange} />
                <Form.Control type="text" name="last_name" value={editedFormData.last_name} onChange={handleChange} />
                <Form.Control type="email" name="email" value={editedFormData.email} onChange={handleChange} />
                <Form.Control type="text" name="address_id" value={editedFormData.address_id} onChange={handleChange} />
                <Button type="submit">Update Customer</Button>
              </Form>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  }
  

function SearchBar({ handleSearch }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  return (
    <div>
      <Form.Control
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search by Customer ID, First Name, or Last Name
        "
        style={{ width: '100%', height: '40px', fontSize: '16px', marginBottom: '10px' }}
      />
    </div>
  );
}

function GetCustomers() {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(25); // Number of customers per page
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    getCustomers();
  }, []);

  function getCustomers() {
    axios.get('/customers')
      .then((response) => {
        setCustomers(response.data.customers);
        setFilteredCustomers(response.data.customers);
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
      });
  }

  const handleSearch = (query) => {
    const filtered = customers.filter((customer) => {
      return (
        customer.first_name.toLowerCase().includes(query.toLowerCase()) ||
        customer.last_name.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase()) ||
        customer.customer_id.toString().toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredCustomers(filtered);
  };  

  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="Customers">
      <h1>Our Customer List</h1>
      <SearchBar handleSearch={handleSearch} />
      {currentCustomers.map((customer, index) => (
        <CustomerDetails key={index} customer={customer} />
      ))}
      <ul className="pagination">
        {Array.from({ length: Math.ceil(filteredCustomers.length / customersPerPage) }).map((_, index) => (
          <li key={index} className="page-item">
            <Button onClick={() => paginate(index + 1)} className="page-link">
              {index + 1}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Customers = () => {
    const [showCustomers, setShowCustomers] = useState(false);
    const [customerData, setCustomerData] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [customersPerPage] = useState(20);
    const [formData, setFormData] = useState({
      store_id: '',
      first_name: '',
      last_name: '',
      email: '',
      address_id: '',
    });
    const [customerIdToDelete, setCustomerIdToDelete] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [editMessage, setEditMessage] = useState('');
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [editedFormData, setEditedFormData] = useState({ ...formData });
    const [rentalInfo, setRentalInfo] = useState([]);
    const [error, setError] = useState('');
    const [customerId, setCustomerId] = useState('');
  
    useEffect(() => {
      if (showCustomers) {
        fetchCustomers();
      }
    }, [currentPage, showCustomers]);
  
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/customers?page=${currentPage}&limit=${customersPerPage}`);
        setCustomerData(response.data.customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
  
    const toggleCustomers = () => {
      setShowCustomers(!showCustomers);
      setCurrentPage(1);
    };
  
    const handleSearch = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/search/customers?keyword=${keyword}`);
        setCustomerData(response.data);
      } catch (error) {
        console.error('Error searching for customers:', error);
      }
    };
  
    const paginate = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
  
    const handleChange = (e) => {
      setEditedFormData({ ...editedFormData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://127.0.0.1:5000/create_customer', editedFormData);
        console.log(response.data);
        setSuccessMessage('Customer created successfully');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
      } catch (error) {
        console.error('Error:', error);
        setSuccessMessage('Customer has not been created');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
      }
    };
  
    const handleDelete = async () => {
      try {
        const response = await axios.delete(`http://127.0.0.1:5000/delete_customer/${customerIdToDelete}`);
        console.log(response.data);
        setDeleteMessage('Customer deleted successfully');
        setTimeout(() => {
          setDeleteMessage(null);
        }, 2000);
      } catch (error) {
        console.error('Error:', error);
        setDeleteMessage('NO Id matches that');
        setTimeout(() => {
          setDeleteMessage(null);
        }, 2000);
      }
    };
  
    /* Rental stuff */
    const fetchRentalInfo = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/rental_info?customer_id=${customerId}`);
        setRentalInfo(response.data);
        setError('');
      } catch (error) {
        setRentalInfo([]);
        setError('Error retrieving rental information. Please try again.');
      }
    };
  
    const handleRentalSubmit = (e) => {
      e.preventDefault();
      fetchRentalInfo();
    };
  
    const handleRentalChange = (event) => {
      setCustomerId(event.target.value);
    };
  
    const handleReturnMovie = async (rentalId) => {
      try {
        const response = await axios.post(`http://127.0.0.1:5000/rental_movie/${rentalId}`);
  
        if (!response.data || response.status !== 200) {
          throw new Error(response.data.error || 'Failed to return movie');
        }
  
        // Update rentalInfo after successful return
        setRentalInfo(rentalInfo.filter((rental) => rental.rental_id !== rentalId));
      } catch (error) {
        setError(error.message);
      }
    };
  
    /* Edit stuff */
    const handleEdit = (customer) => {
      setEditingCustomer(customer);
      setEditedFormData(customer);
    };
  
    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.put(`http://127.0.0.1:5000/customers-edit/${editingCustomer.customer_id}`, editedFormData);
        console.log(response.data);
        setEditMessage('Customer updated successfully');
        setTimeout(() => {
          setEditMessage(null);
        }, 2000);
      } catch (error) {
        console.error('Error:', error);
        setEditMessage('Customer has not been updated');
        setTimeout(() => {
          setEditMessage(null);
        }, 2000);
      }
    };
  
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = customerData.slice(indexOfFirstCustomer, indexOfLastCustomer);
  
    return (
      <div>
        <div>
          <h2>Create Customer</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="store_id" placeholder="Store ID" onChange={handleChange} />
            <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} />
            <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
            <input type="text" name="address_id" placeholder="Address ID" onChange={handleChange} />
            <br></br>
            <Button type="submit" variant="primary">Create Customer</Button>
          </form>
          {successMessage && <p>{successMessage}</p>}
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <GetCustomers />
        {editingCustomer && (
          <div>
            <h2>Edit Customer</h2>
            <form onSubmit={handleUpdate}>
              <input type="text" name="first_name" value={editedFormData.first_name} placeholder="First Name" onChange={handleChange} />
              <input type="text" name="last_name" value={editedFormData.last_name} placeholder="Last Name" onChange={handleChange} />
              <input type="email" name="email" value={editedFormData.email} placeholder="Email" onChange={handleChange} />
              <input type="text" name="address_id" value={editedFormData.address_id} placeholder="Address ID" onChange={handleChange} />
              <br />
              <Button type="submit" variant="primary">Update Customer</Button>
            </form>
            {editMessage && <p>{editMessage}</p>}
          </div>
        )}
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    );
  };

export default Customers;