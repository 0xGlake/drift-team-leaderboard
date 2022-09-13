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

let teamAddys = new Map<string, string>([
	["GLAKETtJHrTwiDiZmPuNsW8RCfynobP2yKjyJMokJjVn", "George"],
	["wi118WNNuZGLqgrznHDwzDnHKKmMCQmCyDGQCMRbZdj", "Will"],
	["6aiE94djwgR72ozpDfFUdcSCpCuVAxkxTArWmfyzay6d", "Johno"],
	["i8M6Rm9DcFzRhiLFrXsMF8H3hrkBwvEhGUzFQAH3PLa", "Cindy"],
	["6sAaRdVhuuogN6Csr8r7sXpivhYBYjhcz9eNL3mhYTRR", "Su"],
	["CrisPtzi6bzU8z654QkRbr6S3wiUG1rY6MShpdKhKoHv", "Chris"],
	["x19zhryYtodTDgmRq6VLtQxbo4zfZUqa9hoobX47BeL", "Brennan"],
	["29iErmt6WbsEVmE6Rm1HGRaor6b2kxxHrejPKrcbe37n", "Raj"],
	["niCk6QHFU1kyU56Mdq5RJzKrecdkNSn23ZA6wduFdWS", "Nick"],
	["3gXdi65BunRF2ZirJKMYcga2TAb5HgPZzkCBTqegro2u", "Dylan"],
	["AYmNd1BENhEmqxDhNvfHDE9EzsMHpCnfhkpu3BWktctP", "Luke"],
	["dWe7eT2mHkWgbhSNtBVN89sYAPNGFNvuHQXVUq2wh7N", "Vanessa"],
	["AhyqQnpZZqn3YTxeYhUx3ZA6RrZm5yLJGabDbzZ5BPNF", "Mitzy"],
	["BiGZJeWeQv9arWQ38vwTzb4SF8DoQ5GdCqNUrSKmqWRy", "BigZ"],
	["9jMAUgoiHZXsoGomc6NFTvarZojxpNJPtz816zq2gQM6", "Damo"],
	["2tdWByK1xSQVEhbYydxAxt3mR2uorjvM1Rk5NzrPKyb3", "Reina"],
	["HCcUvWgSkb6UevUPcvUiuhUAefXgfGyppxK9tY434FPv", "David"]
]);


export async function saveUserSnapshots(
	connection: Connection,
	clearingHouse: ClearingHouse
	) {
		
		if (!clearingHouse.isSubscribed) {
			await clearingHouse.subscribe();
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
			`Found ${userArray?.length} accounts`
		);
		
		for (const user of userArray) {
			if (!user.isSubscribed) {
				await user.subscribe();
			}
			if (!user.accountSubscriber.isSubscribed) {
				await user.accountSubscriber.subscribe();
			}
			
			//const userPositionsSdk = user.getUserAccount().positions;
			//console.log("pub Key: " + user.getUserAccountPublicKey())
			
			//console.log(user.isSubscribed);
			//console.log(clearingHouse.isSubscribed);

			let totalPNL = new BN();
			totalPNL = user.getBankAssetValue().add(user.getBankLiabilityValue()).add(user.getUnrealizedPNL());
			console.log("pubkey: " + user.getUserAccount().authority + " has " + totalPNL.toString(10)/(1000000));
		}
	}


// load default config
const dotenv = require('dotenv');
dotenv.config();

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
