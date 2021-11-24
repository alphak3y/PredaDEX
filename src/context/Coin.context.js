
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
            address: "0x514910771af9ca656af840dff83e8264ecf986ca",
            decimals: 18
        },
        {
            logo:weth,
            shortcut:"WETH",
            name:"WETH",
            address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            decimals: 18
        },
        {
            logo:wbtc,
            shortcut:"WBTC",
            name:"WBTC",
            address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
            decimals: 18
        },
        {   
            logo:usdc,
            shortcut:"USDC",
            name:"USD Coin",
            address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            decimals: 6
        },
        {
            logo:dai,
            shortcut:"DAI",
            name:"DAI Stablecoin",
            address: "0x6b175474e89094c44da98b954eedeac495271d0f",
            decimals: 18
        },
        {
            logo:usdt,
            shortcut:"USDT",
            name:"Tether",
            address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            decimals: 18
        }
    ])

    const [firstToken, setFirstToken] = useState({
        logo:link,
        shortcut:"LINK",
        name:"LINK",
        address: "0x514910771af9ca656af840dff83e8264ecf986ca",
        decimals: 18
    })
    const [secondToken, setSecondToken] = useState(null)

    return(
        <CoinContext.Provider value={{coins, setCoins, firstToken, setFirstToken, secondToken, setSecondToken}}>
            {props.children}
        </CoinContext.Provider>
    )
}
