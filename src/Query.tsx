import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { response as MOCK_PRODUCTS } from './MOCK_DATA'

interface Product {
  product: {
    name: string
    price: string
  }
}

interface ProductData {
  [key: string]: Product
}

function App() {
  const { query } = useParams<{ query: string }>()
  const [productData, setProductData] = React.useState<ProductData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchProductData = async () => {
      try {
        // uncomment to use online queries
        // const response = await axios.get(`http://localhost:5000/scrape?query=${query}`)
        // setProductData(response.data)
        const response = MOCK_PRODUCTS
        setProductData(response)
        console.log("response")
        console.log(response)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchProductData()
  }, [])

  console.log(productData)

  return (
    <div className="App">
      <h1>Athlete Deals</h1>
      {loading ? (
        <p>Loading...</p>
      ) : productData ? (
        <div>
          {Object.keys(productData).map((key) => (
            <div key={key}
            // move to styled components or external style sheet
            style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                width: '600px',
            }}>
              <h2>{key}</h2>
              <p><strong>Name:</strong> {productData[key].product.name}</p>
              <p><strong>Price:</strong> {productData[key].product.price}</p>
            </div>
          ))}
        </div>
      ): (
        <p>No product data available</p>
      )}
    </div>
  )
}

export default App
