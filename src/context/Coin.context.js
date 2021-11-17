
import React, {useState, createContext} from 'react'
import eth from '../images/eth.png'
import usdc from '../images/usdc.png'
import dai from '../images/dai.png'
import usdt from '../images/usdt.png'
import avax from '../images/avax.png'

export const CoinContext = createContext()


export const CoinProvider = (props) => {
    const [coins, setCoins] = useState([
        {logo:eth,
        shortcut:"ETH",
        name:"Ethereum"
        },
        {logo:usdc,
        shortcut:"USDC",
        name:"USD Coin"
        },
        {logo:dai,
        shortcut:"DAI",
        name:"DAI Stablecoin"
        },
        {logo:usdt,
        shortcut:"USDT",
        name:"Tether"
        },
        {logo:avax,
        shortcut:"AVAX",
        name:"Avalanche"
        },
    ])

    const [firstToken, setFirstToken] = useState(null)
    const [secondToken, setSecondToken] = useState(null)

    return(
        <CoinContext.Provider value={{coins, setCoins, firstToken, setFirstToken, secondToken, setSecondToken}}>
            {props.children}
        </CoinContext.Provider>
    )
}
