import React, { createContext, useState } from "react";
import { PredaDexAbi } from "../abi/PredaDex.json";
import { ethers, BigNumber } from "ethers";
import predaDexAbi from '../abi/PredaDex.json'

export const PredaDexContext = createContext();

export const PredaDexProvider = (props) => {
  const contractAddress = "0xCD8a1C3ba11CF5ECfa6267617243239504a98d90";
  const ALCHEMY = "https://eth-mainnet.alchemyapi.io/v2/XLbyCEcaLhQ3x_ZaKBmZqNp8UGgNGX2F";

  const [stateUserAddress, setstateUserAddress] = useState('')
  const [signedContract, setSignedContract] = useState()
  const [signer, setSigner] = useState()
  const [provider, setProvider] = useState()
  

  let userAddress;

  const connectContract = async () => {
    let provider
    
    if(window.ethereum != null){
      provider = new ethers.providers.Web3Provider(window.ethereum, "any")
    }

    await provider.send("eth_requestAccounts", [0]);
    let signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, predaDexAbi, provider);

    let signedContract = contract.connect(signer);

    userAddress = await signer.getAddress();

    setSignedContract(signedContract)

    setstateUserAddress(userAddress)

    setProvider(provider)

    setSigner(signer)

    console.log('success', signer, signedContract, userAddress, provider)

  };


  return (
    <PredaDexContext.Provider value={{connectContract, stateUserAddress, signedContract, signer, provider,contractAddress}}>
      {props.children}
    </PredaDexContext.Provider>
  );
}
