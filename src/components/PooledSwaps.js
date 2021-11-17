import { useState } from "react";
import ProgressBar from "./ProgressBar";


function PooledSwaps(props) {
    const [filter, setFilter] = useState("Open")
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
            <button onClick={e => setFilter("Completed")} className={filter==="Completed"?"btns pooled-btns ls active": "btns pooled-btns ls"} >Completed</button>
            <button onClick={e => setFilter("Cancelled")} className={filter==="Cancelled"?"btns pooled-btns ls active": "btns pooled-btns ls"} >Cancelled</button>
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
                    <tr>
                        <td>0.4 BTC</td>
                        <td>4 ETH</td>
                        <td> <ProgressBar width={100}/> </td>
                        <td>arrow</td>
                        <td>Cancel</td>
                    </tr>

                    <tr>
                        <td>0.4 BTC</td>
                        <td>4 ETH</td>
                        <td> <ProgressBar width={10}/> </td>
                        <td>arrow</td>
                        <td>Cancel</td>
                    </tr>

                    <tr>
                        <td>0.4 BTC</td>
                        <td>4 ETH</td>
                        <td> <ProgressBar width={0}/> </td>
                        <td>arrow</td>
                        <td>Cancel</td>
                    </tr>

                    <tr>
                        <td>0.4 BTC</td>
                        <td>4 ETH</td>
                        <td> <ProgressBar width={50}/> </td>
                        <td>arrow</td>
                        <td>Cancel</td>
                    </tr>

                    
                    
                    
                </tbody>
            </table>
        </div>
    </div>
    </>
    );
}

export default PooledSwaps;
