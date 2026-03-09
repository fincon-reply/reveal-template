## Grundlagen von HTML 
#### Einführungskurs

---

Nach diesem Kurs kannst du:
- verstehen, was HTML ist
- eine einfache HTML-Seite lesenund schreiben
- wichtige HTML-Elementeverwenden
- semantisches HTML verstehen

---

## Was ist HTML?

--

HTML = HyperText Markup Language

--

- beschreibt die Struktur einer Webseite
- ist keine Programmiersprache
- besteht aus Elementen und Tags

--

#### Einfaches Beispiel
```html
<h1>Hello World</h1>
<p>Das ist ein Absatz.</p>
```

--

<!-- .slide: data-quiz -->
# Quiz: Wofür steht HTML?
- [ ] Hot Typing Markup Language
- [ ] Home Typing Modern Language
- [x] Hyper Text Markup Language
- [ ] Home Testing Mixed Lang
> **Tipp:** HTML beschreibt Struktur, nicht Logik.

---

## Grundstruktur

--

#### Head
```html [3-5]
<!DOCTYPE html>
<html>
	<head>
		<title>Meine Seite</title>
	</head>
	<body>
		Inhalt
	</body>
</html>
```
Der **&lt;head&gt;**-Bereich enthält Metadaten und den Seitentitel.

--

#### Body
```html [6-8]
<!DOCTYPE html>
<html>
	<head>
		<title>Meine Seite</title>
	</head>
	<body>
		Inhalt
	</body>
</html>
```
Der **&lt;body&gt;**-Bereich enthält den sichtbaren Inhalt der Website.

--

<!-- .slide: data-quiz -->
# Quiz: Was ist eine korrekte HTML-Auszeichnung für die Dokumenttyp-Deklaration?
- [ ] DOCTYPE html
- [x] &lt;!DOCTYPE html>
- [ ] --DOCTYPE html;
