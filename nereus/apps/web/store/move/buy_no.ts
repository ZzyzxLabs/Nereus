import { Transaction } from "@mysten/sui/transactions";
import {market} from "./package";

export function buyNoTx(
    tx: Transaction,
    marketId: string,
    amount: number
): Transaction {
    tx.moveCall({
        target: market + "::buy_no",
        arguments: [
            tx.object(marketId),
            tx.pure.u64(amount)
        ]
    });
    return tx;
}
