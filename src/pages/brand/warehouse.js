import React, { useState, useEffect } from "react";
import Product from "./eachProduct.js";
import "./brand.css";
import axios from "axios";
import AddProduct from "./addProduct.js";
import console from "console-browserify";

//------------------------------------------------------
import { useMoralis, useWeb3Contract } from "react-moralis";
import { nftABI } from "../../constants/Brands/brandsConstant";

import { ethers } from "ethers";
import { Moralis } from "moralis";
//------------------------------------------------------

function Warehouse() {
  const [products, setProducts] = useState({ items: [] });
  const [showForm, setShowForm] = useState(false);

  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const brandAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [numOfTokens, setNumOfTokens] = useState("0");
  const [i, setI] = useState(0);
  const [finalArr, setFinalArr] = useState([]);

  const { runContractFunction: getTokenCount } = useWeb3Contract({
    abi: nftABI,
    contractAddress: brandAddress,
    functionName: "getTokenCount",
    params: {},
  });

  const { runContractFunction: viewTokenURI } = useWeb3Contract({
    abi: nftABI,
    contractAddress: brandAddress,
    functionName: "viewTokenURI",
    params: { _tokenId: i - 1 },
  });

  const updateNumberOfTokens = async function () {
    console.log("Updating no of tokens");
    const tempNumberOfTokens = await getTokenCount({
      onError: (error) => console.log(error),
    });
    setNumOfTokens(tempNumberOfTokens.toString());
    // console.log("hello ji" + " " + numOfTokens);
  };

  const tokensCondition = () => {
    if (i < numOfTokens) {
      setI(i + 1);
    }
  };

  const updateURI = async function () {
    const tempURI = await viewTokenURI({
      onError: (error) => console.log(error),
    });
    // console.log(tempURI);
    const { data } = await axios.get(`${tempURI}`);
    console.log(data);
    const { name, image, video, description } = data;
    const tempObj = {
      tokenId: i - 1,
      name: name,
      image: image,
      video: video,
      description: description,
    };
    setFinalArr((oldArr) => [...oldArr, tempObj]);
  };

  useEffect(() => {
    if (brandAddress !== "") {
      updateURI();
    }
    tokensCondition();
  }, [i]);

  useEffect(() => {
    console.log("hello ji" + " " + numOfTokens);
    tokensCondition();
  }, [numOfTokens]);

  useEffect(() => {
    if (brandAddress !== "") {
      console.log(brandAddress);
      updateNumberOfTokens();
    }
  }, []);

  // useEffect(() => {
  //   if (isWeb3Enabled) {
  //     updateUI();
  //   }
  // }, [isWeb3Enabled]);

  // useEffect(() => {
  //   Moralis.onAccountChanged((account) => {
  //     updateUI();
  //   });
  // }, []);

  return (
    //add new product btn
    <div className="warehouse">
      <h1
        style={{
          fontSize: "4.5rem",
          fontWeight: "bold",
          paddingBottom: "3rem",
        }}
      >
        Welcome to Warehouse
      </h1>
      <hr
        style={{
          boxShadow: "5px 10px 25px rgba(145, 92, 182, 15.5)",
          height: "5px",
          fontWeight: "bold",
          backgroundColor: "rgb(25,25,25)",
          alignSelf: "center",
          marginBottom: "5rem",
        }}
      ></hr>

      <section className="head">
        <div>
          <button
            onClick={() => (showForm ? setShowForm(false) : setShowForm(true))}
          >
            Add New Product
          </button>
        </div>
      </section>
      <section>
        {showForm ? (
          // <AddProduct brandIndex={brandIndex} />
          <AddProduct
            brandAddress={brandAddress}
            updateTokenCount={updateNumberOfTokens}
          />
        ) : (
          <h1
            style={{
              paddingTop: "3rem",
              fontSize: "3.5rem",
              paddingBottom: "2.5rem",
            }}
          >
            Your Products
          </h1>
        )}
        <div className="cards-outer">
          <section className="cards">
            {numOfTokens !== "0" &&
              finalArr.length !== 0 &&
              finalArr.map((one) => {
                console.log(finalArr);
                return (
                  <Product
                    key={one.tokenId}
                    tokenId={one.tokenId}
                    brandAddress={brandAddress}
                    name={one.name}
                    image={one.image}
                    video={one.video}
                    description={one.description}
                  />
                );
              })}
          </section>
        </div>
      </section>
    </div>
  );
}

export default Warehouse;
