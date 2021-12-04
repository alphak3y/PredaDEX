function ProgressBar({width}) {


    // props:
    // width: number
    
    
    
      return (
      <div className="progress-bar-wrapper-sm">
        <div className="outer-progress-sm">
          <div 
          className={width >= 100 ? "inner-progress-sm full": "inner-progress-sm not-full"}
          style={{width:`${width>100 ? 100: width}%`}}
          >
            {!(width ===100 || width === 0 ) && <div className="inner-progress-line-sm" style={{left:`${width}%`}}></div>}
        </div>
      </div>
      
    </div>
    );
    }
    
    export default ProgressBar;
    