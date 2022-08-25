import React, { useEffect, useState } from "react";
import Warehouse from "./warehouse.js";
// import ConnectWallet from "./connectWallet";
import { useMoralis } from "react-moralis";

function Brand() {
  const { isWeb3Enabled, account } = useMoralis();
  const [showComp, setShowComp] = useState(false);
  const authAcc = "0x726fa710e16d31b0db81741fc1e97b70234a779a";
  useEffect(() => {
    if (isWeb3Enabled) setShowComp(true);
  }, [isWeb3Enabled]);
  return (
    <div>
      {/*<ConnectWallet />*/}
      {<Warehouse />}
    </div>
  );
}

export default Brand;
//https://sketchfab.com/3d-models/cardboard-box-set-low-poly-5d3d508061e544739e37c685af235684 use when registering new prod
