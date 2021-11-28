import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WholeApp from './WholeApp'
import { ModalProvider } from "./context/Modal.context";
import { CoinProvider } from "./context/Coin.context";
import { ChainId, DAppProvider } from '@usedapp/core'
import { PredaDexProvider } from './context/Predadex.context';
import { MoralisProvider } from "react-moralis";

const config = {
  readOnlyChainId: ChainId.Mainnet,
  readOnlyUrls: {
    [ChainId.Mainnet]: `https://eth-mainnet.alchemyapi.io/v2/XLbyCEcaLhQ3x_ZaKBmZqNp8UGgNGX2F`,
  },
  multicallAddresses: {
   // 31337: ""
  }
}

function App() {

  return (
    <div className="App">
      <MoralisProvider appId="sStPxZSaPOooxLi4261bR9cChQWRDdzbjAJ3yf5S" serverUrl="https://qynxi24ohr2y.usemoralis.com:2053/server">
      <DAppProvider config={config}>
      <PredaDexProvider>
      <ModalProvider>
        <CoinProvider>
        <WholeApp />
        </CoinProvider>
      </ModalProvider>
      </PredaDexProvider>
      </DAppProvider>
      </MoralisProvider>
    </div>

  );
}

export default App;
