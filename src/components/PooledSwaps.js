import { useState, useContext, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import CheckAssets from "./CheckAssets";
import { PredaDexContext } from "../context/Predadex.context";



function PooledSwaps(props) {
    
    const {userAssets, setUserAssets} = useContext(PredaDexContext);
    const [filter, setFilter] = useState("Open")
    const [openedTrans, setOpenedTrans] = useState([])
    const [completedTrans, setCompletedTrans] = useState([])
    const [bothTrans, setBothTrans] = useState([])
    const [realData, setRealData] = useState(
        [
            [
              250000000, 
              0
            ],
            [
              0,
              100000000
            ],
            [
              100000000000,
              200000000
            ]
          ]
    )
    
    
    
    // filter transactions on opened, completed and both and store in state
    useEffect(() => {
        let openTransaction = []
        let completedTransaction = []
        let both = []
        
        for (let value of Object.entries(realData)) {
            // Opened transactions
            if(value[1][0] > 0 && value[1][1]  === 0 ) {
                let tempOpenTransaction = {from: value[1][0], to:value[1][1]}
                openTransaction.push(tempOpenTransaction)
                //   completed transactions
            }else if(value[1][0] === 0 && value[1][1] > 0) {
                let tempCompletedTransaction = {from: value[1][0], to:value[1][1]}
                completedTransaction.push(tempCompletedTransaction)
                //   both transactions
            }else {
                let tempBothTransaction = {from: value[1][0], to:value[1][1]}
                both.push(tempBothTransaction)
            }
        }
        setOpenedTrans(openTransaction)
        setCompletedTrans(completedTransaction)
        setBothTrans(both)
        console.log(openTransaction)
    },[]);
    
    
    //   let checkAllUserAssets = signedContract.checkAssets(
    //                                       stateUserAddress
    //                                   ).catch((e)=>window.alert(e.message));
    // setUserAssets(checkAllUserAssets)
    
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
            <table >
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
                        return<tr key={transaction.address + transaction.from}>
                            <td>0.4 BTC</td>
                            <td>4 ETH</td>
                            <td> <ProgressBar width={100}/> </td>
                            <td>arrow</td>
                            <td>Cancel</td>
                        </tr>
                    }):
                    completedTrans.map(transaction => {
                        return<tr key={transaction.address + transaction.from}>
                            <td>0.4 BTC</td>
                            <td>4 ETH</td>
                            <td> <ProgressBar width={100}/> </td>
                            <td>arrow</td>
                            <td>Cancel</td>
                        </tr>
                    })
                }
                
                
                
                
                
            </tbody>
        </table>
    </div>
</div>
</>
);
}

export default PooledSwaps;
