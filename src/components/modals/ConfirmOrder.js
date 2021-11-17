import { useContext } from 'react';
import {ModalContext} from '../../context/Modal.context'

function ConfirmOrder() {
    const { setIsOpen, closing, setClosing} = useContext(ModalContext)

    const close = () => {
        setClosing(true)
        setTimeout(() => {
            setClosing(false)
            setIsOpen(false)
        }, 1000);
    }
    
    
    return (
    <div className={closing?"modal-wrapper slit-out-vertical": "modal-wrapper"}>
        <div className={closing?"modal-contents pt-1 slit-out-vertical": "modal-contents pt-1"}>
            <button className="modal-close-btn" onClick={close}>
                <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.1348 1.51071L13.6581 0L7.80337 5.98929L1.94867 0L0.471909 1.51071L6.3266 7.5L0.471909 13.4893L1.94867 15L7.80337 9.01071L13.6581 15L15.1348 13.4893L9.28013 7.5L15.1348 1.51071Z" fill="#7981A9"/>
                </svg>
            </button>
            <p className="text-start ls negative-margin" style={{fontWeight:"bold"}}>Confirm order</p>
            <div className="confirm-section">
                <div className="confirm-part">
                    <p className="size-13">From</p>
                    <p className="size-13">~$400.00</p>
                </div>
                <div className="confirm-part">
                    <p className=""><img alt="logo" className="icons" height="30px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/BTC_Logo.svg/2000px-BTC_Logo.svg.png"/> BTC</p>
                    <p className="size-18"> 0.4</p>
                </div>
            </div>
            <svg className="m-3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 16.17L7.41 12.59L6 14L12 20L18 14L16.59 12.59L13 16.17L13 4L11 4L11 16.17Z" fill="#8B94C4"/>
            </svg>

            <div className="confirm-section">
                <div className="confirm-part">
                    <p className="size-13">From</p>
                    <p className="size-13">~$400.00</p>
                </div>
                <div className="confirm-part">
                    <p className=""><img alt="logo" className="icons" height="30px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/BTC_Logo.svg/2000px-BTC_Logo.svg.png"/> BTC</p>
                    <p className="size-18"> 0.4</p>
                </div>
            </div>

            <div className="confirm-part mt-4 mb-4">
                    <p className="size-12">Current Price:</p>
                    <p className="size-9">0.02 ETH = 0.044 BTC</p>
                </div>

                <div className="confirm-part">
                    <p className="size-12">Sending:</p>
                    <p className="size-9">56 Gwei</p>
                </div>

                <div className="confirm-part">
                    <p className="size-12">Pooled:</p>
                    <p className="size-9">120 Gwei</p>
                </div>

                <div className="confirm-part mb-4">
                    <p className="size-12">Total required:</p>
                    <p className="size-9">360 Gwei</p>
                </div>
                <p className="size-12">Output will be sent to: 0x1234....5678</p>
            <button className=" btns full-btn mt-3 ls" onClick={close}>CONFIRM ORDER</button>
        </div>
    </div>
    
    );
}

export default ConfirmOrder;
