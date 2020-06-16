import { useEffect } from "react";
import axios from "axios";

function Home({ products }) {
  console.log(products);
  // useEffect(() => {
  //   getProducts();
  // }, []);

  // async function getProducts() {}

  return <>home</>;
}

Home.getInitialProps = async (ctx) => {
  // fetch data on the server
  const url = "http://localhost:3000/api/products";
  const response = await axios.get(url);
  return { products: response.data };

  // return response data as an object

  // note: this object will be merged with existing props
};

export default Home;
