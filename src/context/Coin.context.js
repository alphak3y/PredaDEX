
import React, {useState, createContext, useEffect} from 'react'
import usdc from '../images/usdc.png'
import dai from '../images/dai.png'
import weth from '../images/weth.png'
import link from '../images/link.png'
import { useMoralis  } from "react-moralis";


export const CoinContext = createContext()

export const CoinProvider = (props) => {
    const [coinsMetaData, setCoinsMetaData] = useState(null)
    const { Moralis, isInitialized } = useMoralis();
    Moralis.start({serverUrl:"https://qynxi24ohr2y.usemoralis.com:2053/server", appId:"sStPxZSaPOooxLi4261bR9cChQWRDdzbjAJ3yf5S" })


    useEffect(() => {
          const geting = async () => {
            const options = { chain: "eth", addresses: [
            "0x514910771af9ca656af840dff83e8264ecf986ca",
            "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            "0x6b175474e89094c44da98b954eedeac495271d0f"
            ] 
            };
            const tokenMetadata = await Moralis.Web3API.token.getTokenMetadata(options);
            setCoinsMetaData(tokenMetadata)
        }
        geting()

        },[isInitialized]);



    const [coins, setCoins] = useState([
        {
            logo:link,
            shortcut:"LINK",
            name:"LINK",
            address: "0x01be23585060835e02b77ef475b0cc51aa1e0709",
            decimals: 18
        },
        {
            logo:weth,
            shortcut:"WETH",
            name:"WETH",
            address: "0xc778417e063141139fce010982780140aa0cd5ab",
            decimals: 18
        },
        {   
            logo:usdc,
            shortcut:"USDC",
            name:"USD Coin",
            address: "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b",
            decimals: 6
        },
        {
            logo:dai,
            shortcut:"DAI",
            name:"DAI Stablecoin",
            address: "0xc7ad46e0b8a400bb3c915120d284aafba8fc4735",
            decimals: 18
        }
    ])

    const [firstToken, setFirstToken] = useState({
        logo:link,
        shortcut:"LINK",
        name:"LINK",
        address: "0x01be23585060835e02b77ef475b0cc51aa1e0709",
        decimals: 18
    })

    const [secondToken, setSecondToken] = useState(null)

    const [daiToken, setDaiToken] = useState({
        logo:dai,
        shortcut:"DAI",
        name:"DAI Stablecoin",
        address: "0xc7ad46e0b8a400bb3c915120d284aafba8fc4735",
        decimals: 18
    })

    const [wethToken, setWethToken] = useState({
        logo:weth,
        shortcut:"WETH",
        name:"WETH",
        address: "0xc778417e063141139fce010982780140aa0cd5ab",
        decimals: 18
    })

const coinCopy = coins
    if(coinsMetaData != null) {
        coinCopy.map((coin, index)=> {
            coin.decimals = parseInt(coinsMetaData[index].decimals)
            coin.shortcut = coinsMetaData[index].symbol
            coin.name = coinsMetaData[index].name
            coin.logo = coinsMetaData[index].thumbnail
        })
    }
    
   
    return(
        <CoinContext.Provider value={{coins:coinCopy, setCoins, firstToken, setFirstToken, secondToken, setSecondToken, daiToken, setDaiToken, wethToken, setWethToken}}>
            {props.children}
        </CoinContext.Provider>
    )
}
