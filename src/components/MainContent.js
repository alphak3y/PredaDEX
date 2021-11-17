import { useState } from 'react';
import Form from './Form'
import PooledSwaps from './PooledSwaps';

function MainContent() {
    const [isFormVisible, setIsFormVisible] = useState(true)
    
    return (
    <div className="container">
        <div className="row">
            <div className="col-md-6 offset-3">
                <div className="main-content-wrapper mt-5">

                         {isFormVisible &&         
                         <div className="toggle-btn-wrapper mb-2">
            <span   className="active-toggle toggle-option">Swap</span>
            <span onClick={()=>setIsFormVisible(!isFormVisible)} className=" toggle-option ">Order</span>
        </div>}

                    {isFormVisible ? <Form /> : <PooledSwaps isFormVisible={isFormVisible} setIsFormVisible={setIsFormVisible}/>}
                </div>
            </div>
        </div>
    </div>
    
    
    );
}

export default MainContent;
