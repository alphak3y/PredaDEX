import React, { useContext, useState, useEffect } from "react";
import { PredaDexContext } from "../context/Predadex.context";

const CheckAssets = async () => {

    const {
        signedContract,
        signer,
        stateUserAddress,
        provider,
        contractAddress,
      } = useContext(PredaDexContext);

      console.log(signedContract)    
    //   let checkAllUserAssets = signedContract.checkAssets(
    //                                       stateUserAddress
    //                                   ).catch((e)=>window.alert(e.message));

    let checkAllUserAssets = {
        "0x1" : [
          250000000, 
          0
        ],
        "0x2": [
          0,
          100000000
        ],
        "0x3": [
          100000000000,
          200000000
        ]
      };
                                
      console.log(checkAllUserAssets);

}

export default CheckAssets;
