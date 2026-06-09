DRAMAGIC OFFLINE QR ATTENDANCE DEMO
===================================

Files:
- attendance.html        Main attendance scanner page
- attendance.css         Mobile-first design
- attendance.js          Offline logic + IndexedDB + camera scanner demo
- qr-cards.html          Printable student QR ID cards
- qr-cards.css/js        QR card layout
- manifest.json          Makes it installable as a mobile app
- service-worker.js      Caches the app shell for offline use
- students.csv           Demo student list
- generate_qr_cards.py   Free QR generator from CSV
- assets/qr              Demo QR code PNGs

How to test quickly:
1. Open attendance.html.
2. Tap "Prepare Offline Attendance".
3. Choose Class A and Session 1.
4. Use the sample buttons or manual code to mark attendance.
5. Open Class List to see present/late/absent.
6. Tap Export CSV Backup.
7. Open qr-cards.html to print sample QR ID cards.

Important for real mobile camera + PWA:
- Camera scanning and service worker/PWA need HTTPS or localhost.
- If you double-click the file from your computer, manual demo works, but camera/PWA may not.
- Upload this folder to your website, GitHub Pages, Netlify, or run it locally using a local server.

Offline flow:
1. Online before class: open the page and tap Prepare Offline Attendance.
2. Offline during class: scan QR cards. Records save locally in IndexedDB.
3. Online after class: tap Sync Demo. Later this will upload to Supabase.

Free QR codes:
- You do not need a paid QR website.
- The demo includes QR PNG files generated from students.csv.
- For real students, update students.csv and run:
    python generate_qr_cards.py students.csv assets/qr

Security note:
- QR codes should contain only safe student codes like DRG-A-001-X9K2.
- Do not put parent phone numbers, payment info, or private data inside QR codes.


HOME LINK FIX:
Attendance now has a sticky top Home link and a floating mobile Home button, so you can always return to index.html.


V2 HOME NAV FIX
- Dashboard Chat / Missions card now opens chat-missions.html instead of a browser alert.
- attendance.html now has top, floating, and bottom Home buttons.
- Home buttons use JavaScript navigation to ./index.html for a more reliable return.
- service-worker.js cache version updated so browsers do not keep the old placeholder.
