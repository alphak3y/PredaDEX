import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WholeApp from './WholeApp'
import { ModalProvider } from "./context/Modal.context";
import { CoinProvider } from "./context/Coin.context";
import { ChainId, DAppProvider, useEtherBalance, useEthers } from '@usedapp/core'
import { PredaDexProvider } from './context/Predadex.context';

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

      <DAppProvider config={config}>
      <PredaDexProvider>
      <ModalProvider>
        <CoinProvider>
        <WholeApp />
        </CoinProvider>
      </ModalProvider>
      </PredaDexProvider>
      </DAppProvider>
    </div>

  );
}

export default App;
