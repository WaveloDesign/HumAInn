# humAIn v3.0 — Οδηγός Εγκατάστασης

## Τι χρειάζεσαι
- Λογαριασμό Google (σίγουρα έχεις)
- Λογαριασμό GitHub (δωρεάν, github.com)
- Λογαριασμό Vercel (δωρεάν, vercel.com)
- Gemini API key (δωρεάν, aistudio.google.com)

---

## Βήμα 1 — Πάρε δωρεάν Gemini API key

1. Πήγαινε στο **aistudio.google.com**
2. Κάνε login με το Google account σου
3. Κλικ **"Get API key"** → **"Create API key"**
4. Αντέγραψε το key (ξεκινάει με `AIza...`)
5. Κράτα το κάπου — θα το χρειαστείς μετά

---

## Βήμα 2 — Δημιούργησε GitHub repo

1. Πήγαινε στο **github.com** και κάνε λογαριασμό (αν δεν έχεις)
2. Κλικ **"New repository"**
3. Όνομα: `humain` 
4. Κλικ **"Create repository"**
5. Κλικ **"uploading an existing file"**
6. Σύρε ΟΛΑΟΥΤΑ τα αρχεία του φακέλου humain που κατέβασες
7. Κλικ **"Commit changes"**

---

## Βήμα 3 — Deploy στο Vercel

1. Πήγαινε στο **vercel.com**
2. Κλικ **"Sign up"** → **"Continue with GitHub"**
3. Κλικ **"Add New Project"**
4. Επίλεξε το `humain` repository
5. Κλικ **"Deploy"** — περίμενε 1 λεπτό
6. Vercel σου δίνει URL: `humain-xxx.vercel.app` 🎉

---

## Βήμα 4 — Χρήση

1. Άνοιξε το URL σου
2. Κλικ **"API Key"** πάνω δεξιά
3. Βάλε το Gemini key σου (το `AIza...` από Βήμα 1)
4. Κλικ **"Αποθήκευση"**
5. Έτοιμο! Το key αποθηκεύεται μόνο στον browser σου

---

## Κόστος

| Υπηρεσία | Κόστος |
|----------|--------|
| GitHub | Δωρεάν |
| Vercel hosting | Δωρεάν |
| Gemini API | Δωρεάν (1.500 requests/ημέρα) |
| **Σύνολο** | **€0** |

---

## Για να το μοιραστείς με άλλους

Δώσε τους το Vercel URL (`humain-xxx.vercel.app`).
Κάθε χρήστης βάζει το **δικό του** δωρεάν Gemini key — εσύ δεν πληρώνεις τίποτα!

---

## Αν κάτι δεν πάει καλά

- **"API error"**: Έλεγξε ότι το Gemini key είναι σωστό (ξεκινάει με `AIza`)
- **Σελίδα δεν φορτώνει**: Vercel deploy → Settings → Logs
- **Άλλο πρόβλημα**: Επικοινωνία μέσω GitHub Issues
