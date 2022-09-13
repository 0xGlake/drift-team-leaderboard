import express from 'express';
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
} from '@drift-labs/sdk';

const app = express();
const port = 3000;

const driftTeamAddys = [
	'GLAKETtJHrTwiDiZmPuNsW8RCfynobP2yKjyJMokJjVn',
	'wi118WNNuZGLqgrznHDwzDnHKKmMCQmCyDGQCMRbZdj',
	'6aiE94djwgR72ozpDfFUdcSCpCuVAxkxTArWmfyzay6d',
	'i8M6Rm9DcFzRhiLFrXsMF8H3hrkBwvEhGUzFQAH3PLa',
	'Ei854rkmwgX3XTVzCjGWZTW5ocYbAo4JwZgniBoNFyfa',
	'CrisPtzi6bzU8z654QkRbr6S3wiUG1rY6MShpdKhKoHv',
	'x19zhryYtodTDgmRq6VLtQxbo4zfZUqa9hoobX47BeL',
	'29iErmt6WbsEVmE6Rm1HGRaor6b2kxxHrejPKrcbe37n',
	'niCk6QHFU1kyU56Mdq5RJzKrecdkNSn23ZA6wduFdWS',
	'3gXdi65BunRF2ZirJKMYcga2TAb5HgPZzkCBTqegro2u',
	'AYmNd1BENhEmqxDhNvfHDE9EzsMHpCnfhkpu3BWktctP',
	'dWe7eT2mHkWgbhSNtBVN89sYAPNGFNvuHQXVUq2wh7N',
	'AhyqQnpZZqn3YTxeYhUx3ZA6RrZm5yLJGabDbzZ5BPNF',
	'BiGZJeWeQv9arWQ38vwTzb4SF8DoQ5GdCqNUrSKmqWRy',
	'9jMAUgoiHZXsoGomc6NFTvarZojxpNJPtz816zq2gQM6',
	'2tdWByK1xSQVEhbYydxAxt3mR2uorjvM1Rk5NzrPKyb3',
	'HCcUvWgSkb6UevUPcvUiuhUAefXgfGyppxK9tY434FPv',
];


app.get('/', (req, res) => {

	async function saveUserSnapshots(
		clearingHouse = ClearingHouse
	) {
		try {
			if (!clearingHouse.isSubscribed) {
				clearingHouse.subscribe();
			}
			const programUserAccounts = (await clearingHouse.program.account.user.all());

			for (const programUserAccount of programUserAccounts) {
				console.log(programUserAccount.publicKey);
			}

		} catch (err) {
			RollbarClient.rollbar.critical({
				context: ROLLBAR_USERSNAPSHOT_CONTEXT,
				message: 'User snapshot jobs failed with error',
				error: err,
			});
		}
	}

	let text = ""



  res.send(`${text}`);
});

app.listen(port, () => {
	/*
  console.log(`Markets: ${driftObj.DevnetMarkets.forEach(e => {
    console.log(`index ${e.marketIndex}: ${e.symbol}`);
  })}`);
	*/
});
