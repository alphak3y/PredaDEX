import { useState, useContext } from "react";
import Vector from "../images/Vector.svg";
import BTC from "../images/BTC.svg";
import question from "../images/question.svg";
import arrow from "../images/Arrow.svg";
import { ModalContext } from "../context/Modal.context";
import { CoinContext } from "../context/Coin.context";


function Form() {
  const [confirmationButton, setConfirmationButton] = useState(false);
  const { setIsOpen, setWhichModalToOpen, setIsFirstToken } = useContext(ModalContext);
  const {firstToken, secondToken} = useContext(CoinContext)

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

  return (
    <div>
      {/*First  window*/}
      <div className="form-wrapper-outside">
        <div className="form-wrapper">
          {/*Balance label above input field*/}
          <div className="form-row form-row-label">
            <div className="label">Balance : 35.64 BTC</div>
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
                  placeholder="0.25"
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
            <div className="label ">Balance : 35.64 ETH</div>
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
          <button className="allow-confirmation-buttons allow-button">
            <img src={BTC} alt="btc"></img>
            Allow PredaDEX to use your BTC
          </button>
        </div>
      )}
    </div>
  );
}

export default Form;
