import React from "react";
import { useState, useEffect, useRef } from "react";

// import "../customer/customer.css";
import storeData from "../../backendScripts/storeToken";

import console from "console-browserify";
//------------------------------------------------------------------------------------
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";
import { nftABI } from "../../constants/Brands/brandsConstant";
import { useInsertionEffect } from "react";

// import sendMessage from "../../backendScripts/sendMessage";

//------------------------------------------------------------------------------------

function AddProduct({ brandAddress, updateTokenCount }) {
  const userRef = useRef();
  const errRef = useRef();
  const dispatch = useNotification();

  const [name, setName] = useState("");
  const [nameFocus, setNameFocus] = useState(false);

  const [descp, setDescp] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [vidURL, setVidURL] = useState("");
  const [descpFocus, setDescpFocus] = useState(false);
  const [buttonSubmit, setButtonSubmit] = useState(false);

  const [tokenId, setTokenId] = useState("");
  const [tokenFocus, setTokenFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  //-----------------------------------------------------------
  const [ipfsReturn, setIpfsReturn] = useState(["0", "0"]);

  const [max, setMax] = useState("0");
  //-----------------------------------------------------------

  //----------------------------------------------------
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  // const [brandAddress, setBrandAddress] = useState("");

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const {
    runContractFunction: mint,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: nftABI,
    contractAddress: brandAddress,
    functionName: "mint",
    params: {
      _tokenURI: ipfsReturn[0],
    },
  });

  const updateUI = async function () {};

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    updateTokenCount();
    setButtonDisabled(false);
    handleNotification(tx);
  };

  const handleNotification = function (tx) {
    dispatch({
      type: "success",
      message: "Transaction Successful",
      title: "Product Created",
      position: "topR",
      icon: "checkmark",
    });
  };

  const handleErrorNotification = function () {
    setButtonDisabled(false);
    dispatch({
      type: "error",
      message: "Transaction Unsuccessful",
      title: "Error Occurred",
      position: "topR",
      icon: "xCircle",
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    if (buttonSubmit == true) {
      handleSubmitButton();
    }
  }, [buttonSubmit]);

  const handleSubmitButton = async () => {
    const tempArr = await storeData(name, imgURL, vidURL, descp, chainId);
    // console.log(tempArr[0]);
    // console.log(tempArr[1]);
    setIpfsReturn(tempArr);
  };

  useEffect(() => {
    async function updateCollectible() {
      await mint({
        onSuccess: handleSuccess,
        onError: (error) => {
          console.log(error);
          handleErrorNotification();
        },
      });
    }
    if (ipfsReturn[0] !== "0" && ipfsReturn[1] !== "0") {
      updateCollectible();
    }
  }, [ipfsReturn]);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  //if any of the variables change
  useEffect(() => {
    setErrMsg("");
  }, [name, descp]);

  return (
    <div classsName="newProd">
      {console.log(brandAddress)}
      {success ? (
        //send info to db
        window.location.reload()
      ) : (
        <section className="addProduct" style={{ paddingBottom: "3rem" }}>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1 style={{ paddingBottom: "2.25rem" }}>Mint New NFT</h1>

          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
            onFocus={() => setNameFocus(true)}
            onBlur={() => setNameFocus(false)}
          />
          <hr></hr>

          <label htmlFor="descp">Description:</label>
          <input
            type="text"
            id="descp"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setDescp(e.target.value)}
            value={descp}
            required
            maxlength="60"
            //aria-invalid={validName ? "false" : "true"}
            //aria-describedby="uidnote"
            onFocus={() => setDescpFocus(true)}
            onBlur={() => setDescpFocus(false)}
          />
          <hr></hr>

          <lable htmlfor="myfile">Select Image/Preview Image : </lable>
          <input
            type="file"
            id="myfile"
            name="myfile"
            required
            onChange={(e) => {
              setImgURL(e.target.files);
            }}
          />
          <hr></hr>

          <lable htmlfor="myfile">Select Video(If Video NFT) : </lable>
          <input
            type="file"
            id="myfile"
            name="myfile"
            onChange={(e) => {
              setVidURL(e.target.files);
            }}
          />
          <hr></hr>

          <button
            disabled={isFetching || isLoading || buttonDisabled ? true : false}
            onClick={async () => {
              if (vidURL == "") {
                console.log("Video is null");
                setVidURL(imgURL);
              }
              setButtonSubmit(true);
              // return(await login();
            }}
          >
            Mint NFT
          </button>
          {/* </form> */}
        </section>
      )}
    </div>
  );
}

export default AddProduct;
