import React, { useState, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import Brand from "./pages/brand/landing";
// import Customer from "./pages/customer/landing";
import ConnectWallet from "../src/pages/brand/connectWallet";
import Warehouse from "./pages/brand/warehouse";
import Error from "./pages/error";
import { MoralisProvider } from "react-moralis";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

//Shanky Imports
import { NotificationProvider } from "web3uikit";

function App() {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <div className="App">
          <Router>
            <nav style={{ fontFamily: "cursive" }}>
              <Link className="navheaders" to="/">
                Home
              </Link>
              <Link className="navheaders" to="/brand">
                Mint NFT
              </Link>
              {/* <Link className="navheaders" to="/customer"> */}
              {/* Customer */}
              {/* </Link> */}
              <Link aria-disabled className="navheaders" to="/customer">
                Bidings... (Coming Soon)
              </Link>
              <ConnectWallet />
            </nav>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/brand" element={<Brand />} />
              <Route path="/brand/warehouse" element={<Warehouse />} />
              {/* {/* <Route path="/customer" element={<Customer />} /> */}
              <Route path="*" element={<Error />} />
            </Routes>
            {
              //<div className="Footer">Footer</div>
            }
          </Router>
        </div>
      </NotificationProvider>
    </MoralisProvider>
  );
}

export default App;
