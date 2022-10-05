import {
	BigNum,
	BN,
	BulkAccountLoader,
	ClearingHouse,
	ClearingHouseUser,
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
	["LUKEsMb7fu64BVHStVfNB4DisR6g62wfq7mgjqymepp", "Luke"],
	["dWe7eT2mHkWgbhSNtBVN89sYAPNGFNvuHQXVUq2wh7N", "Vanessa"],
	["AhyqQnpZZqn3YTxeYhUx3ZA6RrZm5yLJGabDbzZ5BPNF", "Mitzy"],
	["BiGZJeWeQv9arWQ38vwTzb4SF8DoQ5GdCqNUrSKmqWRy", "BigZ"],
	["9jMAUgoiHZXsoGomc6NFTvarZojxpNJPtz816zq2gQM6", "Damo"],
	["2tdWByK1xSQVEhbYydxAxt3mR2uorjvM1Rk5NzrPKyb3", "Reina"],
	["HCcUvWgSkb6UevUPcvUiuhUAefXgfGyppxK9tY434FPv", "David"],
	["LUiqSfUDMLWncsE1wfZGWr5hnv6V3WmWLW2XyKPctcS", "Luigi"]
]);

let teamLeaderboard = new Map<string, number>();

export async function processLeaderboard(
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

			let totalPNL = user.getBankAssetValue().add(user.getBankLiabilityValue()).add(user.getUnrealizedPNL());
			
			if (teamAddys.has(user.getUserAccount().authority.toString())){
				console.log("Team member ", teamAddys.get(user.getUserAccount().authority.toString()));
				teamLeaderboard.set(teamAddys.get(user.getUserAccount().authority.toString()) as string, totalPNL.toString(10)/(1000000));
			} else {
				console.log("pubkey: " + user.getUserAccount().authority + " has " + totalPNL.toString(10)/(1000000));
			}
		}

		const mapSort1 = new Map([...teamLeaderboard.entries()].sort((a, b) => b[1] - a[1]));
		
		for (let [key, value] of mapSort1) {
			console.log(key + " has " + value);
		}
		console.log(mapSort1);
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

processLeaderboard(connection, clearingHouse);
