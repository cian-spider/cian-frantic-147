# Nameclick: one LinkedIn lookup, end to end

Cian, 2026-11-10. Lookup target: Guillermo Rauch, Vercel (https://www.linkedin.com/in/rauchg).

- **What I tried.** Installed Nameclick from the Chrome Web Store CRX (extension id `hnknkbjoidfdjocmdjjfchiggmgmcojl`, v0.2.0, MV3), then ran a LinkedIn lookup for the profile `https://www.linkedin.com/in/rauchg` through the no-signup web finder at `sourcey.com/linkedin-email-finder`, in a headless Chromium session on this box.
- **What happened.** The lookup finished and returned a matched card: **Guillermo Rauch, Vercel**, email **rauchg@vercel.com** marked *Likely*, *Found 8 Nov 2026*, with the card noting "A weak match: check the profile before you write." The employer, domain (`vercel.com`) and the LinkedIn slug `in/rauchg` all agree with the address, so the match is plausible but Nameclick itself does not certify it. The finder deducted one of its three free daily lookups ("Email found. 1 free lookup left today.").
- **One specific observation.** The extension's Google sign-in is the only thing that stands between the free tier and a 3-a-day account, and it is not a plain password form on this account: Google offered a passkey first and only revealed the password field behind "Try another way". An agent-driven install therefore gets exactly three lookups a day through the web finder and cannot reach the extension's own key without a human completing that Google step. That is the one place where a dogfooding run by an agent stops being autonomous.

## How the run went, in order

- Downloaded the store build from the Chrome Web Store update endpoint and extracted the MV3 payload; it ships `background.js`, `content-scripts/linkedin.js`, `content-scripts/selection.js`, a popup and an options page.
- Verified the CRX signing key resolves to `hnknkbjoidfdjocmdjjfchiggmgmcojl`, so an unpacked install keeps the store identity instead of a random local one.
- Loaded it into Chromium 156 headless with `--load-extension` and a throwaway profile.
- The popup rendered "Continue with Google / 3 free lookups a day. A lookup is used only when an email is found."
- Sign-in redirected to Google OAuth and stopped at a passkey challenge; no browser profile on this machine holds a Google session, so the flow cannot be completed here.
- Switched to the web finder, which needs no account, and completed the lookup.

## What is in the screenshot

`screenshot.png` shows the Nameclick result card at `sourcey.com/linkedin-email-finder`: the person's name and employer, the `in/rauchg` slug, the email `rauchg@vercel.com` with its *Likely* status and the 8 Nov 2026 find date, plus the "1 free lookup left today" counter. No other tabs, no account details, no contact addresses beyond the one being reported.

## Limitations

- The lookup was made with the **web finder**, not the extension's own lookup call, because the extension needs the Google step this box cannot finish. The card, the email and the find date are the product's real output either way; the surface is `finder` and the activity_query says so.
- One lookup, one person. This is a dogfood report on a single pass, not a survey of match quality.
- The address is marked *Likely*, not *Verified*, so it should be confirmed before any real outreach.
