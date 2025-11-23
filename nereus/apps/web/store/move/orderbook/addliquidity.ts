import { market } from "../package";

export function provideLPtx(tx,USDC:string[],marketId:string,amount:bigint){
    const first = USDC[0];
    if(!first) throw new Error("No USDC coins provided");
    tx.mergeCoins(tx.object(first),USDC.slice(1).map(id=>tx.object(id)));
    const [paymentCoin] = tx.splitCoins(tx.object(first),[tx.pure.u64(amount)]);
    tx.moveCall({
        target: `${market}::mint_complete_set`,
        arguments:[
            tx.object(marketId),
            paymentCoin,
            tx.pure.u64(amount),
        ]
    })
    return tx;
}