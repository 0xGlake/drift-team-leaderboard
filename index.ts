import {
	BigNum,
	BN,
	BulkAccountLoader,
	calculatePositionPNL,
	calculateUnsettledPnl,
	ClearingHouse,
	ClearingHouseUser,
	MARK_PRICE_PRECISION,
	PositionDirection,
	QUOTE_PRECISION,
	QUOTE_PRECISION_EXP,
	Wallet,
	Markets,
	Banks,
	initialize
} from '@drift-labs/sdk';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';

// load default config
const dotenv = require('dotenv');
dotenv.config();


export async function saveUserSnapshots(
	connection: Connection,
	clearingHouse: ClearingHouse
	) {
		
		if (!clearingHouse.isSubscribed) {
			clearingHouse.subscribe();
		}
		
		const programUserAccounts = (await clearingHouse.program.account.user.all()) as any[];
		
		const userAccountLoader = new BulkAccountLoader(connection, 'processed', 0);
		
		const userArray: ClearingHouseUser[] = [];
		
		for (const programUserAccount of programUserAccounts) {
			const user = new ClearingHouseUser({
				accountSubscription: {
					type: 'polling',
					accountLoader: userAccountLoader,
				},
				clearingHouse: clearingHouse,
				userAccountPublicKey: programUserAccount.publicKey,
			});
			userArray.push(user);
		}
		
		await Promise.all(userArray.map((user) => user.subscribe()));
		
		console.log(
			`Starting job to save user snapshots for ${userArray?.length} accounts`
			);
			
			
	}

	const env = process.env.ENV;
	console.log(`Using Endpoint: ${process.env.ENDPOINT}`);

	
const wallet = new Wallet(new Keypair());
const endpoint = process.env.ENDPOINT as string;
const connection = new Connection(endpoint, 'recent');

export const CONNECTION = { connection };

//@ts-ignore
const sdkConfig = initialize({ env: env });
//InitializeCommon(process.env.ENV as DriftEnv);

const clearingHouseProgramId = new PublicKey(
	sdkConfig.CLEARING_HOUSE_PROGRAM_ID
);

console.log(`Using Program ID ${sdkConfig.CLEARING_HOUSE_PROGRAM_ID}`);

// const bulkAccountLoader = new BulkAccountLoader(connection, 'confirmed', 5000);
const clearingHouse = new ClearingHouse({
	connection,
	wallet,
	programID: clearingHouseProgramId,
	marketIndexes: Markets[sdkConfig.ENV].map((mkt) => mkt.marketIndex),
	bankIndexes: Banks[sdkConfig.ENV].map((bank) => bank.bankIndex),
	oracleInfos: Markets[sdkConfig.ENV].map((mkt) => {
		return { publicKey: mkt.oracle, source: mkt.oracleSource };
	}),
});

saveUserSnapshots(connection, clearingHouse);
