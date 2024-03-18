import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

function CustomerDetails({ customer }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card style={{ width: '100%', marginBottom: '20px' }}>
      <Card.Body>
        <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {customer.first_name} {customer.last_name}
        </Card.Title>
        <Card.Text>Email: {customer.email}</Card.Text>
        <Button
          variant="primary"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Customer Details' : 'Show Customer Details'}
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
        placeholder="Search by Customer ID, First Name, or Last Name"
        style={{ width: '100%', height: '40px', fontSize: '16px', marginBottom: '10px' }}
      />
    </div>
  );
}

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(25); // Number of customers per page
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = () => {
    axios.get('/customers')
      .then((response) => {
        setCustomers(response.data.customers);
        setFilteredCustomers(response.data.customers);
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
      });
  };

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
      <CreateCustomer />
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
};

const CreateCustomer = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    store_id: '',
    first_name: '',
    last_name: '',
    email: '',
    address_id: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/create_customer', formData);
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

  return (
    <div>
      <h2>Create Customer</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="store_id" placeholder="Store ID" onChange={handleChange} />
        <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} />
        <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="text" name="address_id" placeholder="Address ID" onChange={handleChange} />
        <br />
        <Button type="submit" variant="primary">Create Customer</Button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default Customers;
