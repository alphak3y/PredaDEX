import cylinder from '../images/cylinder.svg'
import circle1 from '../images/circle1.svg'
import circle2 from '../images/circle2.svg'
import circle3 from '../images/circle2.svg'

function Cylinder() {
  return (
    <div className="cylinder-wrapper mt-4">
        <img className="cylinder" src={cylinder} alt="cylinder" />
        <img className="circle" src={circle1} alt="circle" />
        <img className="circle circle2" src={circle2} alt="circle" />
        <img className="circle circle3" src={circle3} alt="circle" />
    </div>

  );
}

export default Cylinder;
