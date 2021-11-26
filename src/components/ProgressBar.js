


function ProgressBar({width}) {
  return (
  <div className="progress-bar-wrapper">
      <p className="progress-bar-label">{width}%</p>
    <div className="outer-progress">
      <div 
      className={width === 100 ? "inner-progress full": "inner-progress not-full"}
      style={{width:`${width}%`}}
      >
        {!(width ===100 || width === 0 ) && <div className="inner-progress-line" style={{left:`${width}%`}}></div>}
    </div>
  </div>
  
</div>
);
}

export default ProgressBar;
