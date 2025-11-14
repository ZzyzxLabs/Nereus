// lib/uploadToWalrus.ts
import { WalrusFile } from '@mysten/walrus';
import type { Signer } from '@mysten/sui/cryptography';
import { getWalrusClient } from './walrusClient';

export interface WalrusUploadResult {
	id: string;
	blobId: string;
	blobObject: unknown;
}

export interface UploadCodeToWalrusParams {
	code: string;
	filename?: string;
	epochs?: number;
	deletable?: boolean;
	signer: Signer;
}

export async function uploadCodeToWalrus(
	params: UploadCodeToWalrusParams,
): Promise<WalrusUploadResult> {
	const { code, filename = 'code.ts', epochs = 3, deletable = true, signer } = params;

	const client = getWalrusClient();

	const file = WalrusFile.from({
		contents: new TextEncoder().encode(code),
		identifier: filename,
		tags: {
			'content-type': 'text/plain',
			'x-walrus-kind': 'code',
		},
	});

	const results = await client.walrus.writeFiles({
		files: [file],
		epochs,
		deletable,
		signer,
	});

	const [first] = results;

	return {
		id: first.id,
		blobId: first.blobId,
		blobObject: first.blobObject,
	};
}
