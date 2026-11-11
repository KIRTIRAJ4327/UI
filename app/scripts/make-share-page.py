"""Turn dist-share/index.html (from `npm run build:share`) into a page fragment for the shareable link.
The host adds its own <!doctype>, <html>, <head> and <body>, so those are removed here.
Usage: python3 scripts/make-share-page.py <output.html>"""
import re, sys
s = open('dist-share/index.html').read()
head = s[s.index('<head>') + 6:s.index('</head>')]
body = s[s.index('<body>') + 6:s.index('</body>')]
for pat in [r'<meta charset="UTF-8" />', r'<link rel="icon"[^>]*>', r'<meta name="viewport"[^>]*>', r'<title>.*?</title>']:
    head = re.sub(pat, '', head)
out = ('<title>Unified Product Delivery Platform</title>\n'
       '<style>:root{color-scheme:light dark}html,body{background:#eef1ed}@media (prefers-color-scheme:dark){html,body{background:#0d111d}}</style>\n'
       + head.strip() + '\n' + body.strip() + '\n')
open(sys.argv[1], 'w').write(out)
print(f'{len(out) / 1e6:.1f} MB written to {sys.argv[1]}')
