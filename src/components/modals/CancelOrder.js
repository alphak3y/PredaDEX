import { useContext } from 'react';
import {ModalContext} from '../../context/Modal.context'

function CancelOrder() {
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
            <button className="modal-close-btn" onClick={close }>
                <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.1348 1.51071L13.6581 0L7.80337 5.98929L1.94867 0L0.471909 1.51071L6.3266 7.5L0.471909 13.4893L1.94867 15L7.80337 9.01071L13.6581 15L15.1348 13.4893L9.28013 7.5L15.1348 1.51071Z" fill="#7981A9"/>
                </svg>
            </button>
                <p className="text-start ls negative-margin" style={{fontWeight:"bold"}}>Cancel Order</p>
            <div className="modal-info-wrapper mt-5">
                <p className="modal-info-labels"><img alt="logo" className="icons" height="25px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/BTC_Logo.svg/2000px-BTC_Logo.svg.png"/> BTC</p>
                <svg className="mt-1" width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.17 13L12.59 16.59L14 18L20 12L14 6L12.59 7.41L16.17 11L4 11L4 13L16.17 13Z" fill="#8B94C4"/>
                </svg>
                <p className="modal-info-labels"><img alt="logo" className="icons" height="25px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/BTC_Logo.svg/2000px-BTC_Logo.svg.png"/> BTC</p>
            </div>
            <button className="btns cancel mt-4" onClick={close}>CANCEL</button>
        </div>
    </div>
    
    );
}

export default CancelOrder;
