
import React, {useState, createContext} from 'react'
import usdc from '../images/usdc.png'
import dai from '../images/dai.png'
import usdt from '../images/usdt.png'
import weth from '../images/weth.png'
import link from '../images/link.png'
import wbtc from '../images/wbtc.png'

export const CoinContext = createContext()


export const CoinProvider = (props) => {
    const [coins, setCoins] = useState([
        {
            logo:link,
            shortcut:"LINK",
            name:"LINK",
            address: "0xa36085F69e2889c224210F603D836748e7dC0088",
            decimals: 18
        },
        {
            logo:weth,
            shortcut:"WETH",
            name:"WETH",
            address: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
            decimals: 18
        },
        {   
            logo:usdc,
            shortcut:"USDC",
            name:"USD Coin",
            address: "0xe22da380ee6b445bb8273c81944adeb6e8450422",
            decimals: 6
        },
        {
            logo:dai,
            shortcut:"DAI",
            name:"DAI Stablecoin",
            address: "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa",
            decimals: 18
        }
    ])

    const [firstToken, setFirstToken] = useState({
        logo:link,
        shortcut:"LINK",
        name:"LINK",
        address: "0xa36085F69e2889c224210F603D836748e7dC0088",
        decimals: 18
    })
    const [secondToken, setSecondToken] = useState(null)

    return(
        <CoinContext.Provider value={{coins, setCoins, firstToken, setFirstToken, secondToken, setSecondToken}}>
            {props.children}
        </CoinContext.Provider>
    )
}
