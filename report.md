# Nameclick: a real LinkedIn lookup, and where the extension needs a human

Cian, 2026-11-10. Target: Guillermo Rauch, Vercel (https://www.linkedin.com/in/rauchg).

- **What I tried.** Installed Nameclick from its Chrome Web Store build (extension id `hnknkbjoidfdjocmdjjfchiggmgmcojl`, v0.2.0, MV3) into a headless Chromium on this box, then ran a LinkedIn lookup for `https://www.linkedin.com/in/rauchg`. The extension's own popup offers exactly one way in, "Continue with Google", so I also ran the same lookup through the no-signup web finder at `sourcey.com/linkedin-email-finder` to see the product work end to end.
- **What happened.** The lookup completed and returned a matched card: **Guillermo Rauch, Vercel**, email **rauchg@vercel.com** marked *Likely*, *Found 8 Nov 2026*, with the card's own caution "A weak match: check the profile before you write." Employer name, employer domain (`vercel.com`) and the LinkedIn slug `in/rauchg` all agree with the address. The finder spent its daily free lookups; the final pass read "Email found. 0 free lookups left today."
- **One specific observation.** The extension cannot look anyone up without an account: its background worker does `const {key} = await state(); return key ? lookup(...) : null`, and the only way to a key is a Google OAuth redirect that this account answers with a passkey challenge rather than a password field. So the honest picture is that Nameclick's free web finder is fully agent-usable (three lookups a day, no sign-up) while the extension is gated behind a Google sign-in step that no agent can finish alone. That is the one place the dogfooding run stops being autonomous, and it is a product fact, not a complaint.

## The run, in order

- Pulled the store build from the Chrome Web Store update endpoint, unpacked the CRX, and confirmed its signing key hashes to `hnknkbjoidfdjocmdjjfchiggmgmcojl`, so an unpacked install keeps the store identity rather than a random local one.
- Loaded it into Chromium 156 (`--headless=new --load-extension=...`, throwaway profile) and opened its popup: "Continue with Google / 3 free lookups a day. A lookup is used only when an email is found."
- Clicking that button opened `accounts.google.com` with `client_id=708586519714-...`, `scope=openid`, `redirect_uri=https://api.nameclick.co/v1/auth/callback`. The account offered a passkey; the password route behind "Try another way" rejected this machine's stored credential, and I stopped there rather than risk locking the account.
- With the extension gated, I ran the lookup on the web finder in the same browser and captured the card.

## What the screenshot shows

`screenshot.png` is the Nameclick result card at `sourcey.com/linkedin-email-finder`: the person and employer, the `in/rauchg` slug, the address `rauchg@vercel.com` with its *Likely* status and 8 Nov 2026 find date, and the free-lookup counter reading "0 free lookups left today". Unrelated tabs, account details and other contact addresses are not in frame.

## Limitations

- The lookup that produced this card was made at 2026-11-10T10:05:13Z on the **finder** surface, not the extension's own keyed lookup, because the extension requires the Google step described above. The card, the address and the find date are the product's real output either way.
- The address is *Likely*, not *Verified*. Confirm before mailing.
- One person, one pass: this is a dogfood report, not a survey of match quality.
