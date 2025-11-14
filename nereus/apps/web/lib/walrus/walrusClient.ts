// lib/walrusClient.ts
import { walrus } from '@mysten/walrus';
import type { WalrusClient } from '@mysten/walrus';
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { getFullnodeUrl } from '@mysten/sui/client';
import walrusWasmUrl from '@mysten/walrus-wasm';

// 讓 TS 從實際工廠函式推論出正確型別
function createWalrusClient() {
	return new SuiJsonRpcClient({
		url: getFullnodeUrl('testnet'),
		// important for Walrus
		network: 'testnet',
	}).$extend(
		walrus({
			wasmUrl: walrusWasmUrl,
			// 可以在這裡之後加 uploadRelay / storageNodeClientOptions 等
		}),
	);
}

// ExtendedWalrusClient 就是上面 createWalrusClient 回傳的實際型別
export type ExtendedWalrusClient = ReturnType<typeof createWalrusClient>;

// 如果你真的需要存取 client.walrus 的型別，也可以單獨 export
export type WalrusExtensionClient = WalrusClient;

let client: ExtendedWalrusClient | null = null;

export function getWalrusClient(): ExtendedWalrusClient {
	if (!client) {
		client = createWalrusClient();
	}
	return client;
}
