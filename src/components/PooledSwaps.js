import { useState, useContext, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import { PredaDexContext } from "../context/Predadex.context";
import { ethers, utils } from 'ethers'
import { formatEther, formatUnits } from '@ethersproject/units'
import {CoinContext} from '../context/Coin.context'
import erc20Abi from '../abi/ERC20.json'
import CylinderBig from './Cylinder'
import { TransactionsContext } from "@usedapp/core/dist/esm/src/providers/transactions/context";

const Order  = {
    fromToken:   0, //0 - fromToken address
    fromSymbol:  1, //1 - fromToken shortcut
    fromAmount:  2, //2 - fromToken amount
    destToken:   3, //3 - destToken address
    destSymbol:  4, //4 - destToken shortcut
    destAmount:  5, //5 - destToken amount
    groupId:     6, //6 - groupId for getGroup() & getTokens()
    currentGas:  7, //7 - totalGas (current)
    requiredGas: 8, //8 - gasRequired (max)
    percentGas:  9  //9 - gasProgress (percentage)
}

function PooledSwaps(props) {
    const {signedContract,stateUserAddress, provider, signer} = useContext(PredaDexContext);
    const {coins} = useContext(CoinContext)
    const [filter, setFilter] = useState("Open")
    const [openedTrans, setOpenedTrans] = useState(null)
    const [completedTrans, setCompletedTrans] = useState(null)

    const confirmCancel = async (e) => {
        console.log(utils.parseUnits(e.target.dataset.fromamount, 18))
        const cancelTxn = await signedContract.withdraw(
        e.target.dataset.fromaddress,
        e.target.dataset.groupid,
        utils.parseUnits( e.target.dataset.fromamount, 18),
        {
            gasPrice: signer.getGasPrice(),
            gasLimit: 400000
        })
        .catch((e)=>window.alert(e.message))
        cancelTxn
    };
    
    const confirmWithdraw = async (e) => {
        const withdrawTxn = await signedContract.withdraw(
            e.target.dataset.destaddress,
            e.target.dataset.groupid,
            utils.parseUnits( e.target.dataset.destamount, 18),
        {
            gasPrice: signer.getGasPrice(),
            gasLimit: 400000
        })
        .catch((e)=>window.alert(e.message))
        withdrawTxn
    };
    
    // filter transactions on opened, completed and both and store in state
    useEffect(() => {
        let openTransaction = []
        let completedTransaction = []
        let both = []
        let combinedAmounts = []
        
        const run = async () => {
            
            let {groups, amounts} = await signedContract.checkAssets(stateUserAddress);
            let fromTokens = amounts[0]
            let destTokens = amounts[1]
            let zeroHex = "0x0000000000000000000000000000000000000000000000000000000000000000";
            

            for (let i = 0; i < fromTokens.length && groups[i] != zeroHex; i++) {
                
                let groupId = groups[i];
                let {fromToken, destToken} = await signedContract.getTokens(groupId);
                let fromAmount = formatUnits(amounts[i][0]._hex, 0);
                let destAmount = formatUnits(amounts[i][1]._hex, 0);
                let fromContract = new ethers.Contract(fromToken, erc20Abi, provider);
                let destContract = new ethers.Contract(destToken, erc20Abi, provider);
                let fromSymbol = await fromContract.symbol();
                let destSymbol = await destContract.symbol();
                let {totalAmount, totalGas, gasRequired} = await signedContract.checkGroup(groups[0]);
                let currentGas = utils.formatUnits(totalGas, "wei")/(10**9);
                let requiredGas = utils.formatUnits(gasRequired, "wei")/(10**9);
                let percentGas =  (currentGas/requiredGas) * 100;
                if( currentGas >= requiredGas){
                    percentGas = 100;
                }
                
                combinedAmounts.push([
                fromToken,   //0 - fromToken address
                fromSymbol,  //1 - fromToken shortcut
                fromAmount,  //2 - fromToken amount
                destToken,   //3 - destToken address
                destSymbol,  //4 - destToken shortcut
                destAmount,  //5 - destToken amount
                groupId,     //6 - groupId for getGroup() & getTokens()
                currentGas,  //7 - totalGas (current)
                requiredGas, //8 - gasRequired (max)
                percentGas   //9 - percentGas
                ]) 
                
                
            }
            //let tempOpenTransaction = {fromAmount: value[1][Order.fromAmount], destAmount:value[1][Order.destAmount]}
            for (let value of Object.entries(combinedAmounts)) {
                if(value[1][Order.fromAmount] != "0" && value[1][Order.destAmount] == "0" ) {
                    let { returnAmount, distribution, gas } = await signedContract.quoteAndDistribute(value[1][Order.fromToken], value[1][Order.destToken], value[1][Order.fromAmount], 1, 0, 0);
                    let tempOpenTransaction = { fromToken:  value[1][Order.fromToken],
                                                fromSymbol: value[1][Order.fromSymbol], 
                                                fromAmount: formatUnits(value[1][Order.fromAmount],18),
                                                destToken:  value[1][Order.destToken],
                                                destSymbol: value[1][Order.destSymbol],
                                                //decimals needs to be dynamic (i.e. use an API)
                                                destAmount: formatUnits(returnAmount, 6),
                                                groupId:    value[1][Order.groupId],
                                                currentGas: value[1][Order.currentGas], 
                                                requiredGas:value[1][Order.requiredGas],
                                                percentGas: value[1][Order.percentGas]
                                              }
                    openTransaction.push(tempOpenTransaction)
                    // Completed transactions
                }else if(value[1][Order.fromAmount] == "0" && value[1][Order.destAmount] != "0") {
                    let tempCompletedTransaction = { fromToken:  value[1][Order.fromToken],
                                                     fromSymbol: value[1][Order.fromSymbol], 
                                                     fromAmount: formatUnits(value[1][Order.fromAmount],18),
                                                     destToken:  value[1][Order.destToken],
                                                     destSymbol: value[1][Order.destSymbol], 
                                                     destAmount: formatUnits(value[1][Order.destAmount],18),
                                                     groupId:    value[1][Order.groupId],
                                                     currentGas: value[1][Order.currentGas], 
                                                     requiredGas:value[1][Order.requiredGas],
                                                     percentGas: value[1][Order.percentGas]
                                                   }
                    completedTransaction.push(tempCompletedTransaction)
                // Both transactions
                }else {
                    let tempBothTransaction = { fromToken:  value[1][Order.fromToken],
                                                fromSymbol: value[1][Order.fromSymbol], 
                                                fromAmount: formatUnits(value[1][Order.fromAmount],18),
                                                destToken:  value[1][Order.destToken],
                                                destSymbol: value[1][Order.destSymbol], 
                                                destAmount: value[1][Order.destAmount],
                                                groupId:    value[1][Order.groupId],
                                                currentGas: value[1][Order.currentGas], 
                                                requiredGas:value[1][Order.requiredGas],
                                                percentGas: value[1][Order.percentGas]
                    }
                    openTransaction.push(tempBothTransaction)
                    completedTransaction.push(tempBothTransaction)
                }
            }
            setOpenedTrans(openTransaction)
            setCompletedTrans(completedTransaction)
        }
        if(signedContract != undefined) run();
        
        
        
    },[]);

    function findLogo(shortcut) {
        let coinLogo
        coins.map(coin => {
            if(coin.shortcut === shortcut) {
                coinLogo = coin.logo
            }
        } )
        return coinLogo
      }

    
    return (
    <>
    <div className="options-pooled-swaps mb-2">
        <div className="toggle-btn-wrapper ">
            <span  onClick={()=> props.setIsFormVisible(!props.isFormVisible)} className=" toggle-option">Swap</span>
            <span className=" toggle-option active-toggle">Order</span>
        </div>
        <div className="options-pooled-swaps right">
            <button onClick={e => setFilter("Open")} className={filter==="Open"?"btns pooled-btns ls active": "btns pooled-btns ls"} >Open</button>
            <button onClick={e => setFilter("Executed")} className={filter==="Executed"?"btns pooled-btns ls active": "btns pooled-btns ls"} >Executed</button>
        </div>
    </div>
    <div className="table-wrapper-outside">
        <div className="table-wrapper">
            {openedTrans === null || completedTrans === null ?
            <div style={{marginTop:"200px"}}>
                    <CylinderBig />
            </div>:
            openedTrans.length === 0 && completedTrans.length === 0?
                <div>
                    <svg className="mb-5 mt-5" width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M63.2158 148.364L80 152.104L83.186 146.868L84 142H96L96.2275 152.852V158.088L84 162L68.9215 152.104L63.2158 148.364Z" fill="#CDBDB2"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M128.422 148.363L110 152L108.86 146.867L108 142H96.0002L95.8183 152.852V158.088L108 162L123.124 152.104L128.422 148.363Z" fill="#CDBDB2"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M73.8151 51.2268L83.5909 72.0617L88.0743 133.028H103.968L108.859 72.0617L117.781 51.2268H73.8151Z" fill="#F89C35"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M31.018 97.1212L19.6067 127.417L48.135 125.921H66.4742V112.83L65.6592 85.9004L61.5837 88.8926L31.018 97.1212Z" fill="#F89D35"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M161.057 97.1212L172.468 127.417L143.94 125.921H125.6V112.83L126.415 85.9004L130.491 88.8926L161.057 97.1212Z" fill="#F89D35"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M52.6193 100.487L86.0381 101.235L82.3706 116.944L66.4759 113.204L52.6193 100.487Z" fill="#D87C30"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M139.455 100.487L106.036 101.235L109.704 116.944L125.599 113.204L139.455 100.487Z" fill="#D87C30"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M52.6193 100.861L66.4759 112.83V124.799L52.6193 100.861Z" fill="#EA8D3A"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M139.455 100.861L125.599 112.83V124.799L139.455 100.861Z" fill="#EA8D3A"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M66.4738 113.203L82.7756 116.944L88.0741 133.027L84.4058 134.897L66.4738 125.172V113.203Z" fill="#F89D35"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M125.601 113.203L109.299 116.944L104 133.027L107.669 134.897L125.601 125.172V113.203Z" fill="#F89D35"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M66.4762 125.174L63.2158 148.364L84.8162 134.525L66.4762 125.174Z" fill="#EB8F35"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M125.598 125.174L128.859 148.364L107.258 134.525L125.598 125.174Z" fill="#EB8F35"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M86.0365 101.236L88.0746 133.029L81.9611 116.759L86.0365 101.236Z" fill="#EA8E3A"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M106.038 101.236L104 133.029L110.114 116.759L106.038 101.236Z" fill="#EA8E3A"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M47.7285 125.548L66.4757 125.174L63.2153 148.364L47.7285 125.548Z" fill="#D87C30"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M144.346 125.548L125.599 125.174L128.859 148.364L144.346 125.548Z" fill="#D87C30"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M28.5727 158.463L63.2139 148.364L47.7271 125.549L19.6067 127.419L28.5727 158.463Z" fill="#EB8F35"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M163.502 158.463L128.861 148.364L144.348 125.549L172.468 127.419L163.502 158.463Z" fill="#EB8F35"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M83.5929 72.0616L66.0687 85.5266L52.6193 100.488C52.6193 100.488 60.0001 104 66.0001 106C72.0001 104 86.0381 101.61 86.0381 101.61L83.5929 72.0616Z" fill="#E8821E"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M108.482 72.0616L126.006 85.5266L139.455 100.488C139.455 100.488 132.074 104 126.074 106C120.074 104 106.036 101.61 106.036 101.61L108.482 72.0616Z" fill="#E8821E"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M63.2158 148.363L84.8162 134.524L84 148L82 152L68.5143 150.607L63.2158 148.363Z" fill="#DFCEC3"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M128.422 148.363L107.23 134.524L108 148L110 152L123.532 150.607L128.422 148.363Z" fill="#DFCEC3"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M77.0715 107.968L81.5549 116.571L65.6602 112.831L77.0715 107.968Z" fill="#393939"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M28.235 41.5461V45.5797L27.3497 50.4201L24.4969 55.2604L24.9045 76.5502L22.0516 78.0463L26.1271 81.4125L22.8667 84.0307L27.3497 87.771L24.4969 90.0151L31.0177 97.4956L61.5837 88.893C76.5271 77.9216 83.863 72.3112 83.5913 72.0619C83.3196 71.8125 68.9745 64.9411 28.235 41.5461Z" fill="#8E5A30"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M163.84 41.5461V45.5797L164.725 50.4201L167.578 55.2604L167.17 76.5502L170.023 78.0463L165.947 81.4125L169.208 84.0307L164.725 87.771L167.578 90.0151L161.057 97.4956L130.491 88.893C115.547 77.9216 108.212 72.3112 108.483 72.0619C108.755 71.8125 123.1 64.9411 163.84 41.5461Z" fill="#8E5A30"/>
                        <path d="M84.0004 148L72.0004 154L84.0004 152H108L120 154L108 148H98.0004L96.0004 142L94.0004 148H84.0004Z" fill="#393939"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M114.565 107.967L110.082 116.57L125.977 112.83L114.565 107.967Z" fill="#393939"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M18.9578 61.3108L31.462 55.2604L83.5906 72.0615L74.2181 51.2268L28.2351 41.5461L18.9578 61.3108Z" fill="#E88F35"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M173.117 61.3108L160.613 55.2604L108.484 72.0615L117.857 51.2268L163.84 41.5461L168.478 51.4284L173.117 61.3108Z" fill="#E88F35"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M84.694 133.895L83.899 144.403L85.8195 143.13H105.796L108.101 144.403L107.211 133.895L103.491 132.302L88.1245 132.621L84.694 133.895Z" fill="#393939"/>
                        <path d="M108 122.891L110.42 116.975L112.84 122.891L110.42 125.849L108 122.891Z" fill="#438CFB"/>
                    </svg>
                    <h2 className="mt-5">No transactions history</h2>
                </div>
                
                : <table >
                    <thead>
                        <tr>
                            <th>Deposit</th>
                            <th>Receive</th>
                            <th>Status</th>
                            <th>Txn hash</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filter === "Open" ? openedTrans.map(transaction => {
                            return<tr key={transaction.fromAmount + transaction.fromToken}>
                                <td > <img className="logo-coin" src={findLogo(transaction.fromSymbol)}></img>
                                     <span className="shiny"><span className="shiny-inner">{transaction.fromAmount} {transaction.fromSymbol}</span></span></td>
                                <td><img className="logo-coin" src={findLogo(transaction.destSymbol)}></img>{transaction.destAmount} {transaction.destSymbol}  </td>
                                <td> <ProgressBar width={transaction.percentGas}/> </td>
                                <td><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.40796 3.44998L9.41496 6.99998H11.429V-2.47955e-05H4.42896V2.01398L7.97896 2.02098L-4.48227e-05 9.99996L1.42896 11.429L9.40796 3.44998Z" fill="#27F09E"/>
                                </svg>
                            </td>
                            {/* TODO: pass in args for cancel function call */}
                            <td>
                                <button 
                                data-fromaddress={transaction.fromToken} 
                                data-groupid={transaction.groupId} 
                                data-fromamount={transaction.fromAmount} 
                                className="btns cancel p-1" 
                                onClick={confirmCancel}>
                                    Cancel
                                </button>
                                </td>
                        </tr>
                    }):
                    completedTrans.map(transaction => {
                        return<tr key={transaction.fromAmount + transaction.fromToken}>
                           
                            <td> 
                                <img className="logo-coin" src={findLogo(transaction.fromSymbol)}></img>
                                {transaction.fromAmount} {transaction.fromSymbol}
                            </td>
                            <td>
                            <img className="logo-coin" src={findLogo(transaction.destSymbol)}></img>
                            <span className="shiny"><span className="shiny-inner">{transaction.destAmount} {transaction.destSymbol}</span></span></td>
                            <td> <ProgressBar width={transaction.percentGas}/> </td>
                            <td>arrow</td>
                            <td><button                                 
                                data-destaddress={transaction.destToken} 
                                data-groupid={transaction.groupId} 
                                data-destamount={transaction.destAmount} 
                                onClick={confirmWithdraw} 
                                className="btns withdraw p-1">Withdraw</button></td>
                        </tr>
                    })
                }
                {/* <tr >
                    <td >0.4 BTC</td>
                    <td><span className="shiny"><span className="shiny-inner">0.4 BTC</span></span></td>
                    <td> <ProgressBar width={100}/> </td>
                    <td>arrow</td>
                    <td><button  className="btns withdraw p-1">Withdraw</button></td>
                </tr> */}
                
                
                
                
            </tbody>
        </table>
    }
</div>
</div>
</>
);
}

export default PooledSwaps;
