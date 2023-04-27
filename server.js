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

//évite que ,nath ou autre hack le pc
app.use((req, res, next) => {
  if(req.ip !== "::1"){
  res.status(666).json({message: "Fuck your fucking mum "})
  }
    next()
})



  //////////////////////Route Api GET DIRECTORY//////////////////////////
  
// La fonction listerRepertoireSync synchroniquement liste tous les fichiers et dossiers dans le répertoire spécifié et retourne un tableau de résultats.
function listerRepertoireSync(repertoire) {

  // Récupération de la liste de fichiers et de dossiers dans le répertoire.
  let fichiers = fs.readdirSync(repertoire);

  // Initialisation d'un tableau vide qui va stocker les résultats.
  let resultat = [];

  // Parcours de chaque fichier/dossier pour créer un objet pour chaque élément.
  fichiers.forEach(function(fichier) {
      
      // Récupération des informations sur le fichier/dossier (taille, date de création, etc.).
      let stat = fs.statSync(repertoire + '/' + fichier);

      // Création d'un objet avec le nom du fichier/dossier et l'indication s'il s'agit d'un dossier ou non.
      let element = {
          name: fichier,
          isFolder: stat.isDirectory()
      };

      // Si l'élément est un fichier (et non un dossier), ajoute sa taille à l'objet.
      if (!element.isFolder) {
          element.size = stat.size;
      }

      // Ajoute l'objet à la liste de résultats.
      resultat.push(element);
  });

  // Retourne le tableau de résultats.
  return resultat;
}

// La fonction app.get écoute les requêtes HTTP GET sur le chemin /api/drive/:name?
app.get('/api/drive/:name?', function(req, res) {

  // Si un nom est spécifié dans la requête, liste le répertoire avec ce nom.
  if (req.params.name) {
      
      // Récupère le nom du répertoire depuis la requête.
      let name = req.params.name;

      // Crée le chemin complet du répertoire en ajoutant son nom à la variable dir.
      let path = dir + '/' + name;

      // Si le répertoire existe, retourne la liste de ses fichiers et dossiers.
      if (fs.existsSync(path)) {
          res.status(200).json(listerRepertoireSync(path));
      } else {

          // Si le répertoire n'existe pas, retourne une erreur 404.
          res.status(404).json({ error: 'Le dossier demandé n\'existe pas' });
      }

  } else {
      
      // Si aucun nom n'est spécifié dans la requête, liste le répertoire par défaut.
      res.status(200).json(listerRepertoireSync(dir));
  }
});













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
