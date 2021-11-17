


function ProgressBar({width}) {
  return (
  <div className="progress-bar-wrapper">
    <div className="outer-progress">
      <div 
      className={width === 100 ? "inner-progress full": "inner-progress not-full"}
      style={{width:`${width}%`}}
      >
        {!(width ===100 || width === 0 ) && <div className="inner-progress-line" style={{left:`${width}%`}}></div>}
    </div>
  </div>
  <p className="progress-bar-label">{width}</p>
  <p className="progress-max-num">100</p>
  
</div>
);
}

export default ProgressBar;
