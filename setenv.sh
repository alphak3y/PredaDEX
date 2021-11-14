
REPOSRC=https://github.com/PoolSharks-Protocol/NFT.git
LOCALREPO=NFT
LOCALREPO_VC_DIR=$LOCALREPO/.git

if [ ! -d $LOCALREPO_VC_DIR ]
then
    git clone $REPOSRC $LOCALREPO
else
    cd $LOCALREPO
    git pull $REPOSRC
fi

yarn install
yarn fork
sleep(5)
yarn deploy