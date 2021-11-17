import lines from '../images/lines.svg'
import Blur from './Blur'

function BottomLines() {
  return (
    <>
    <div className="bottom-lines-wrapper">
      <img className="bottom-lines-img" src={lines} alt="logo" />
    </div>
    <Blur/>
    </>
  );
}

export default BottomLines;
