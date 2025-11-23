import { Transaction } from "@mysten/sui/transactions";
import { market as PACKAGE_ID } from "../package";

export function orderCreateTx(tx,user,market,amount,receive,role,token,exp,salt): Transaction {

tx.moveCall({
    target: `${PACKAGE_ID}::market::post_order`,
    arguments: [
        tx.object(market),
        tx.moveCall({
            target: `${PACKAGE_ID}::market::create_order`,
            arguments: [
                tx.pure(user), // maker
                tx.pure(amount),  // maker_amount
                tx.pure(receive), // taker_amount (YES)
                tx.pure(role),           // maker_role (0 = BUY)
                tx.pure(token),           // token_id (1 = YES)
                tx.pure(exp),  // expiration
                tx.pure(salt),        // salt
            ]
        })
    ],
});
return tx;
}