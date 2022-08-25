import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import console from "console-browserify";

import { nftABI } from "../../constants/Brands/brandsConstant";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";

function Product({ tokenId, brandAddress, name, image, video, description }) {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const dispatch = useNotification();

  const [newAddress, setNewAddress] = useState("");
  const [owner, setOwner] = useState("");
  const [IPFSReturn, setIPFSReturn] = useState("");

  const {
    runContractFunction: transferToken,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: nftABI,
    contractAddress: brandAddress,
    functionName: "transferToken",
    params: { _sendTo: newAddress, _tokenId: tokenId },
  });

  const { runContractFunction: isOwner } = useWeb3Contract({
    abi: nftABI,
    contractAddress: brandAddress,
    functionName: "isOwner",
    params: { _tokenId: tokenId },
  });

  const updateIsOwner = async function () {
    const tempOwner = await isOwner({
      onError: (error) => console.log(error),
    });
    setOwner(tempOwner);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateIsOwner();
    }
  }, []);

  useEffect(() => {
    async function updateIPFSHistory() {
      await transferToken({
        onSuccess: handleSuccess,
        onError: handleErrorNotification,
      });
    }
    if (IPFSReturn !== "") {
      updateIPFSHistory();
    }
  }, [IPFSReturn]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNotification(tx);
    // updateUI();
  };

  const handleNotification = function (tx) {
    dispatch({
      type: "success",
      message: "NFT Successfully Transferred",
      title: "Product Transferred",
      position: "topR",
      icon: "checkmark",
    });
  };

  const handleErrorNotification = function (tx) {
    dispatch({
      type: "error",
      message: "NFT Transfer Unsuccessful",
      title: "Error Occured",
      position: "topR",
      icon: "info",
    });
  };

  return (
    <div class="everyProduct">
      <Card style={{ width: "18 rem", height: "50vh" }}>
        <Card.Img
          variant="top"
          src={image}
          style={{ objectFit: "cover", height: "20vh" }}
        />
        <Card.Body>
          <Card.Title
            id="nameProduct"
            style={{ fontWeight: "700", fontSize: "1.5rem" }}
          >
            {name}
          </Card.Title>
          <Card.Text>
            <div id="description">{description}</div>
          </Card.Text>
          <Card.Text>
            <a
              id="video"
              href={video}
              target="blank"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              Link
            </a>
          </Card.Text>

          {owner ? (
            <div>
              <div>
                <label style={{ fontWeight: "bold" }}>Transfer To : </label>
                <input
                  style={{ width: "50%" }}
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  required
                  placeholder="Address of the new Owner"
                />
                <br></br>

                <Button
                  variant="success"
                  style={{ marginLeft: "-2px" }}
                  disabled={isFetching || isLoading ? true : false}
                  onClick={async () => {
                    const tempRetIpfs = "xyz";
                    setIPFSReturn(tempRetIpfs);
                  }}
                >
                  Transfer
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ color: "red" }}>Not owned by you</div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Product;
