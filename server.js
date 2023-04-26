  const os = require('os');
  const dir = os.tmpdir();
  const fs = require('fs');
  const express = require('express')
  const app = express()
  const port = 3000

//////////////////////Route Public Html//////////////////////////
  app.use(express.static('public'))
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  ///////////////////////////////////////////////////////////////






  //////////////////////Route Api GET DIRECTORY//////////////////////////

// La fonction listerRepertoireSync prend en paramètre un chemin de répertoire et retourne une liste 
//d'objets représentant les fichiers et les dossiers contenus dans ce répertoire.
function listerRepertoireSync(repertoire) {

  // Utilise la méthode readdirSync de l'objet fs pour récupérer la liste des fichiers et des dossiers dans le répertoire spécifié.
  let fichiers = fs.readdirSync(repertoire);

  // Initialise un tableau vide qui va contenir les informations sur chaque élément (fichier ou dossier) du répertoire.
  let resultat = [];

  // Parcourt la liste des fichiers et des dossiers retournée par readdirSync.
  fichiers.forEach(function(fichier) {
      // Utilise la méthode statSync de l'objet fs pour récupérer des informations sur l'élément en cours (taille, date de création, etc.).
      let stat = fs.statSync(repertoire + '/' + fichier);

      // Crée un objet représentant l'élément en cours et le stocke dans le tableau resultat.
      let element = {
          name: fichier,
          isFolder: stat.isDirectory()
      };

      // Si l'élément en cours est un fichier (et non un dossier), ajoute sa taille à l'objet element.
      if (!element.isFolder) {
          element.size = stat.size;
      }

      // Ajoute l'objet element au tableau resultat.
      resultat.push(element);
  });

  // Retourne le tableau resultat qui contient les informations sur chaque élément du répertoire.
  return resultat;
}

 /**
  * La fonction répertorie les fichiers et dossiers d'un répertoire donné et renvoie un tableau
  * d'objets contenant leurs noms, leurs tailles (pour les fichiers) et s'il s'agit de dossiers ou non.
  * @param repertoire - Le paramètre "repertoire" est une chaîne représentant le chemin du répertoire
  * dont on veut lister le contenu.
  * @returns un tableau d'objets qui représentent les fichiers et les dossiers dans le répertoire
  * spécifié. Chaque objet a une propriété "name" qui contient le nom du fichier ou du dossier, une
  * propriété "isFolder" qui indique si l'élément est un dossier ou non, et si l'élément n'est pas un
  * dossier, une propriété "size" qui contient la taille du fichier en octets.
  */


 






  // Définit une route pour l'API avec l'objet app de Express.js. Cette route peut accepter un paramètre nommé "name".
app.get('/api/drive/:name?', function(req, res) {
  // Vérifie si le paramètre "name" est défini dans l'URL de la requête.
  if (req.params.name) {
      // Si oui, récupère sa valeur et construit le chemin complet du dossier à afficher.
      let name = req.params.name;
      let path = dir + '/' + name;

      // Vérifie si le dossier existe.
      if (fs.existsSync(path)) {
          // Si oui, retourne la liste des fichiers et dossiers qu'il contient en utilisant la fonction listerRepertoireSync définie ailleurs dans le code.
          res.status(200).json(listerRepertoireSync(path));
      } else {
          // Si non, retourne une erreur 404 avec un message d'erreur approprié.
          res.status(404).json({ error: 'Le dossier demandé n\'existe pas' });
      }
  } else {
      // Si le paramètre "name" n'est pas défini, retourne la liste des fichiers et dossiers à la racine du dossier racine (défini par la variable dir).
      res.status(200).json(listerRepertoireSync(dir));
  }
});






/* Ce code définit une route pour une requête GET vers le '/api/drive/:name?' point final. Le nom?' une
partie du point de terminaison est un paramètre facultatif. Si le paramètre est présent dans la
requête, le code vérifie si un répertoire portant ce nom existe dans le répertoire temporaire
(défini précédemment dans le code). Si c'est le cas, le code renvoie une réponse JSON avec le
contenu du répertoire à l'aide de la fonction listerRepertoireSync. Si le répertoire n'existe pas,
le code renvoie une erreur 404. Si le paramètre n'est pas présent dans la requête, le code renvoie
une réponse JSON avec le contenu du répertoire temporaire à l'aide de la fonction
listerRepertoireSync. */



  //////////////////////////////////////////////////////////////











  //////////////////////Route Api POST CREATE//////////////////////////
  app.post('/api/drive', function(req, res) {
    let name = req.query.name;
    if (name.match(/^[a-z0-9]+$/i)) {
      let path = dir + '/' + name;
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


  app.post('/api/drive/:folder', function(req, res) {
    let folder = req.params.folder;
    let name = req.query.name;
    if (name.match(/^[a-z0-9]+$/i)) {
      let path = dir + '/' + folder;
      if (!fs.existsSync(path)) {
        res.status(404).json({ error: 'Le dossier demandé n\'existe pas' });
      } else {
        path = path + '/' + name;
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
          res.status(201).json({ message: 'Le dossier a été créé avec succès' });
        } else {
          res.status(409).json({ error: 'Le dossier existe déjà' });
        }
      }
    } else {
      res.status(400).json({ error: 'Le nom du dossier contient des caractères non-alphanumériques' });
    }
  });
  //////////////////////////////////////////////////////////////


  //////////////////////Route Api DELETE//////////////////////////
  app.delete('/api/drive/:name', function(req, res) {
    let name = req.params.name;
    if (name.match(/^[a-z0-9]+$/i)) {
      let path = dir + '/' + name;
      if (fs.existsSync(path)) {
        fs.rmdirSync(path);
        res.status(200).json({ message: 'Le dossier a été supprimé avec succès' });
      } else {
        res.status(404).json({ error: 'Le dossier demandé n\'existe pas' });
      }
    } else {
      res.status(400).json({ error: 'Le nom du dossier contient des caractères non-alphanumériques' });
    }
  });



  app.delete('/api/drive/:folder/:name', function(req, res) {
    let folder = req.params.folder;
    let name = req.params.name;
    if (name.match(/^[a-z0-9]+$/i)) {
      let path = dir + '/' + folder + '/' + name;
      if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true });
        res.status(200).json({ message: 'Le dossier a été supprimé avec succès' });
      } else {
        res.status(404).json({ error: 'Le dossier demandé n\'existe pas' });
      }
    } else {
      res.status(400).json({ error: 'Le nom du dossier contient des caractères non-alphanumériques' });
    }
  });
  //////////////////////////////////////////////////////////////



  //////////////////////////////////////////////////////////////
