## Savoir démarrer et utiliser un debugger pour NodeJS
https://github.com/Microsoft/nodejstools/wiki/Debugging

----
<br>

## Comprendre ce qu'est nodejs, expliquer la différence avec le Javascript utilisé en module 1



NodeJs: Node.js couvre la programmation côté serveur.

javascript: JavaScript est utilisé comme un langage de développement côté client.

---

<br>

## Traiter une requête, et envoyer une réponse au client.

la méthode utilisée pour recevoir une requête est app.get. Cette méthode est une fonction d'Express.js, un framework de développement Web pour Node.js, qui permet de définir des routes HTTP.

Le traitement de la requête se fait dans une fonction anonyme définie comme deuxième argument de app.get. La méthode app.get prend deux paramètres : le premier est **la route,** et le deuxième est une **fonction** qui sera exécutée lorsque cette route sera appelée avec une méthode HTTP GET. Dans le code fourni, la route **/api/drive/:name?**, qui peut contenir un paramètre name facultatif (représenté par :name?). La fonction associée à la route est une fonction anonyme qui prend deux paramètres, **req** et **res**, qui représentent respectivement la requête HTTP entrante et la réponse HTTP sortante.

- Exemple : 

```javascript
function listerRepertoireSync(repertoire) {

  let fichiers = fs.readdirSync(repertoire);

  let resultat = [];

  fichiers.forEach(function(fichier) {
      let stat = fs.statSync(repertoire + '/' + fichier);

      let element = {
          name: fichier,
          isFolder: stat.isDirectory()
      };

      if (!element.isFolder) {
          element.size = stat.size;
      }

      resultat.push(element);
  });

  return resultat;
}

app.get('/api/drive/:name?', function(req, res) {
  if (req.params.name) {
      let name = req.params.name;
      let path = dir + '/' + name;

      if (fs.existsSync(path)) {
          res.status(200).json(listerRepertoireSync(path));
      } else {
          res.status(404).json({ error: 'Le dossier demandé n\'existe pas' });
      }
  } else {
      res.status(200).json(listerRepertoireSync(dir));
  }
});
```

Si aucun paramètre name n'est présent dans la requête, la fonction liste simplement le contenu du répertoire de base dir et renvoie une réponse HTTP avec le contenu de ce répertoire en utilisant la méthode res.status(200).json(listerRepertoireSync(dir)).

En somme, la fonction app.get est utilisée pour définir une route qui traite une requête HTTP GET sur le chemin /api/drive/:name?, vérifie si un paramètre name est présent, liste le contenu du répertoire correspondant et renvoie une réponse HTTP avec ce contenu ou un message d'erreur.

---

<br>

## Savoir utiliser les principaux modules de node (fs, path, etc.)
Parmi les modules les plus couramment utilisés figurent fs et path.

Le module fs (File System) fournit des fonctions pour accéder et modifier des fichiers sur le système de fichiers local. Voici quelques exemples d'utilisation :
<br>

 - Lire un Dossier :
```javascript
  // Récupération de la liste de fichiers et de dossiers dans le répertoire.
  let fichiers = fs.readdirSync(repertoire);
```
 
- Ecrire dans un fichier :
```javascript
fs.writeFile('fichier.txt', 'Contenu du fichier', (err) => {
  if (err) throw err;
  console.log('Le fichier a été enregistré !');
});
```

- Vérifier si un fichier existe :
```javascript
  if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        res.status(200).json({ message: 'Le dossier a été créé avec succès' });
      } else {
        res.status(409).json({ error: 'Le dossier existe déjà' });
      }
    } else {
      res.status(400).json({ error: 'Le nom du dossier contient des caractères non-alphanumériques' });
    }
  });
```
<br>

Le module path fournit des fonctions pour manipuler des chemins de fichiers et de répertoires. Voici quelques exemples d'utilisation :
<br>
 - Créer un chemin absolu à partir d'un chemin relatif :



























