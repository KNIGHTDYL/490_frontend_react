import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Navbar from 'react-bootstrap/Navbar';

function MovieCard({ title, description, releaseYear, language, duration, rating, specialFeatures, timesRented, lastUpdate }) {
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
              <p>Release Year: {releaseYear}</p>
              <p>Language: {language}</p>
              <p>Duration: {duration} minutes</p>
              <p>Rating: {rating}</p>
              <p>Special Features: {specialFeatures}</p>
              <p>Times Rented: {timesRented}</p>
            </div>
          )}
          <Button variant="primary" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted"> {lastUpdate} </small>
        </Card.Footer>
      </Card>
    </CardGroup>
  );
}

function ActorCard({ firstName, lastName, topMovies }) {
  const [showMovies, setShowMovies] = useState(false);

  return (
    <CardGroup>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{firstName} {lastName}</Card.Title>
          <Button variant="primary" onClick={() => setShowMovies(!showMovies)}>
            {showMovies ? 'Hide Movies' : 'More Info'}
          </Button>
          {showMovies && (
            <div>
              {topMovies.map((movie, index) => (
                <MovieCard 
                  key={index} 
                  title={movie.title}
                  description={movie.description}
                  releaseYear={movie.release_year}
                  language={movie.language_id} 
                  duration={movie.length} 
                  rating={movie.rating}
                  specialFeatures={movie.special_features}
                  timesRented={movie.rental_count} 
                  lastUpdate={movie.last_update} 
                />
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </CardGroup>
  );
}

function Home(){
  const [topFiveFilms, setTopFiveFilms] = useState([]);
  const [topFiveActors, setTopFiveActors] = useState([]);
  const [films, setFilms] = useState([]);

  useEffect(() => {
    getTopMovies();
    getTopActors();
    getFilms();
  }, []);

  function getTopMovies() {
    axios.get('/top_movies') 
      .then((response) => {
        setTopFiveFilms(response.data);
      })
      .catch((error) => {
        console.error('Error fetching top movies:', error);
      });
  }

  function getTopActors() {
    axios.get('/top_actors') 
      .then((response) => {
        setTopFiveActors(response.data);
      })
      .catch((error) => {
        console.error('Error fetching top actors:', error);
      });
  }

  function getFilms() {
    axios.get('/films') 
      .then((response) => {
        setFilms(response.data);
      })
      .catch((error) => {
        console.error('Error fetching top actors:', error);
      });
  }

  return (
    <div className="App">
      <div className="NavBar">
      </div>
      <div id="top_movies">
        <h1><br/>Top 5 Rented Films of All Time</h1>
        <CardGroup>
          {topFiveFilms.map((film, index) => (
            <MovieCard
              key={index}
              title={film.title}
              description={film.description}
              releaseYear={film.release_year}
              language={film.language} 
              duration={film.duration} 
              rating={film.rating}
              specialFeatures={film.special_features}
              timesRented={film.times_rented} 
              lastUpdate={film.last_update} 
            />
          ))}
        </CardGroup>
      </div>
      <div id="top_actors">
        <h1><br/>Top 5 Actors That Feature in Films We Have in Store</h1>
        <CardGroup>
          {topFiveActors.map((actor, index) => (
            <ActorCard 
              key={index} 
              firstName={actor.first_name} 
              lastName={actor.last_name} 
              topMovies={actor.top_movies} 
            />
          ))}
        </CardGroup>
      </div>
      <div id="all_films">
        <h1><br/>All Films</h1>
        <CardGroup>
          {films.map((film, index) => (
            <MovieCard
              key={index}
              title={film.title}
              description={film.description}
              releaseYear={film.release_year}
              language={film.language} 
              duration={film.duration} 
              rating={film.rating}
              specialFeatures={film.special_features}
              timesRented={film.times_rented} 
              lastUpdate={film.last_update} 
            />
          ))}
        </CardGroup>
      </div>
    </div>
  );
}

export default Home;
