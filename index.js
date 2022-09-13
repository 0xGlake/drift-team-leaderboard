import express from 'express';

import {
	ClearingHouse,
	ClearingHouseUser,
	DevnetMarkets,
	convertToNumber,
	QUOTE_PRECISION
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
  let text = "";
	DevnetMarkets.forEach(e => {
    text += e.marketIndex + ": " + e.symbol + "<br>";
  });

  text += "<br><br><br><br> users:<br>";
	
  //console.log(`${users}`)

	/*
	const users = ClearingHouse.program.account.user.all();

	users.forEach(e => {
		totalUserCollateral += convertToNumber(
			e.account.collateral,
			QUOTE_PRECISION
		);
		console.log("collateral: ",totalUserCollateral);
	});
	*/
	
  res.send(`${text}`);
});

app.listen(port, () => {
	/*
  console.log(`Markets: ${driftObj.DevnetMarkets.forEach(e => {
    console.log(`index ${e.marketIndex}: ${e.symbol}`);
  })}`);
	*/
});