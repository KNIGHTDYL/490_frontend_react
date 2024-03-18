import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Table } from 'react-bootstrap';

const ViewRental = () => {
  const [rentalInfo, setRentalInfo] = useState([]);
  const [error, setError] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [showRentalTable, setShowRentalTable] = useState(false); // State to control visibility of rental table

  const fetchRentalInfo = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/rental_info?customer_id=${customerId}`);
      setRentalInfo(response.data);
      setError('');
      setShowRentalTable(true); // Show rental table when data is fetched
    } catch (error) {
      setRentalInfo([]);
      setError('Error retrieving rental information. Please try again.');
      setShowRentalTable(false); // Hide rental table on error
    }
  };

  const handleRentalSubmit = async (e) => {
    e.preventDefault();
    await fetchRentalInfo();
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

  return (
    <div>
      <div>
        <h2>View Customer Rental Information</h2>
        <form onSubmit={handleRentalSubmit}>
          <label>
            Enter Customer ID:
            <input type="text" placeholder="Enter Customer ID" value={customerId} onChange={handleRentalChange} />
          </label><br></br>
          <Button type="submit" variant="primary">Rental Info</Button>
        </form>
        {error && <p>{error}</p>}
        {showRentalTable && rentalInfo.length > 0 && (
          <div>
            <h2>Rental Information</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Rental</th>
                  <th>Movie Title</th>
                  <th>Rental Start Date</th>
                  <th>Rental Return Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rentalInfo.map((rental, index) => (
                  <tr key={index}>
                    <td>{rental.first_name}</td>
                    <td>{rental.rental_id}</td>
                    <td>{rental.movie_title}</td>
                    <td>{rental.rental_start_date}</td>
                    <td>{rental.rental_return_date || 'Not Returned'}</td>
                    <td>
                      {!rental.rental_return_date && (
                        <Button onClick={() => handleReturnMovie(rental.rental_id)} variant="danger">Return</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        {showRentalTable && (
          <Button onClick={() => setShowRentalTable(false)}>Hide Rental Info</Button>
        )}
      </div>
    </div>
  );
};

const Movies = () => {
  const [films, setFilms] = useState([]);
  const [showMoviesTable, setShowMoviesTable] = useState(false);
  const [rentalDetails, setRentalDetails] = useState({
    customer_id: '',
    staff_id: '',
    inventory_id: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch all films when component mounts
    handleFetchAllFilms();
  }, []);

  const handleFetchAllFilms = async () => {
    try {
      if (showMoviesTable) {
        setShowMoviesTable(false);
        setFilms([]); // Clear films when hiding the table
      } else {
        const response = await axios.get(`http://127.0.0.1:5000/available-rent`);
        setFilms(response.data);
        setShowMoviesTable(true);
      }
    } catch (error) {
      console.error('Error fetching all films:', error);
    }
  };

  const handleRentMovie = async (inventory_id) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/add_rental', {
        customer_id: rentalDetails.customer_id,
        staff_id: rentalDetails.staff_id,
        inventory_id: inventory_id
      });
      console.log(response.data);
      setSuccessMessage('Movie has been rented');
    } catch (error) {
      console.error('Error renting movie:', error);
      setSuccessMessage('Movie has not been rented');
    }
  };

  const handleChange = (e, key) => {
    setRentalDetails({ ...rentalDetails, [key]: e.target.value });
  };

  const handleSelectMovie = (inventory_id) => {
    const selectedFilm = films.find(film => film.inventory_id === inventory_id);
    setRentalDetails({
      ...rentalDetails,
      inventory_id: selectedFilm.inventory_id,
      customer_id: '',
      staff_id: ''
    });
  };

  const handleDeselectMovie = () => {
    setRentalDetails({
      ...rentalDetails,
      inventory_id: '',
      customer_id: '',
      staff_id: ''
    });
  };

  return (
    <div>
      <ViewRental />
      <div>
        <h1>Rent Movies</h1>

        <Button onClick={handleFetchAllFilms}>
          {showMoviesTable ? 'Hide movies available for renting' : 'Check movies available for renting'}
        </Button>

        {showMoviesTable && (
          <div>
            <h2>Available Movies for Renting</h2>
            {successMessage && <p>{successMessage}</p>}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Rental Rate</th>
                  <th>Inventory ID</th>
                  <th>Customer ID</th>
                  <th>Staff ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {films.map((film) => (
                  <tr key={film.film_id}>
                    <td>{film.title}</td>
                    <td>{film.rental_rate}</td>
                    <td>{film.inventory_id}</td>
                    <td>
                      <Form.Control
                        type="text"
                        value={rentalDetails.customer_id}
                        onChange={(e) => handleChange(e, 'customer_id')}
                        disabled={rentalDetails.inventory_id !== film.inventory_id}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={rentalDetails.staff_id}
                        onChange={(e) => handleChange(e, 'staff_id')}
                        disabled={rentalDetails.inventory_id !== film.inventory_id}
                      />
                    </td>
                    <td>
                      <Button onClick={() => handleSelectMovie(film.inventory_id)}>Select</Button>
                      <Button onClick={() => handleRentMovie(film.inventory_id)} disabled={rentalDetails.inventory_id !== film.inventory_id}>Rent</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {rentalDetails.inventory_id && (
              <Button onClick={handleDeselectMovie}>Deselect</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
