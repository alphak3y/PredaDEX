import React, { createContext, useState } from "react";
import { PredaDexAbi } from "../abi/PredaDex.json";
import { ethers, BigNumber } from "ethers";
import predaDexAbi from '../abi/PredaDex.json'
import groupSwapAbi from '../abi/GroupSwap.json'

export const PredaDexContext = createContext();

export const PredaDexProvider = (props) => {
  const contractAddress = "0xB58C923813D1fE56945f15D0B7499A93EdeD6Fa1";
  const groupSwapAddress = "0x67df0ca794467316ac8B951CAFa547B711E671Fc"
  const ALCHEMY = "https://eth-rinkeby.alchemyapi.io/v2/UtS222NKanBSIOdJz3yMWWQjFeC3OtyV";

  const [stateUserAddress, setstateUserAddress] = useState('')
  const [signedContract, setSignedContract] = useState()
  const [signedGroupSwapContract, setSignedGroupSwapContract] = useState()
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

    const groupSwapContract = new ethers.Contract(groupSwapAddress, groupSwapAbi, provider);

    let signedGroupSwapContract = groupSwapContract.connect(signer);

    userAddress = await signer.getAddress();

    setSignedContract(signedContract)

    setSignedGroupSwapContract(signedGroupSwapContract)

    setstateUserAddress(userAddress)

    setProvider(provider)

    setSigner(signer)


  };


  return (
    <PredaDexContext.Provider value={{connectContract, stateUserAddress, signedContract, signedGroupSwapContract, signer, provider,contractAddress, userAssets, setUserAssets}}>
      {props.children}
    </PredaDexContext.Provider>
  );
}
