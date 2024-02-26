import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Navbar from 'react-bootstrap/Navbar';

function Movie_Card({ title, description, release_year, language, duration, rating, special_features, times_rented, last_update }) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <CardGroup>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            {description}
          </Card.Text>
          {showDetails && (
            <div>
              <p>Release Year: {release_year}</p>
              <p>Language: {language}</p>
              <p>Duration: {duration} minutes</p>
              <p>Rating: {rating}</p>
              <p>Special Features: {special_features}</p>
              <p>Times Rented: {times_rented}</p>
            </div>
          )}
          <Button variant="primary" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted"> {last_update} </small>
        </Card.Footer>
      </Card>
    </CardGroup>
  );
}

function Actor_Card({ first_name, last_name }) {
  return (
    <CardGroup>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{first_name} {last_name}</Card.Title>
          <Card.Text>
            {"Description would go here.... But there's nothing to put"}
          </Card.Text>
          <Button variant="primary">More Info</Button>
        </Card.Body>
      </Card>
    </CardGroup>
  );
}

function Home(){
  // rented movies + details
  const [top_five_films, set_top_five_films] = useState([]);
  // Returns the top 5 most rented movies + details
  const [top_five_actors, set_top_five_actors] = useState([]);
  // As a user I want to view a list of all customers + customer details
  const [customers, set_customers] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    axios.get('/sakila') 
      .then((response) => {
        set_top_five_films(response.data.top_five_films);
        set_top_five_actors(response.data.top_five_actors);
        set_customers(response.data.customers);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  return (
    <div className="App">
      <div className="NavBar">
      </div>
      <div id="top_movies">
        <h1><br/>Top 5 Rented Films of All Time</h1>
        <CardGroup>
          {top_five_films.map((film, index) => (
            <Movie_Card
              key={index}
              title={film.title}
              description={film.description}
              release_year={film.release_year}
              language={film.language} 
              duration={film.duration} 
              rating={film.rating}
              special_features={film.special_features}
              times_rented={film.times_rented} 
              last_update={film.last_update} 
            />
          ))}
        </CardGroup>
      </div>
      <div id="top_actors">
        <h1><br/>Top 5 Actors That Feature in Films We Have in Store</h1>
        <CardGroup>
          {top_five_actors.map((actor, index) => (
            <Actor_Card first_name={actor.first_name} last_name={actor.last_name}/>
          ))}
        </CardGroup>
      </div>
    </div>
  );
}

export default Home;