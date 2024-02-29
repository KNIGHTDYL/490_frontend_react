import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

function MovieDetails({ film }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card style={{ width: '100%' }}>
      <Card.Body>
        <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold' }}><strong>{film.title}</strong></Card.Title>
        <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '1.2rem' }}>Film Category: {film.categories[0]}</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '1.2rem' }}>Actors:</Card.Subtitle>
        <div style={{ marginBottom: '10px' }}>
          {film.actors.map((actor, index) => (
            <span key={index} style={{ marginRight: '5px' }}>{actor.first_name} {actor.last_name}<br /></span>
          ))}
        </div>

        {showDetails && (
          <div>
            <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '1.2rem' }}>Film Details:</Card.Subtitle>
            <p>Release Year: {film.release_year}</p>
            <p>Language: {film.language_name}</p>
            <p>Duration: {film.length} minutes</p>
            <p>Rating: {film.rating}</p>
            <p>Special Features: {film.special_features}</p>
          </div>
        )}
        <Button variant="primary" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'Hide Film Details' : 'Show Film Details'}
        </Button>
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
        placeholder="Search by Film Title, Actor Name, or Film Category"
        style={{ width: '100%', height: '40px', fontSize: '16px', marginBottom: '10px' }}
      />
    </div>
  );
}


function Films() {
  const [films, setFilms] = useState([]);
  const [filteredFilms, setFilteredFilms] = useState([]);

  useEffect(() => {
    getFilms();
  }, []);

  function getFilms() {
    axios.get('/films_and_actors')
      .then((response) => {
        setFilms(response.data);
        setFilteredFilms(response.data);
      })
      .catch((error) => {
        console.error('Error fetching top movies:', error);
      });
  }

  const handleSearch = (query) => {
    const filtered = films.filter((film) => {
      const actors = film.actors.map((actor) => `${actor.first_name} ${actor.last_name}`).join(' ');
      return (
        film.title.toLowerCase().includes(query.toLowerCase()) ||
        film.categories.join(' ').toLowerCase().includes(query.toLowerCase()) ||
        actors.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredFilms(filtered);
  };

  return (
    <div className="Films">
      <h1>Our Movie Collection</h1>
      <SearchBar handleSearch={handleSearch} />
      {filteredFilms.map((film, index) => (
        <MovieDetails key={index} film={film} />
      ))}
    </div>
  );
}

export default Films;
