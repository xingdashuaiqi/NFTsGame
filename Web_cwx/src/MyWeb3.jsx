import Web3 from 'web3'
import abi from './PoloContract-abi.json'
import ContractAddress from './ContractAddress'
const MyWeb3 = {
    init() {
        return new Promise((resolve, reject) => {
            // 检查 Ethereum 浏览器对象是否存在
            let ethereum = window.ethereum;
            if (!ethereum) {
                reject('No Ethereum browser detected');
                return;
            }

            // 禁止自动刷新，Metamask 要求写的
            ethereum.autoRefreshOnNetworkChange = false;

            // 请求用户授权并获取账户列表
            ethereum.request({ method: 'eth_requestAccounts' })
                .then(function (accounts) {
                    // 初始化 provider
                    let provider = ethereum || window.web3.currentProvider;
                    window.web3 = new Web3(provider);

                    // 获取当前以太坊网络id
                    window.web3.eth.net.getId()
                        .then(function (result) {
                            let currentChainId = result;

                            // 设置最大监听器数量，否则会出现警告
                            window.web3.currentProvider.setMaxListeners(300);

                            // 从 JSON 中获取当前网络id下的合约地址
                            let currentContractAddress = ContractAddress[currentChainId];
                            if (currentContractAddress !== undefined) {
                                // 实例化合约
                                window.MyContract = new window.web3.eth.Contract(abi.abi, currentContractAddress);
                                // 获取当前默认的以太坊地址
                                window.defaultAccount = accounts[0].toLowerCase();
                                //that.allEvents(window.MyContract)
                                resolve(true);
                            } else {
                                reject('Unknown ChainId: ' + currentChainId);
                            }
                        });
                })
                .catch(function (error) {
                    console.error(error);
                    reject(error);
                });
        });
    },

    //魄罗总量
    PoloCount() {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.PoloCount().call().then(function (PoloCount) {
                resolve(PoloCount)
            })
        })
    },
    //获得用户魄罗
    UserPolo() {
        return new Promise((resolve, reject) => {
        
                window.MyContract.methods.GetPolo(window.defaultAccount).call().then(function (Polo) {
                    resolve(Polo)
                })
            
        })
    },
    //获得拥有者地址
    UsePoloAddress(PoloId) {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.UsePoloAddress(PoloId).call().then(function (result) {
                resolve(result)
            })

        })
    },
    //获取所有魄罗
    GetAllPolo(){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.GetAllPolo().call().then(function (result) {
                resolve(result)
            })
        })

    },
    //获得当前用户的所有魄罗
    GetPolo() {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.GetPolo(window.defaultAccount).call().then(function (UserPolo) {
                console.log(UserPolo);
                resolve(UserPolo);
            })
        });
    },
    GetPoloById(_poloid) {
        return new Promise((resolve, reject) => {
          window.MyContract.methods.GetPoloById(_poloid).call()
            .then(function (Polo) {
              console.log(Polo);
              resolve(Polo);
            })
            .catch(function (error) {
              console.error("Error calling GetPoloById:", error);
              reject(error);
            });
        });
      },
    //创建随机魄罗
    CreatePolo(_name) {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.CreatePolo(_name).send({ from: window.defaultAccount })
                .on('transactionHash', function (transactionHash) {
                    resolve(transactionHash)
                })
                .on('confirmation', function (confirmationNumber, receipt) {
                    console.log({ confirmationNumber: confirmationNumber, receipt: receipt })
                })
                .on('receipt', function (receipt) {
                    console.log({ receipt: receipt })
                    window.location.reload()
                })
                .on('error', function (error, receipt) {
                    console.log({ error: error, receipt: receipt })
                    reject({ error: error, receipt: receipt })
                })
        })
    },
    //购买魄罗
    buyPolo(_name) {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.PoloPrice().call().then(function (PoloPrice) {
                window.MyContract.methods.buyPolo(_name).send({ from: window.defaultAccount, value: PoloPrice })
                    .on('transactionHash', function (transactionHash) {
                        resolve(transactionHash)
                    })
                    .on('confirmation', function (confirmationNumber, receipt) {
                        console.log({ confirmationNumber: confirmationNumber, receipt: receipt })
                    })
                    .on('receipt', function (receipt) {
                        console.log({ receipt: receipt })
                        window.location.reload()
                    })
                    .on('error', function (error, receipt) {
                        console.log({ error: error, receipt: receipt })
                        reject({ error: error, receipt: receipt })
                    })
            })
        })
    },
    //魄罗
    attack(_poloid, _targetId) {
        return new Promise((resolve, reject) => {
            console.log(_poloid,_targetId)
            window.MyContract.methods.Attack(_poloid, _targetId).send({ from: window.defaultAccount })
                .on('transactionHash', function (transactionHash) {
                    resolve(transactionHash)
                })
                .on('confirmation', function (confirmationNumber, receipt) {
                    console.log({ confirmationNumber: confirmationNumber, receipt: receipt })
                })
                .on('receipt', function (receipt) {
                    console.log({ receipt: receipt })
                    window.location.reload()
                })
                .on('error', function (error, receipt) {
                    console.log({ error: error, receipt: receipt })
                    reject({ error: error, receipt: receipt })
                })
        })
    },
    //魄罗改名
    changeName(_poloid, _name) {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.changeName(_poloid, _name).send({ from: window.defaultAccount })
                .on('transactionHash', function (transactionHash) {
                    resolve(transactionHash)
                })
                .on('confirmation', function (confirmationNumber, receipt) {
                    console.log({ confirmationNumber: confirmationNumber, receipt: receipt })
                })
                .on('receipt', function (receipt) {
                    console.log({ receipt: receipt })
                    window.location.reload()
                })
                .on('error', function (error, receipt) {
                    console.log({ error: error, receipt: receipt })
                    reject({ error: error, receipt: receipt })
                })
        })
    },
    //魄罗喂食
    feed(_poloid) {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.Feed(_poloid).send({ from: window.defaultAccount })
                .on('transactionHash', function (transactionHash) {
                    resolve(transactionHash)
                })
                .on('confirmation', function (confirmationNumber, receipt) {
                    console.log({ confirmationNumber: confirmationNumber, receipt: receipt })
                })
                .on('receipt', function (receipt) {
                    console.log({ receipt: receipt })
                    window.location.reload()
                })
                .on('error', function (error, receipt) {
                    console.log({ error: error, receipt: receipt })
                    reject({ error: error, receipt: receipt })
                })
        })
    },
    //魄罗付费升级
    levelUp(Poloid) {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.levelmoney().call().then(function (levelmoney) {
                window.MyContract.methods.Uplevelmoney(Poloid).send({ from: window.defaultAccount, value: levelmoney })
                    .on('transactionHash', function (transactionHash) {
                        resolve(transactionHash)
                    })
                    .on('confirmation', function (confirmationNumber, receipt) {
                        console.log({ confirmationNumber: confirmationNumber, receipt: receipt })
                    })
                    .on('receipt', function (receipt) {
                        console.log({ receipt: receipt })
                        window.location.reload()
                    })
                    .on('error', function (error, receipt) {
                        console.log({ error: error, receipt: receipt })
                        reject({ error: error, receipt: receipt })
                    })
            })
        })
    },
    //获取最低售价
    minPrice() {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.minPrice().call().then(function (minPrice) {
                resolve(window.web3.utils.fromWei(minPrice, 'ether'))
            })
        })
    },
    //出售我的魄罗
    saleMyPolo(_poloid, _price) {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.salePolo(_poloid, window.web3.utils.toWei(_price.toString(), 'ether')).send({from: window.defaultAccount})
                .on('transactionHash', function (transactionHash) {
                    resolve(transactionHash);
                })
                .on('error', function (error) {
                    reject(error);
                });
        });
    },

    //获得商店里魄罗数据
    PoloShop(_poloid) {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.PoloShops(_poloid).call().then(function (shopInfo) {
                shopInfo.price = window.web3.utils.fromWei(shopInfo.price, 'ether')
                resolve(shopInfo)
            })
        })
    },
    //获得商店所有魄罗
    getShopPolo() {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.getShopPolo().call().then(function (ShopPolo) {
                resolve(ShopPolo)
            })
        })
    },
    //购买商店里的魄罗
    buyShopPolo(_poloid, _price) {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.buyShopPolo(_poloid).send({ from: window.defaultAccount, value: window.web3.utils.toWei(_price.toString()) })
                .on('transactionHash', function (transactionHash) {
                    resolve(transactionHash)
                })
                .on('confirmation', function (confirmationNumber, receipt) {
                    console.log({ confirmationNumber: confirmationNumber, receipt: receipt })
                })
                .on('receipt', function (receipt) {
                    console.log({ receipt: receipt })
                    window.location.reload()
                })
                .on('error', function (error, receipt) {
                    console.log({ error: error, receipt: receipt })
                    reject({ error: error, receipt: receipt })
                })
        })
    },
    //获得合约拥有者地址
    owner() {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.owner().call().then(function (owner) {
                resolve(owner.toLowerCase())
            })
        })
    },
    //获得合约名称
    name() {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.name().call().then(function (name) {
                resolve(name)
            })
        })
    },
    //获得合约标识
    symbol() {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.symbol().call().then(function (symbol) {
                resolve(symbol)
            })
        })
    },
    //查询余额
    checkBalance() {
        return new Promise((resolve, reject) => {
            this.owner().then(function (owner) {
                if (window.defaultAccount === owner) {
                    window.MyContract.methods.checkBalance().call({ from: window.defaultAccount }).then(function (balance) {
                        resolve(window.web3.utils.fromWei(balance, 'ether'))
                    })
                } else {
                    reject('You are not contract owner')
                }
            })
        })
    },
    //获得升级费
    levelUpFee() {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.levelUpFee().call().then(function (levelUpFee) {
                resolve(window.web3.utils.fromWei(levelUpFee, 'ether'))
            })
        })
    },
    //设置升级费
    setLevelUpFee(_fee) {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.setLevelUpFee(window.web3.utils.toWei(_fee.toString())).send({ from: window.defaultAccount })
                .then(function (result) {
                    resolve(result)
                })
        })
    },
    //设置最低售价
    setMinPrice(_value) {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.setMinPrice(window.web3.utils.toWei(_value.toString())).send({ from: window.defaultAccount })
                .then(function (result) {
                    resolve(result)
                })
        })
    },
    
    //提款
    withdraw() {
        return new Promise((resolve, reject) => {
            this.owner().then(function (owner) {
                if (window.defaultAccount === owner) {
                    window.MyContract.methods.withdraw().send({ from: window.defaultAccount }).then(function (res) {
                        resolve(res)
                    })
                } else {
                    reject('You are not contract owner')
                }
            })
        })
    },
    //所有事件
    allEvents() {
        window.MyContract.events.allEvents({ fromBlock: 0 }, function (error, event) {
            console.log({ allEvents: event })
        }).on("connected", function (subscriptionId) {
            console.log({ connected_subscriptionId: subscriptionId })
        }).on('data', function (event) {
            console.log({ event_data: event })
        }).on('changed', function (event) {
            console.log({ event_changed: event })
        }).on('error', function (error, receipt) {
            console.log({ event_error: error, receipt: receipt })
        })
    }
}

export default MyWeb3;