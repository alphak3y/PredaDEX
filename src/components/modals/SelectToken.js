import { useContext } from 'react';
import {ModalContext} from '../../context/Modal.context'
import {CoinContext} from '../../context/Coin.context'

function SelectToken() {
    const { setIsOpen, isFirstToken, closing, setClosing} = useContext(ModalContext)
    const {coins, setFirstToken, setSecondToken} = useContext(CoinContext)
    
    const chooseToken = e => {
        if(isFirstToken) {
            setFirstToken({name:e.target.dataset.name, logo:e.target.dataset.logo, shortcut:e.target.dataset.shortcut})
        }else {
            setSecondToken({name:e.target.dataset.name, logo:e.target.dataset.logo, shortcut:e.target.dataset.shortcut})
        }
        setClosing(true)
        setTimeout(() => {
            setClosing(false)
            setIsOpen(false)
        }, 100);
    }
    
    const close = () => {
        setClosing(true)
        setTimeout(() => {
            setClosing(false)
            setIsOpen(false)
        }, 100);
    }
    
    
    return (
    <div className={closing?"modal-wrapper slit-out-vertical": "modal-wrapper"}>
        <div className={closing?"modal-contents big-modal pt-1 slit-out-vertical": "modal-contents big-modal pt-1"}>
            <button className="modal-back-btn" onClick={close}>
                <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.535 0.514893L0.0500027 8.99989L8.535 17.4849L9.95 16.0709L2.878 8.99989L9.95 1.92889L8.535 0.514893Z" fill="#7981A9"/>
                </svg>
                
            </button>
            <p className="mt-1 ls" style={{fontWeight:"bold"}}>Select a token</p>
            <div className="input-group-div">
                <div className="input-group-wrapper">
                    <svg  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.677 19.6069L12.962 13.8909C10.4197 15.6984 6.91643 15.2562 4.90287 12.8738C2.8893 10.4914 3.03715 6.96349 5.243 4.7579C7.44826 2.55134 10.9765 2.40285 13.3594 4.41631C15.7422 6.42977 16.1846 9.93334 14.377 12.4759L20.092 18.1919L18.678 19.6059L18.677 19.6069ZM9.485 4.99988C7.5887 4.99946 5.95269 6.33057 5.56747 8.18733C5.18225 10.0441 6.15371 11.9162 7.89367 12.6701C9.63364 13.4241 11.6639 12.8527 12.7552 11.3019C13.8466 9.75117 13.6991 7.64721 12.402 6.2639L13.007 6.8639L12.325 6.1839L12.313 6.1719C11.5648 5.41907 10.5464 4.99702 9.485 4.99988Z" fill="#7981A9"/>
                    </svg>
                    <input className="input-group" placeholder="Search by name or paste address"/>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.59 7L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41L15.59 7Z" fill="#7981A9"/>
                    </svg>
                    
                </div>
                <div className="btn-group-wrapper mt-3">
                    {coins.map((coin, index) => {
                        return (
                        index < 4 && <button onClick={chooseToken} 
                        data-name={coin.name} 
                        data-logo={coin.logo} 
                        data-shortcut={coin.shortcut}  
                        key={coin.shortcut} 
                        className="btn-token ">
                        <img onClick={chooseToken}                            
                        data-name={coin.name} 
                        data-logo={coin.logo} 
                        data-shortcut={coin.shortcut}   alt="logo" className="icons" height="16px" src={coin.logo}/> {coin.shortcut}</button>
                        )
                    })}
                    
                    
                </div>
            </div>
            
            <div className="token-list">
                {coins.map((coin, index) => {
                    return (
                    <div onClick={chooseToken}                            
                    data-name={coin.name} 
                    data-logo={coin.logo} 
                    data-shortcut={coin.shortcut}  
                    key={coin.name}  
                    className="token-list-item">
                    <div className="token-list-whole"  
                    onClick={chooseToken}                         
                    data-name={coin.name} 
                    data-logo={coin.logo} 
                    data-shortcut={coin.shortcut}  >
                    <img alt="logo"
                    onClick={chooseToken}                         
                    data-name={coin.name} 
                    data-logo={coin.logo} 
                    data-shortcut={coin.shortcut} className="mr-2" height="45px" src={coin.logo}/> 
                    <div className="token-list-label"
                    onClick={chooseToken}                         
                    data-name={coin.name} 
                    data-logo={coin.logo} 
                    data-shortcut={coin.shortcut}>
                    <p className="token-label"
                    onClick={chooseToken}                         
                    data-name={coin.name} 
                    data-logo={coin.logo} 
                    data-shortcut={coin.shortcut}>{coin.name}</p>
                    <p className="token-label size-13"
                    onClick={chooseToken}                         
                    data-name={coin.name} 
                    data-logo={coin.logo} 
                    data-shortcut={coin.shortcut}>{coin.shortcut}</p>
                </div>
            </div>
            <p className="m-3"                         
            onClick={chooseToken}                         
            data-name={coin.name} 
            data-logo={coin.logo} 
            data-shortcut={coin.shortcut}>0</p>
        </div>
        )
    })}
    
    
    
</div>



</div>
</div>

);
}

export default SelectToken;
