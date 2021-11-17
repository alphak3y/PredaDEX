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
      <button onClick={openone}>WithdrawOrder</button>
      <button onClick={opentwo}>WaitingForConfirmation</button>
      <button onClick={openthree}>ConfirmOrder </button>
      <button onClick={openfour}>SelectToken</button>
      <button onClick={opefive}>CancelOrder</button>
      <button onClick={openseven}>Reject</button>
      <button onClick={openeight}>TransactionSubmittedAddCoinToMetaMask</button>
      <MainContent />
      <BottomLines />
      {isOpen && <Modal />}
    </div>
  );
}

export default App;
