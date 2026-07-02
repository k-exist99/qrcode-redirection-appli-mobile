# QR code de redirection intelligente - Emmaüs Habitat

Un seul QR code qui redirige automatiquement vers :

- **App Store** si l'utilisateur scanne depuis un iPhone/iPad
- **Play Store** si l'utilisateur scanne depuis un appareil Android
- **Site web emmaus-habitat.fr** dans tous les autres cas (ordinateur, etc.)

Le QR code pointe toujours vers la même URL (la page `index.html` de ce repo,
publiée via GitHub Pages). C'est cette page qui détecte l'appareil en
JavaScript et effectue la redirection finale.

## 1. Déployer la page sur GitHub Pages

1. Créer un nouveau repo GitHub nommé `qrcode-redirection-appli-mobile`
   (public, requis pour GitHub Pages gratuit) et y pousser le contenu de ce
   dossier :

   ```bash
   git init
   git add .
   git commit -m "Page de redirection intelligente QR code"
   git branch -M main
   git remote add origin https://github.com/<votre-compte>/qrcode-redirection-appli-mobile.git
   git push -u origin main
   ```

2. Sur GitHub : **Settings > Pages** > Source = "Deploy from a branch",
   Branch = `main` / dossier `/ (root)`.

3. Après quelques minutes, la page sera disponible à :

   ```
   https://<votre-compte>.github.io/qrcode-redirection-appli-mobile/
   ```

   (remplacer `<votre-compte>` par votre nom d'utilisateur ou organisation
   GitHub).

## 2. Générer le QR code final

Une fois l'URL GitHub Pages connue, générer l'image du QR code :

```bash
npm install
node tools/generate-qr.js "https://<votre-compte>.github.io/qrcode-redirection-appli-mobile/" qr-code.png
```

Cela crée un fichier `qr-code.png` (1000x1000px, correction d'erreur élevée,
adapté à l'impression) qui encode l'URL de la page de redirection, avec le
logo Emmaüs Habitat ([`assets/logo.png`](assets/logo.png)) incrusté au centre.

Le niveau de correction d'erreur utilisé (`H`) tolère jusqu'à ~30% de la
surface du QR code masquée/endommagée ; le logo n'en occupe ici qu'environ
7%, ce qui laisse une large marge de sécurité pour le scan.

Pour utiliser un autre logo ou générer un QR code sans logo :

```bash
# avec un autre logo
node tools/generate-qr.js "<url>" qr-code.png chemin/vers/autre-logo.png

# sans logo (chemin de logo inexistant)
node tools/generate-qr.js "<url>" qr-code.png aucun-logo.png
```

## 3. Modifier les destinations

Les trois URLs cibles sont définies en haut du `<script>` dans
[`index.html`](index.html) :

```js
var APP_STORE_URL = "https://apps.apple.com/fr/app/emmaus-habitat-emma/id6449939257";
var PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=fr.emmaushabitat.aml&hl=fr";
var WEBSITE_URL = "https://www.emmaus-habitat.fr/";
```

Il suffit de modifier ces valeurs et de repousser sur GitHub pour changer les
destinations — le QR code imprimé reste valable puisqu'il pointe vers la page
de redirection, pas directement vers ces URLs.
