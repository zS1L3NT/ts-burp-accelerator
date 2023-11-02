import { Sess, Res } from "./http"

const iter = async () => {
	const sess = new Sess()
	const r1 = await sess.req(`
		GET https://0a6300ee03dd804b81a9ac5100f60088.web-security-academy.net/login HTTP/1.1
		host: 0a6300ee03dd804b81a9ac5100f60088.web-security-academy.net
		User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/117.0
		Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
		Accept-Language: en-US,en;q=0.5
		Referer: https://0a6300ee03dd804b81a9ac5100f60088.web-security-academy.net/
		Upgrade-Insecure-Requests: 1
		Sec-Fetch-Dest: document
		Sec-Fetch-Mode: navigate
		Sec-Fetch-Site: same-origin
		Sec-Fetch-User: ?1
	`)

	const csrf1 = r1.bodreg(/name=\"csrf\" value=\"(.*)\">/)![0]
	console.log({ csrf1 })

	const login = await sess.req(`
		POST https://0a6300ee03dd804b81a9ac5100f60088.web-security-academy.net/login HTTP/1.1
		host: 0a6300ee03dd804b81a9ac5100f60088.web-security-academy.net
		User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/117.0
		Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
		Accept-Language: en-US,en;q=0.5
		Referer: https://0a6300ee03dd804b81a9ac5100f60088.web-security-academy.net/login
		Content-Type: application/x-www-form-urlencoded
		Content-Length: 70
		Origin: https://0a6300ee03dd804b81a9ac5100f60088.web-security-academy.net
		Upgrade-Insecure-Requests: 1
		Sec-Fetch-Dest: document
		Sec-Fetch-Mode: navigate
		Sec-Fetch-Site: same-origin
		Sec-Fetch-User: ?1

		csrf=${csrf1}&username=carlos&password=montoya
	`)

	console.log(login.status())
	console.log(login.body())
}

await iter()
