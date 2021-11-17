import { useContext } from 'react';
import {ModalContext} from '../../context/Modal.context'

function Reject() {
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
            <p className="text-start ls negative-margin" style={{fontWeight:"bold"}}>Error</p>
            <div className="center">
                <svg width="49" height="43" viewBox="0 0 49 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M46.5068 42.8701H2.49091C1.64241 42.8701 0.85838 42.4174 0.434141 41.6826C0.00990325 40.9478 0.00990891 40.0425 0.434156 39.3077L22.4409 1.30766C22.8655 0.574045 23.6489 0.122314 24.4965 0.122314C25.3441 0.122314 26.1275 0.574045 26.552 1.30766L48.5588 39.3077C48.9828 40.0421 48.9831 40.9469 48.5594 41.6816C48.1357 42.4163 47.3525 42.8693 46.5044 42.8701H46.5068ZM22.125 30.9952V35.7452H24.3409H24.4953H24.6497H26.8703V30.9952H22.125ZM22.125 14.3702V26.2452H26.875V14.3702H22.125Z" fill="#F05858"/>
                </svg>
                
            </div>
            <p className="mt-3" style={{color: "#F05858"}}>Transaction rejected</p>
            
            <button className=" btns full-btn mt-3 ls" onClick={close}>Dismiss</button>
        </div>
    </div>
    
    );
}

export default Reject;
