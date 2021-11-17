import '../App.css';
import {useState} from 'react'
import {Container, Navbar, Nav} from 'react-bootstrap'
import shark from '../images/shark.svg'
import fox from '../images/fox.svg'
import { formatEther } from '@ethersproject/units'
import { ChainId, DAppProvider, useEtherBalance, useEthers } from '@usedapp/core'
import { formatUnits } from '@ethersproject/units'

function Navigation() {
    const [isCopied, setIsCopied] = useState(false)
    const [showBalance, setShowBalance] = useState(false)
    const { activateBrowserWallet, account, deactivate } = useEthers()
    const etherBalance = useEtherBalance(account)
    
    const activate = async () => {
        await activateBrowserWallet()
    }

    const disconnect = async () => {
        console.log(deactivate())
    }
    
    const copyAddress = () => {
        navigator.clipboard.writeText(account)
        setIsCopied(true)
        setTimeout(() => {
            setIsCopied(false)
        }, 1500);
    }
    
    return (
    
    <Navbar className="transparent navigation" expand="lg">
        <Container fluid>
            <Navbar.Brand href="#">
                <img src={shark} alt="logo" />
                
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
                <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll>
            </Nav>
            {account && <div className="nav-info">
                <div className="nav-balance">
                   {!showBalance ? <svg className="clickable mar-5" onClick={()=> setShowBalance(!showBalance)} width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.74634 1.47661L6.57145 0.301722L1.86943e-05 6.87315L6.57145 13.4446L7.74634 12.2697L2.3498 6.87315L7.74634 1.47661Z" fill="white"/>
                    </svg>:
                        <svg className="clickable mar-5" onClick={()=> setShowBalance(!showBalance)} width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 12.2697L1.17489 13.4446L7.74632 6.87319L1.17489 0.301758L0 1.47665L5.39654 6.87319L0 12.2697Z" fill="white"/>
                        </svg>
                        
                    }
                    
                   {(showBalance && etherBalance) && formatUnits(etherBalance)}
                </div>
                <div className="nav-account">
                    {`${account.substring(0,5)}...${account.substr(account.length - 3)}`}
                    <svg onClick={copyAddress} className="clickable" style={{marginLeft:"5px"}} width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.10526 0H1.15789C0.521053 0 0 0.531818 0 1.18182V9.45455H1.15789V1.18182H8.10526V0ZM9.8421 2.36364H3.47368C2.83684 2.36364 2.31579 2.89545 2.31579 3.54545V11.8182C2.31579 12.4682 2.83684 13 3.47368 13H9.8421C10.4789 13 11 12.4682 11 11.8182V3.54545C11 2.89545 10.4789 2.36364 9.8421 2.36364ZM9.8421 11.8182H3.47368V3.54545H9.8421V11.8182Z" fill="white"/>
                    </svg>
                    {isCopied && <p className="tooltips-sm">Copied to clipboard</p>}
                </div>
            </div>}
            
            
            
            <button className="btn-nav" onClick={account? disconnect : activate}>{account?"Disconnect":"Connect Wallet"}</button>
            <img src={fox} alt="logo" />
            
        </Navbar.Collapse>
        
    </Container>
</Navbar>

);
}

export default Navigation;



