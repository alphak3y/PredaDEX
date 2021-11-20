import { useState, useContext, useEffect } from "react";
import Vector from "../images/Vector.svg";
import BTC from "../images/BTC.svg";
import question from "../images/question.svg";
import arrow from "../images/Arrow.svg";
import { ModalContext } from "../context/Modal.context";
import { CoinContext } from "../context/Coin.context";
import { formatUnits } from '@ethersproject/units'
import { Contract } from '@ethersproject/contracts'
import erc20Abi from '../abi/ERC20.json'
import { utils } from 'ethers'
import { ethers, Signer } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import { useContractFunction, useEtherBalance, useEthers, useTokenBalance, useSendTransaction, useTokenAllowance } from '@usedapp/core';




function Form() {
  const [confirmationButton, setConfirmationButton] = useState(false);
  const { setIsOpen, setWhichModalToOpen, setIsFirstToken } = useContext(ModalContext);
  const {firstToken, secondToken} = useContext(CoinContext);
  const { account } = useEthers()
  const predaDexContract = "0xCD8a1C3ba11CF5ECfa6267617243239504a98d90"
  let erc20Interface
  let fromTokenContract

  erc20Interface = new utils.Interface(erc20Abi)
  fromTokenContract = new Contract(firstToken.address, erc20Interface)
  useEffect(() => {
    erc20Interface = new utils.Interface(erc20Abi)
    fromTokenContract = new Contract(firstToken.address, erc20Interface)
    console.log("")
  },[firstToken.address]);


  const test = firstToken.address
  const firstTokenBalance = useTokenBalance(firstToken.address, account)
  const etherBalance = useEtherBalance(account)

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

  const { state, send } = useContractFunction(fromTokenContract, 'approve', { transactionName: 'Approve'}, Signer)

  const approveToken = () => {
      console.log("fromTokenContract")
      send(predaDexContract, MaxUint256)
    }
  console.log("token alllowance")
  console.log(useTokenAllowance(firstToken.address,account,predaDexContract))

  return (
    <div>
      {/*First  window*/}
      <div className="form-wrapper-outside">
        <div className="form-wrapper">
          {/*Balance label above input field*/}
          <div className="form-row form-row-label">
            <div className="label">Balance : {firstToken == null ? "0.00" : firstTokenBalance && parseFloat(firstTokenBalance._hex,16)} {firstToken == null ? "BTC" : firstToken.shortcut}</div>
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
                <button className="max-button"> Max</button>
                <input
                  type="text"
                  placeholder="0.0"
                  className="deposit-input-field"
                />
              </div>
              {/* Label inside input field*/}
              <div>
                <p className="label label-inside-value">≈ $16000.43</p>
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
          <div className="form-row form-row-label">
            <div className="label" style={{ paddingRight: "120px" }}>
              Balance : 0.00
            </div>
            <div className="label ">Balance : {etherBalance && formatUnits(etherBalance)} ETH</div>
          </div>
          <div className="form-row">
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
          <div className="label label-dropdown">Deposit</div>
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
                <input
                  type="text"
                  placeholder="0.0"
                  className="receive-input-field"
                />
              </div>
              {/*Label inside input field*/}
              <div>
                <p className="label label-inside-value">≈ $0</p>
              </div>
            </div>
            {/*Second input field in second window*/}
            <div className="form-col form-col-sm border-outline">
              {/*Label inside input field*/}
              <p className="label label-inside-text">Gwei</p>
              <div className="input-space" style={{ paddingTop: "0px" }}>
                <input
                  type="text"
                  placeholder="15"
                  className="receive-input-field"
                />
              </div>
              {/*Label inside input field*/}
              <div>
                <p
                  className="label label-inside-value"
                  style={{ marginTop: "-5px" }}
                >
                  ≈ $59.2817
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Confirm Button*/}
      {confirmationButton && (
        <div className="form-row ">
          <button className="allow-confirmation-buttons confirmation-button">
            CONFIRM
          </button>
        </div>
      )}
      {/*Allow Button*/}
      {!confirmationButton && (
        <div className="form-row">
          <button className="allow-confirmation-buttons allow-button" onClick={approveToken}>
            <img src={firstToken == null ? BTC : firstToken.logo} alt="btc"></img>
            Allow PredaDEX to use your {firstToken == null ? "BTC":firstToken.shortcut}
          </button>
        </div>
      )}
    </div>
  );
}

export default Form;
