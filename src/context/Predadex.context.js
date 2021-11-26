import React, { createContext, useState } from "react";
import { PredaDexAbi } from "../abi/PredaDex.json";
import { ethers, BigNumber } from "ethers";
import predaDexAbi from '../abi/PredaDex.json'

export const PredaDexContext = createContext();

export const PredaDexProvider = (props) => {
  const contractAddress = "0x922cbB69C7eB12643fA1E909d2CfC30f220fD954";
  const ALCHEMY = "https://eth-kovan.alchemyapi.io/v2/2oNUyqV6GKtxyE05cDrbkphiAjkNiQZl";

  const [stateUserAddress, setstateUserAddress] = useState('')
  const [signedContract, setSignedContract] = useState()
  const [signer, setSigner] = useState()
  const [provider, setProvider] = useState()
  const [userAssets, setUserAssets] = useState()
  

  let userAddress;

  const connectContract = async () => {
    let provider
    
    if(window.ethereum != null){
      provider = new ethers.providers.Web3Provider(window.ethereum, "any")
    }

    const value = await provider.send("eth_requestAccounts", [0]);

    let signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, predaDexAbi, provider);

    let signedContract = contract.connect(signer);

    userAddress = await signer.getAddress();

    setSignedContract(signedContract)

    setstateUserAddress(userAddress)

    setProvider(provider)

    setSigner(signer)


  };


  return (
    <PredaDexContext.Provider value={{connectContract, stateUserAddress, signedContract, signer, provider,contractAddress, userAssets, setUserAssets}}>
      {props.children}
    </PredaDexContext.Provider>
  );
}
