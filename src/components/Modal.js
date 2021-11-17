import { useContext } from "react";
import CancelOrder from "./modals/CancelOrder";
import WaitingForConfirmation from "./modals/WaitingForConfirmation";
import WithdrawOrder from "./modals/WithdrawOrder";
import {ModalContext} from '../context/Modal.context'
import ConfirmOrder from "./modals/ConfirmOrder";
import SelectToken from "./modals/SelectToken";
import Reject from "./modals/Reject";
import TransactionSubmittedAddCoinToMetaMask from "./modals/TransactionSubmittedAddCoinToMetaMask";


function Modal() {
  const {isOpen, setIsOpen, whichModalToOpen, closing, setClosing} = useContext(ModalContext)


  const close = () => {
    setClosing(true)
    setTimeout(() => {
        setClosing(false)
        setIsOpen(false)
    }, 600);
  }
  

  return (
    <>
    <div className={closing? "modal-container slide-out-top ": "modal-container"} onClick={close}>
    </div>
      {whichModalToOpen === "WithdrawOrder" && <WithdrawOrder />}
     {whichModalToOpen === "WaitingForConfirmation" && <WaitingForConfirmation />}
      {whichModalToOpen === "ConfirmOrder" && <ConfirmOrder />}
      {whichModalToOpen === "SelectToken" && <SelectToken />}
      {whichModalToOpen === "CancelOrder" && <CancelOrder />}
      {whichModalToOpen === "Rejected" && <Reject />}
      {whichModalToOpen === 'TransactionSubmittedAddCoinToMetaMask' && <TransactionSubmittedAddCoinToMetaMask />}
</>
  );
}

export default Modal;
