import { useState, useContext, useEffect } from "react";
import Vector from "../images/Vector.svg";
import BTC from "../images/BTC.svg";
import question from "../images/question.svg";
import arrow from "../images/Arrow.svg";
import { PredaDexContext } from "../context/Predadex.context";
import { ModalContext } from "../context/Modal.context";
import { CoinContext } from "../context/Coin.context";
import { formatUnits,formatEther, parseEther, parseUnits } from '@ethersproject/units'
import { Contract } from '@ethersproject/contracts'
import erc20Abi from '../abi/ERC20.json'
import predaDexAbi from '../abi/PredaDex.json'
import { ethers, Signer, utils, BigNumber } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import { useContractFunction, useEtherBalance, useEthers, useTokenBalance, useTokenAllowance, useConfig } from '@usedapp/core';

function Form() {
  const { setIsOpen, setWhichModalToOpen, setIsFirstToken } = useContext(ModalContext);
  const {firstToken, secondToken, daiToken, wethToken} = useContext(CoinContext);
  const { account } = useEthers()
  const [firstTokenValue, setFirstTokenValue] = useState(0)
  const [userGweiAmount, setUserGweiAmount] = useState(0)
  const firstTokenBalance = useTokenBalance(firstToken.address, account)
  const secondTokenBalance = useTokenBalance(secondToken && secondToken.address, account)
  const [secondTokenValue, setSecondTokenValue] = useState(0)
  const etherBalance = useEtherBalance(account)
  const {
    connectContract,
    signedContract,
    signer,
    stateUserAddress} = useContext(PredaDexContext);
  const [firstTokenToDAI, setFirstTokenToDAI] = useState(0)
  const [secondTokenToDAI, setSecondTokenToDAI] = useState(0)
  const [gweiToDAI, setGweiToDAI] = useState(0)
  const [remainingGwei, setRemainingGwei] = useState(0)
    
  let secondTokenBalanceInt = secondTokenBalance && formatUnits(secondTokenBalance, secondToken.decimals)
  let balance = etherBalance && formatEther(etherBalance)  
  const predaDexAddress = "0x903d6Fee0564A56e0979808CEFa5F4De5FA89365"
  let erc20Interface = new utils.Interface(erc20Abi)
  let fromTokenContract = new Contract(firstToken.address, erc20Interface)
  let predaDexInterface = new utils.Interface(predaDexAbi)

  useEffect( async() => {
    async function connectingContract() {
      await connectContract()
    }
    if(account){
    connectingContract()
  }
  },[account]);
  
  useEffect(() => {
    erc20Interface = new utils.Interface(erc20Abi)
    fromTokenContract = new Contract(firstToken.address, erc20Interface)
  },[firstToken.address]);


  
   const setFirstInput = e => {
     let inputVal = e.target.value
     let changedVal = inputVal.replace(',', '.')
     setFirstTokenValue(changedVal)
    
   }

   const setMaxBalanceToInput = () => {
     let number =formatUnits(firstTokenBalance, firstToken.decimals)
    setFirstTokenValue(number)
   }

     // Calculating first token to DAI
  useEffect(() => {
    const calculate = async () => {
      if(account && firstToken.address!= null && firstTokenValue != ""){
        let { returnAmount } = await signedContract.quoteAndDistribute(firstToken.address, daiToken.address, utils.parseUnits(firstTokenValue,firstToken.decimals), 1, 0, 0)
        let value = parseFloat(formatUnits(returnAmount._hex, daiToken.decimals)).toFixed(2)
        setFirstTokenToDAI(value)
      }
    }
    calculate()
  },[firstTokenValue, firstToken && firstToken.address]);


  // Calculate remaining gas for swap group
  useEffect(() => {
    const calculate = async () => {
    if(account && firstToken != null && firstToken.address!= null &&secondToken != null && secondToken.address != null && secondTokenBalance){
      let groupId = await signedContract.getGroup(firstToken.address, secondToken.address);
      console.log(groupId);
      let {totalAmount, totalGas, gasRequired} = await signedContract.checkGroup(groupId);
      console.log(totalGas, gasRequired);
      let value = parseInt(utils.formatUnits(gasRequired,"gwei")) - parseInt(utils.formatUnits(totalGas,"gwei"));
      setRemainingGwei(value);
    }
  }
    calculate()
  },[secondTokenBalance, secondToken && secondToken.address, firstToken.address,firstTokenValue]);

  // Calculating second token to DAI
  useEffect(() => {
    const calculate = async () => {
    if(account && firstToken != null && firstToken.address!= null &&secondToken != null && secondToken.address != null && firstTokenValue != "" && secondTokenBalance){
      let val = parseInt(secondTokenValue)
      let { returnAmount } = await signedContract.quoteAndDistribute(secondToken.address, daiToken.address, utils.parseUnits(val.toString(),secondToken.decimals), 1, 0, 0)
      let value = parseFloat(formatUnits(returnAmount._hex, daiToken.decimals)).toFixed(2)
      setSecondTokenToDAI(value)
    }
  }
  calculate()
},[secondTokenBalance, secondToken && secondToken.address, firstToken.address,firstTokenValue]);

    // Calculating GWEI to DAI
    useEffect(() => {
      const calculate = async () => {
        if(account && userGweiAmount != "" ){
          const ethAmountObj = utils.parseUnits(userGweiAmount.toString(), "gwei")
          const ethAmount = formatUnits(ethAmountObj._hex, wethToken.decimals)
          let { returnAmount } = await signedContract.quoteAndDistribute(wethToken.address, daiToken.address, utils.parseUnits(ethAmount,wethToken.decimals), 1, 0, 0)
          let value = parseFloat(formatUnits(returnAmount._hex, daiToken.decimals)).toFixed(2)
        setGweiToDAI(value)
      }
    }
    calculate()
  },[userGweiAmount]);


  // Calculating first token to second token amount
  useEffect(() => {
    const calculate = async () => {
      if(account && secondToken != null && firstToken.address!= null && firstTokenValue != ""){
        let { returnAmount, distribution, gas } = await signedContract.quoteAndDistribute(firstToken.address, secondToken.address, utils.parseUnits(firstTokenValue,firstToken.decimals), 1, 0, 0)
        let value = parseFloat(formatUnits(returnAmount._hex,secondToken.decimals)).toPrecision(5)
        setSecondTokenValue(value)
      }
    }
    calculate()
  },[firstTokenValue, firstToken && firstToken.address, secondToken && secondToken.address]);
  
  const openModalForFirstToken = () => {
    setWhichModalToOpen("SelectToken")
    setIsFirstToken(true)
    setIsOpen(true)
  }
  
  const openModalForSecondToken = () => {
    setWhichModalToOpen("SelectToken")
    setIsFirstToken(false)
    setIsOpen(true)
  }
  
  const approveToken = () => {
    sendApprove(predaDexAddress, MaxUint256)
  }

  let allowance = useTokenAllowance(firstToken.address,account,predaDexAddress)
  
  let isApproved = allowance && allowance._hex != "0x00"

  const { state: stateApprove, send: sendApprove } = useContractFunction(fromTokenContract, 'approve', { transactionName: 'Approve'}, Signer)
  


  const confirmDeposit = async () => {
    let {groups, amounts} = await signedContract.checkAssets(stateUserAddress);
     const depositTxn = await signedContract.deposit(
        firstToken.address,
        secondToken.address,
        utils.parseUnits(firstTokenValue.toString(),firstToken.decimals),
        {
          gasPrice: signer.getGasPrice(),
          gasLimit: 400000,
          value: utils.parseUnits(userGweiAmount.toString(), 9)
        })
      .catch((e)=>window.alert(e.message))
  };

  return (
  <div>
    
    {/*First  window*/}
    <div className="form-wrapper-outside">
      <div className="form-wrapper">
        {/*Balance label above input field*/}
        <div className="form-row form-row-label">
          <div className="label">Balance: {firstToken == null ? "0.00" : firstTokenBalance && parseFloat(formatUnits(firstTokenBalance, firstToken.decimals)).toPrecision(6)} {firstToken == null ? "BTC" : firstToken.shortcut}</div>
        </div>
        <div className="form-row ">
          {/* Deposit dropdown */}
          <div className="form-col form-col-sm clickable" onClick={openModalForFirstToken}>
            <div className="label label-dropdown">Deposit</div>
            <div className="deposit-row">
              <img src={firstToken == null ? BTC : firstToken.logo} alt="btc" style={{ marginLeft: "-30px" }}></img>
              <p>{firstToken == null ? "BTC":firstToken.shortcut}</p>
              <img src={Vector} alt="vector"></img>
            </div>
          </div>
          {/*Input field*/}
          <div className="form-col form-col-lg border-outline">
            <div className="input-space">
              <button className="max-button" onClick={setMaxBalanceToInput}> Max</button>
              <input
              value={firstTokenValue}
              onChange={setFirstInput}
              placeholder="0.0"
         
              className="deposit-input-field"
              />
            </div>
            {/* Label inside input field*/}
            <div>
              <p className="label label-inside-value">≈ {firstTokenToDAI} USD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/*Middle arrow*/}
    <div className="form-row arrow">
      <img src={arrow} alt="arrow"></img>
    </div>
    {/*Second window*/}
    <div className="form-wrapper-outside">
      <div className="form-wrapper">
        {/* Balance labels above input fields*/}
        <div className="form-row form-row-label ">

          
        </div>
        <div className="form-row mt-4">
          {/* Receive dropdown */}
          {secondToken == null ? <div
            onClick={openModalForSecondToken}
            className="form-col form-col-sm clickable"
            style={{ marginRight: "16px" }}
            >
            <div
            className="label label-dropdown"
            style={{ marginLeft: "-20px" }}
            >
            Receive
          </div>
          <div className="deposit-row" style={{ marginLeft: "7px" }}>
            <img src={question} alt="btc" className="question"></img>
            <button className="select-a-token-button">
              <p>Select a token </p>
            </button>
          </div>
        </div>
        :
        (<div className="form-col form-col-sm click clickable" onClick={openModalForSecondToken} style={{marginRight:"20px"}}>
          <div className="label label-dropdown">Receive</div>
          <div className="deposit-row">
            <img src={secondToken == null ? BTC : secondToken.logo} alt="btc" style={{ marginLeft: "-30px" }}></img>
            <p>{secondToken.shortcut}</p>
            <img src={Vector} alt="vector"></img>
          </div>
        </div>)
      }
      {/*First input field in second window*/}
      <div
      className="form-col form-col-sm border-outline"
      style={{ marginRight: "16px" }}
      >
      <div className="input-space">
      <div className="label label-position">
            Balance: {secondToken == null ? "0.00" : secondTokenBalance && parseFloat(secondTokenBalanceInt).toPrecision(6)} {secondToken == null ? "" : secondToken.shortcut}
          </div>
        <input
        type="text"
        placeholder="0.0"
        disabled
        value={secondTokenValue}
        className="receive-input-field"
        />
      </div>
      {/*Label inside input field*/}
      <div>
        <p className="label label-inside-value">≈ {secondTokenToDAI} USD</p>
      </div>
    </div>
    {/*Second input field in second window*/}
    <div className="form-col form-col-sm border-outline">
      {/*Label inside input field*/}
      <p className="label label-inside-text">Gwei</p>
      <div className="input-space" style={{ paddingTop: "0px" }}>
      <div className="label label-position">Next Swap: {remainingGwei != 0 && remainingGwei} {secondToken == null ? "" : " Gwei"} </div>
        <input
        type="text"
        placeholder="0"
        onChange={e => setUserGweiAmount(e.target.value)}
        value={userGweiAmount}
        className="receive-input-field"
        />
      </div>
      {/*Label inside input field*/}
      <div>
        <p
        className="label label-inside-value"
        style={{ marginTop: "-5px" }}
        >
        ≈ {gweiToDAI} USD
      </p>
    </div>
  </div>
</div>
</div>
</div>
<div className="form-row">
  { !isApproved ? <button className=" float-above allow-confirmation-buttons allow-button" onClick={approveToken}>
    <img src={firstToken == null ? BTC : firstToken.logo} alt="btc"></img>
    Allow PredaDEX to use your {firstToken == null ? "BTC":firstToken.shortcut}
  </button>
  :
  <button disabled={!secondToken} type="submit" className="float-above allow-confirmation-buttons confirmation-button" onClick={confirmDeposit}>
    CONFIRM
  </button>}
</div>

</div>
);
}

export default Form;
