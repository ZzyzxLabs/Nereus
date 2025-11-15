module nereus::truth_oracle;

use std::string::{Self, String};
use enclave::enclave::{Self, Enclave, Cap};
use walrus::blob::Blob;

public struct OracleConfig has key {
    id: UID,
    blob_id: String,
    code_hash: String
}

public struct WBlob has key {
    id: UID,
    blob: Blob
}

public struct TruthOracleHolder has key {
    id: UID,
    market_id: ID
}

public struct TRUTH_ORACLE has drop {}

fun init(otw: TRUTH_ORACLE, ctx: &mut TxContext) {
    let cap = enclave::new_cap(otw, ctx);
    transfer::public_transfer(cap, ctx.sender());
}

public fun create_config(
    code_hash: String,
    blob_id: String,
    ctx: &mut TxContext,
) {
    let config = OracleConfig {
        id: object::new(ctx),
        blob_id,
        code_hash,
    };
    transfer::share_object(config);
}

public fun create_wblob(
    blob: Blob,
    ctx: &mut TxContext,
): WBlob {
    let wblob = WBlob {
        id: object::new(ctx),
        blob,
    };
    wblob
}