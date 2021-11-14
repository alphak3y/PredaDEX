const { ethers } = require("hardhat");

module.exports = Object.freeze({
    TOKENS: {
        weth:           {address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",   symbol: "WETH",    decimals: 18,  amount: "0.1",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8"},
        dai:            {address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",   symbol: "DAI",     decimals: 18,  amount: "100.0",    whale: "0x7641a5E890478Bea2bdC4CAFfF960AC4ae96886e"},
        usdc:           {address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",   symbol: "USDC",    decimals: 6,   amount: "100.0",    whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8"},
        usdt:           {address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",   symbol: "USDT",    decimals: 6,   amount: "100.0",    whale: "0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2"},
        renbtc:         {address: "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",   symbol: "RENBTC",  decimals: 8,   amount: "0.001",    whale: "0x60940c7e8980cd7f7a107d8026b311e2041321c5"},
        wbtc:           {address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",   symbol: "WBTC",    decimals: 8,   amount: "0.001",    whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8"},
        hbtc:           {address: "0x0316EB71485b0Ab14103307bf65a021042c6d380",   symbol: "HBTC",    decimals: 18,  amount: "0.001",    whale: "0xd5fd1bc99d5801278345e9d29be2225d06c26e93"},
        uni:            {address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",   symbol: "UNI",     decimals: 18,  amount: "1.0",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8"},
        link:           {address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",   symbol: "LINK",    decimals: 18,  amount: "1.0",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8"},
        zrk:            {address: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",   symbol: "ZRK",     decimals: 18,  amount: "1.0",      whale: "0xeb7ebc69dfa659733bf5aa71882b801aff80c2ae"},
        maker:          {address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",   symbol: "MKR",     decimals: 18,  amount: "1.0",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8"},
        reputation:     {address: "0x221657776846890989a759BA2973e427DfF5C9bB",   symbol: "REP",     decimals: 18,  amount: "1.0",      whale: "0xc6a043b07d33b6f30d8cb501026c391cfd25abe1"},
        loopring:       {address: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",   symbol: "LRC",     decimals: 18,  amount: "1.0",      whale: "0x4757d97449aca795510b9f3152c6a9019a3545c3"},
        aave:           {address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",   symbol: "AAVE",    decimals: 18,  amount: "1.0",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8"},
        compound:       {address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",   symbol: "COMP",    decimals: 18,  amount: "1.0",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8"},
        matic:          {address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",   symbol: "MATIC",   decimals: 18,  amount: "100.0",    whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8"},
        sushi:          {address: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",   symbol: "SUSHI",   decimals: 18,  amount: "1.0",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8"},
        graph:          {address: "0xc944E90C64B2c07662A292be6244BDf05Cda44a7",   symbol: "GRT",     decimals: 18,  amount: "100.0",    whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8"},
        balancer:       {address: "0xba100000625a3754423978a60c9317c58a424e3D",   symbol: "BAL",     decimals: 18,  amount: "1.0",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8"},
        eth:            {address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",   symbol: "ETH",     decimals: 18,  amount: "0.1",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8"}
    },

    FIXED_DEXES: [
        { from: "dai", dest: "usdc", name: "Curve USDT", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_USDT - this.FLAG_DISABLE_CURVE_ALL },
        { from: "dai", dest: "usdc", name: "Curve Pax", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_PAX - this.FLAG_DISABLE_CURVE_ALL },
        { from: "dai", dest: "usdc", name: "Curve Compound", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_COMPOUND - this.FLAG_DISABLE_CURVE_ALL },
        { from: "dai", dest: "usdc", name: "Curve Y", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_Y - this.FLAG_DISABLE_CURVE_ALL },
        { from: "dai", dest: "usdc", name: "Curve Binance", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_BINANCE - this.FLAG_DISABLE_CURVE_ALL },
        { from: "dai", dest: "usdc", name: "Curve Synthetix", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_SYNTHETIX - this.FLAG_DISABLE_CURVE_ALL },
        { from: "dai", dest: "usdc", name: "Curve 3Pool", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_POOL - this.FLAG_DISABLE_CURVE_ALL },
        { from: "dai", dest: "usdc", name: "Shell Stable", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_SHELL_ALL - this.FLAG_DISABLE_SHELL_STABLE },
        { from: "hbtc", dest: "wbtc", name: "Curve hBTC", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_HBTC - this.FLAG_DISABLE_CURVE_ALL },
        { from: "renbtc", dest: "wbtc", name: "Curve RenBTC", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_RENBTC - this.FLAG_DISABLE_CURVE_ALL },
        { from: "renbtc", dest: "wbtc", name: "Curve tBTC", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_TBTC - this.FLAG_DISABLE_CURVE_ALL },
        { from: "renbtc", dest: "wbtc", name: "Curve sBTC", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_SBTC - this.FLAG_DISABLE_CURVE_ALL },
        { from: "renbtc", dest: "wbtc", name: "Shell BTC", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_SHELL_ALL - this.FLAG_DISABLE_SHELL_BTC }
    ],

    DEXES: [
        { name: "Bancor", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_BANCOR },
        { name: "Balancer V1", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_BALANCER_V1 - this.FLAG_DISABLE_BALANCER_ALL },
        { name: "Uniswap V2", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_UNISWAP_V2_ALL },
        { name: "Uniswap V2 (ETH)", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_UNISWAP_V2_ALL - this.FLAG_DISABLE_UNISWAP_V2_ETH },
        { name: "Uniswap V2 (DAI)", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_UNISWAP_V2_ALL - this.FLAG_DISABLE_UNISWAP_V2_DAI },
        { name: "Uniswap V2 (USDC)", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_UNISWAP_V2_ALL - this.FLAG_DISABLE_UNISWAP_V2_USDC },
        { name: "Sushiswap", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_SUSHISWAP },
        { name: "DMM",  flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_DMM },
        { name: "Mooniswap", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_MOONISWAP_ALL },
        { name: "Mooniswap Over ETH", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_MOONISWAP_ALL - this.FLAG_DISABLE_MOONISWAP_ETH },
        { name: "Mooniswap Over DAI", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_MOONISWAP_ALL - this.FLAG_DISABLE_MOONISWAP_DAI },
        { name: "Mooniswap Over USDC", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_MOONISWAP_ALL - this.FLAG_DISABLE_MOONISWAP_USDC },
        { name: "Uniswap V3 500", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_UNISWAP_V3_500 - this.FLAG_DISABLE_UNISWAP_V3_ALL },
        { name: "Uniswap V3 3000", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_UNISWAP_V3_3000 - this.FLAG_DISABLE_UNISWAP_V3_ALL },
        { name: "Uniswap V3 10000", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_UNISWAP_V3_10000 - this.FLAG_DISABLE_UNISWAP_V3_ALL },
        { name: "DodoDex V1", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_DODODEX_ALL - this.FLAG_DISABLE_DODODEX_V1 },
        { name: "DodoDex V2", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_DODODEX_ALL - this.FLAG_DISABLE_DODODEX_V2 },
    ],

    ALL_TOKENS: [
        { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",   symbol: "WETH",    decimals: 18,  amount: "0.1",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8" },
        { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",   symbol: "DAI",     decimals: 18,  amount: "100.0",    whale: "0x7641a5E890478Bea2bdC4CAFfF960AC4ae96886e" },
        { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",   symbol: "USDC",    decimals: 6,   amount: "100.0",    whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8" },
        { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",   symbol: "USDT",    decimals: 6,   amount: "100.0",    whale: "0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2" },
        { address: "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",   symbol: "RENBTC",  decimals: 8,   amount: "0.1",      whale: "0x60940c7e8980cd7f7a107d8026b311e2041321c5" },
        { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",   symbol: "WBTC",    decimals: 8,   amount: "0.1",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8" },
        { address: "0x0316EB71485b0Ab14103307bf65a021042c6d380",   symbol: "HBTC",    decimals: 18,  amount: "0.1",      whale: "0xd5fd1bc99d5801278345e9d29be2225d06c26e93" },
        { address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",   symbol: "UNI",     decimals: 18,  amount: "1.0",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8" },
        { address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",   symbol: "LINK",    decimals: 18,  amount: "1.0",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8" },
        { address: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",   symbol: "ZRK",     decimals: 18,  amount: "1.0",      whale: "0xeb7ebc69dfa659733bf5aa71882b801aff80c2ae" },
        // { address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",   symbol: "MKR",     decimals: 18,  amount: "1.0",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8" },
        { address: "0x221657776846890989a759BA2973e427DfF5C9bB",   symbol: "REP",     decimals: 18,  amount: "1.0",      whale: "0xc6a043b07d33b6f30d8cb501026c391cfd25abe1" },
        { address: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",   symbol: "LRC",     decimals: 18,  amount: "1.0",      whale: "0x4757d97449aca795510b9f3152c6a9019a3545c3" },
        { address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",   symbol: "AAVE",    decimals: 18,  amount: "1.0",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8" },
        { address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",   symbol: "COMP",    decimals: 18,  amount: "100.0",    whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8" },
        // { address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",   symbol: "MATIC",   decimals: 18,  amount: "100.0",    whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8" },
        { address: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",   symbol: "SUSHI",   decimals: 18,  amount: "1.0",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8" },
        { address: "0xc944E90C64B2c07662A292be6244BDf05Cda44a7",   symbol: "GRT",     decimals: 18,  amount: "100.0",    whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8" },
        { address: "0xba100000625a3754423978a60c9317c58a424e3D",   symbol: "BAL",     decimals: 18,  amount: "100.0",    whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8" },
        // { address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",   symbol: "ETH",     decimals: 18,  amount: "0.1",      whale: "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8" },
    ],

    ALL_DEXES: [
        { name: "Bancor", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_BANCOR },
        { name: "Balancer V1", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_BALANCER_V1 - this.FLAG_DISABLE_BALANCER_ALL },
        { name: "Uniswap V2", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_UNISWAP_V2_ALL },
        { name: "Uniswap V2 (ETH)", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_UNISWAP_V2_ALL - this.FLAG_DISABLE_UNISWAP_V2_ETH },
        { name: "Uniswap V2 (DAI)", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_UNISWAP_V2_ALL - this.FLAG_DISABLE_UNISWAP_V2_DAI },
        { name: "Uniswap V2 (USDC)", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_UNISWAP_V2_ALL - this.FLAG_DISABLE_UNISWAP_V2_USDC },
        { name: "Sushiswap", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_SUSHISWAP },
        { name: "DMM",  flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_DMM },
        { name: "Mooniswap", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_MOONISWAP_ALL },
        // { name: "Mooniswap Over ETH", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_MOONISWAP_ALL - this.FLAG_DISABLE_MOONISWAP_ETH },
        { name: "Mooniswap Over DAI", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_MOONISWAP_ALL - this.FLAG_DISABLE_MOONISWAP_DAI },
        { name: "Mooniswap Over USDC", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_MOONISWAP_ALL - this.FLAG_DISABLE_MOONISWAP_USDC },
        { name: "Uniswap V3 500", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_UNISWAP_V3_500 - this.FLAG_DISABLE_UNISWAP_V3_ALL },
        { name: "Uniswap V3 3000", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_UNISWAP_V3_3000 - this.FLAG_DISABLE_UNISWAP_V3_ALL },
        { name: "Uniswap V3 10000", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_UNISWAP_V3_10000 - this.FLAG_DISABLE_UNISWAP_V3_ALL },
        { name: "Shell Stable", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_SHELL_ALL - this.FLAG_DISABLE_SHELL_STABLE },
        { name: "Shell BTC", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_SHELL_ALL - this.FLAG_DISABLE_SHELL_BTC },
        { name: "DodoDex V1", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_DODODEX_ALL - this.FLAG_DISABLE_DODODEX_V1 },
        { name: "DodoDex V2", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_DODODEX_ALL - this.FLAG_DISABLE_DODODEX_V2 },
        { name: "Curve USDT", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_USDT - this.FLAG_DISABLE_CURVE_ALL },
        { name: "Curve Pax", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_PAX - this.FLAG_DISABLE_CURVE_ALL },
        { name: "Curve Compound", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_COMPOUND - this.FLAG_DISABLE_CURVE_ALL },
        { name: "Curve Y", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_Y - this.FLAG_DISABLE_CURVE_ALL },
        { name: "Curve Binance", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_BINANCE - this.FLAG_DISABLE_CURVE_ALL },
        { name: "Curve Synthetix", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_SYNTHETIX - this.FLAG_DISABLE_CURVE_ALL },
        // { name: "Curve 3Pool", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_POOL - this.FLAG_DISABLE_CURVE_ALL },
        // { name: "Curve hBTC", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_HBTC - this.FLAG_DISABLE_CURVE_ALL },
        { name: "Curve RenBTC", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_RENBTC - this.FLAG_DISABLE_CURVE_ALL },
        // { name: "Curve tBTC", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_TBTC - this.FLAG_DISABLE_CURVE_ALL },
        { name: "Curve sBTC", flags: this.FLAG_DISABLE_ALL - this.FLAG_DISABLE_CURVE_SBTC - this.FLAG_DISABLE_CURVE_ALL },
    ],

    // The ERC-20 Contract ABI, which is a common contract interface
    // for tokens (this is the Human-Readable ABI format)
    ERC20_ABI: [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint)",
    "function balanceOf(address) view returns (uint)",
    "function approve(address spender, uint256 amount)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function transfer(address to, uint amount)",
    "function transferFrom(address sender, address recipient, uint256 amount)",
    "event Transfer(address indexed from, address indexed to, uint amount)",
    ],

    UNISWAPV3_ADDRESS: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",

    FLAGS: {
        FLAG_BUY: 0x01,
        FLAG_GROUP_SWAP: 0x02,

    // DMM
        FLAG_DISABLE_DMM: 0x04,
    // Uniswap V2
        FLAG_DISABLE_UNISWAP_V2_ALL: 0x08,
        FLAG_DISABLE_UNISWAP_V2_ETH: 0x10,
        FLAG_DISABLE_UNISWAP_V2_DAI: 0x20,
        FLAG_DISABLE_UNISWAP_V2_USDC: 0x40,
    // Uniswap V3
        FLAG_DISABLE_UNISWAP_V3_ALL: 0x80,
        FLAG_DISABLE_UNISWAP_V3_500: 0x100,
        FLAG_DISABLE_UNISWAP_V3_3000: 0x200,
        FLAG_DISABLE_UNISWAP_V3_10000: 0x400,
    // SushiSwap
        FLAG_DISABLE_SUSHISWAP: 0x800,
    // Curve
        FLAG_DISABLE_CURVE_ALL: 0x1000,
        FLAG_DISABLE_CURVE_USDT: 0x2000,
        FLAG_DISABLE_CURVE_Y: 0x4000,
        FLAG_DISABLE_CURVE_BINANCE: 0x8000,
        FLAG_DISABLE_CURVE_SYNTHETIX: 0x10000,
        FLAG_DISABLE_CURVE_SBTC: 0x20000,
        FLAG_DISABLE_CURVE_PAX: 0x40000,
        FLAG_DISABLE_CURVE_RENBTC: 0x80000,
        FLAG_DISABLE_CURVE_TBTC: 0x100000,
        FLAG_DISABLE_CURVE_COMPOUND: 0x200000,
        FLAG_DISABLE_CURVE_HBTC: 0x400000,
        FLAG_DISABLE_CURVE_POOL: 0x800000,
    // Balancer
        FLAG_DISABLE_BALANCER_ALL: 0x1000000,
        FLAG_DISABLE_BALANCER_V1: 0x2000000,
    // Dododex
        FLAG_DISABLE_DODODEX_ALL: 0x4000000,
        FLAG_DISABLE_DODODEX_V1: 0x8000000,
        FLAG_DISABLE_DODODEX_V2: 0x10000000,
    // Mooniswap
        FLAG_DISABLE_MOONISWAP_ALL: 0x20000000,
        FLAG_DISABLE_MOONISWAP_DAI: 0x40000000,
        FLAG_DISABLE_MOONISWAP_ETH: 0x80000000,
        FLAG_DISABLE_MOONISWAP_USDC: 0x100000000,
    // Bancor
        FLAG_DISABLE_BANCOR: 0x200000000,
    // Shell
        FLAG_DISABLE_SHELL_ALL: 0x400000000,
        FLAG_DISABLE_SHELL_STABLE: 0x800000000,
        FLAG_DISABLE_SHELL_BTC: 0x1000000000,

        FLAG_DISABLE_ALL: (  this.FLAG_DISABLE_DMM + this.FLAG_DISABLE_UNISWAP_V2_ALL + this.FLAG_DISABLE_UNISWAP_V2_ETH +
            this.FLAG_DISABLE_UNISWAP_V2_DAI + this.FLAG_DISABLE_UNISWAP_V2_USDC + this.FLAG_DISABLE_UNISWAP_V3_ALL +
            this.FLAG_DISABLE_UNISWAP_V3_500 + this.FLAG_DISABLE_UNISWAP_V3_3000 + this.FLAG_DISABLE_UNISWAP_V3_10000 +
            this.FLAG_DISABLE_SUSHISWAP + this.FLAG_DISABLE_CURVE_ALL + this.FLAG_DISABLE_CURVE_USDT +
            this.FLAG_DISABLE_CURVE_Y + this.FLAG_DISABLE_CURVE_BINANCE + this.FLAG_DISABLE_CURVE_SYNTHETIX +
            this.FLAG_DISABLE_CURVE_SBTC + this.FLAG_DISABLE_CURVE_PAX + this.FLAG_DISABLE_CURVE_RENBTC +
            this.FLAG_DISABLE_CURVE_TBTC + this.FLAG_DISABLE_CURVE_COMPOUND + this.FLAG_DISABLE_CURVE_HBTC +
            this.FLAG_DISABLE_CURVE_POOL + this.FLAG_DISABLE_BALANCER_ALL + this.FLAG_DISABLE_BALANCER_V1 +
            this.FLAG_DISABLE_DODODEX_ALL + this.FLAG_DISABLE_DODODEX_V1 + this.FLAG_DISABLE_DODODEX_V2 +
            this.FLAG_DISABLE_MOONISWAP_ALL + this.FLAG_DISABLE_MOONISWAP_DAI + this.FLAG_DISABLE_MOONISWAP_ETH +
            this.FLAG_DISABLE_MOONISWAP_USDC + this.FLAG_DISABLE_BANCOR + this.FLAG_DISABLE_SHELL_ALL +
            this.FLAG_DISABLE_SHELL_STABLE + this.FLAG_DISABLE_SHELL_BTC),
    },
});

