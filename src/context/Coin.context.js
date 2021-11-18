
import React, {useState, createContext} from 'react'
import eth from '../images/eth.png'
import usdc from '../images/usdc.png'
import dai from '../images/dai.png'
import usdt from '../images/usdt.png'
import avax from '../images/avax.png'

export const CoinContext = createContext()


export const CoinProvider = (props) => {
    const [coins, setCoins] = useState([
        {
            logo:eth,
            shortcut:"WETH",
            name:"Wrapped Ether",
            address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
        },
        {   
            logo:usdc,
            shortcut:"USDC",
            name:"USD Coin",
            address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
        },
        {
            logo:dai,
            shortcut:"DAI",
            name:"DAI Stablecoin",
            address: "0x6b175474e89094c44da98b954eedeac495271d0f"
        },
        {
            logo:usdt,
            shortcut:"USDT",
            name:"Tether",
            address: "0xdac17f958d2ee523a2206206994597c13d831ec7"
        },
        { 
            logo:avax,
            shortcut:"AVAX",
            name:"Avalanche",
            address: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"
        },
    ])

    const [firstToken, setFirstToken] = useState({
        logo:eth,
        shortcut:"WETH",
        name:"Wrapped Ether",
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    })
    const [secondToken, setSecondToken] = useState(null)

    return(
        <CoinContext.Provider value={{coins, setCoins, firstToken, setFirstToken, secondToken, setSecondToken}}>
            {props.children}
        </CoinContext.Provider>
    )
}
