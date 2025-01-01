import React from 'react'
import { Link } from 'react-router-dom'
import { SearchQueries } from './types'

const LandingPage = () => {
    const queries = Object.values(SearchQueries) as string[]
  
    return (
      <div style={{ padding: '20px' }}>
        <h1>Choose a Product Query</h1>
        <ul>
          {queries.map((query) => (
            <li key={query}>
              <Link to={`/products/${query}`}>
                {query}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default LandingPage