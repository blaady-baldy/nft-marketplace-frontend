import React, { useEffect, useState } from "react";
//import {init} from "./utils/initDrone.js";
import { Link } from "react-router-dom";
import "./home.css";
// import "../customer/customer.css";
// import Spinner from "../Spinner/spinner";

function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  return loading ? (
    <div>Loading......</div>
  ) : (
    <div className="homeContainer">
      <section className="home">
        <h1>What do you want to do?</h1>

        <button>
          <Link to="/brand">Mint NFT</Link>
        </button>
        <button>
          <Link to="/customer">Transfer NFT</Link>
        </button>
      </section>
    </div>
  );
}

export default Home;
