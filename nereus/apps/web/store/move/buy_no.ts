import { Transaction } from "@mysten/sui/transactions";
import { market as PACKAGE_ID } from "./package";

export function buyNoTx(
    tx: Transaction,
    USDC: string[],   // Array of USDC coin object IDs
    marketId: string, // The Market Object ID
    noPositions: string[] | undefined, // Array of existing NO Position IDs
    amount: bigint,   // The amount of USDC to bet
    userAddress: string // Required to transfer the new object if we create one
): Transaction {
    
    // 1. Handle USDC Payment
    // We must provide a coin with EXACTLY 'amount' value.
    if (USDC.length === 0) throw new Error("No USDC coins provided");
    
    const primaryCoin = tx.object(USDC[0]!);
    
    // If multiple USDC coins, merge them into the first one to ensure sufficient balance
    if (USDC.length > 1) {
        tx.mergeCoins(primaryCoin, USDC.slice(1).map(id => tx.object(id)));
    }

    // Split off the exact amount required for the bet
    const [paymentCoin] = tx.splitCoins(primaryCoin, [tx.pure.u64(amount)]);

    // 2. Handle NO Position Object
    // We need a 'No' object to add the shares to. 
    let targetNoPosition;
    let isNewPosition = false;

    if (noPositions && noPositions.length > 0) {
        // Use the first existing position found
        targetNoPosition = tx.object(noPositions[0]!);
    } else {
        // If no position exists, we must mint a zero_no ticket first
        isNewPosition = true;
        targetNoPosition = tx.moveCall({
            target: `${PACKAGE_ID}::zero_no`,
            arguments: [tx.object(marketId)],
        });
    }

    // 3. Execute the Bet
    tx.moveCall({
        target: `${PACKAGE_ID}::bet_no`,
        arguments: [
            targetNoPosition,       // &mut No
            tx.object(marketId),    // &mut Market
            tx.pure.u64(amount),    // amount (u64)
            paymentCoin,            // Coin<USDC> (exact value)
            tx.object("0x6")        // &Clock (System Clock)
        ]
    });

    // 4. Cleanup
    // If we created a new Position object, we must transfer it to the user.
    // If we used an existing one, it remains in their wallet (shared/owned).
    if (isNewPosition) {
        tx.transferObjects([targetNoPosition], tx.pure.address(userAddress));
    }

    return tx;
}
