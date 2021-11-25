import { useContext } from "react";
import "./App.css";
import Navigation from "./components/Navbar";
import BottomLines from "./components/BottomLines";
import MainContent from "./components/MainContent";
import Modal from "./components/Modal";
import { ModalContext } from "./context/Modal.context";

function App() {
  const { isOpen, setIsOpen, whichModalToOpen, setWhichModalToOpen } = useContext(ModalContext);

  const openone = () => {
    setWhichModalToOpen("WithdrawOrder");
    setIsOpen(true);
  };

  const opentwo = () => {
    setWhichModalToOpen("WaitingForConfirmation");
    setIsOpen(true);
  };

  const openthree = () => {
    setWhichModalToOpen("ConfirmOrder");
    setIsOpen(true);
  };

  const openfour = () => {
    setWhichModalToOpen("SelectToken");
    setIsOpen(true);
  };

  const opefive = () => {
    setWhichModalToOpen("CancelOrder");
    setIsOpen(true);
  };


  const openseven = () => {
    setWhichModalToOpen("Rejected");
    setIsOpen(true);
  };
  const openeight = () => {
    setWhichModalToOpen("TransactionSubmittedAddCoinToMetaMask");
    setIsOpen(true);
  };

  return (
    <div className="App">
      <Navigation />
      <button className="temp-btn" onClick={openone}>WithdrawOrder</button>
      <button className="temp-btn" onClick={opentwo}>WaitingForConfirmation</button>
      <button className="temp-btn" onClick={openthree}>ConfirmOrder </button>
      <button className="temp-btn" onClick={openfour}>SelectToken</button>
      <button className="temp-btn" onClick={opefive}>CancelOrder</button>
      <button className="temp-btn" onClick={openseven}>Reject</button>
      <button className="temp-btn" onClick={openeight}>TransactionSubmittedAddCoinToMetaMask</button>
      <MainContent />
      <BottomLines />
      {isOpen && <Modal />}
    </div>
  );
}

export default App;
