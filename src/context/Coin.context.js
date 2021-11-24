
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
            shortcut:"LINK",
            name:"LINK",
            address: "0xa36085F69e2889c224210F603D836748e7dC0088",
            decimals: 18
        },
        {   
            logo:usdc,
            shortcut:"USDC",
            name:"USD Coin",
            address: "0x7079f3762805cff9c979a5bdc6f5648bcfee76c8",
            decimals: 18
        },
        {
            logo:dai,
            shortcut:"DAI",
            name:"DAI Stablecoin",
            address: "0xC4375B7De8af5a38a93548eb8453a498222C4fF2",
            decimals: 18
        },
        {
            logo:usdt,
            shortcut:"USDT",
            name:"Tether",
            address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            decimals: 18
        }
        // { 
        //     logo:avax,
        //     shortcut:"AVAX",
        //     name:"Avalanche",
        //     address: ""
        // },
    ])

    const [firstToken, setFirstToken] = useState({
        logo:eth,
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
