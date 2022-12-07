const mysql = require(`mysql2`);
const express = require(`express`);
const app = express();
const cors = require(`cors`);

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
app.use(cors());

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`listening on port 3000`);
  }
});

const con = mysql.createConnection({
  host: `localhost`,
  user: `root`,
  database: `autoparks`,
  multipleStatements: true,
});

app.get(`/auto`, (req, res) => {
  con.query(
    `SELECT apliecibas_nr, reg_nr, auto.vin, auto.tipa_nr, auto.sedvietas, auto.piezimes, pilsetas.pilseta, adreses.iela, markas.marka, modeli.modelis , krasas.krasa, motori.tilpums, veidi.veids,  degvielas.degviela  FROM pase
  LEFT JOIN auto AS auto ON pase.auto_id = auto.id 
  LEFT JOIN adreses AS adreses on pase.adrese_id = adreses.id
  LEFT JOIN markas AS markas on auto.marka_id = markas.id
  LEFT JOIN krasas AS krasas on auto.krasa_id = krasas.id
  LEFT JOIN motori AS motori on auto.motors_id = motori.id
  LEFT JOIN veidi AS veidi on auto.veids_id = veidi.id
  LEFT JOIN degvielas AS degvielas on motori.degviela_id = degvielas.id
  LEFT JOIN modeli AS modeli ON auto.modelis_id = modeli.id
  LEFT JOIN pilsetas AS pilsetas ON adreses.pilseta_id = pilsetas.id`,
    (err, result) => {
      if (err) {
        res.send(err);
        return;
      } else {
        res.send(result);
        return;
      }
    }
  );
});

app.post(`/auto`, async (req, res) => {
  const apliecibasNr = req.body.apliecibasNr;
  const regNr = req.body.regNr;
  const marka = req.body.marka;
  const modelis = req.body.modelis;
  const vin = req.body.vin;
  const pilseta = req.body.pilseta;
  const iela = req.body.iela;
  const tipaNr = req.body.tipaNr;
  const tilpums = req.body.tilpums;
  const jauda = req.body.jauda;
  const degviela = req.body.degviela;
  const krasa = req.body.krasa;
  const sedvietas = req.body.sedvietas;
  const veids = req.body.veids;
  const piezimes = req.body.piezimes;

  try {
    const ret = await new Promise((resolve) => {
      con.query(
        `CALL adresesCheck(${pilseta}, "${iela}");
         INSERT IGNORE INTO krasas (krasa) VALUES ("${krasa}");
         INSERT IGNORE INTO markas (marka) VALUES ("${marka}");
         INSERT IGNORE INTO modeli (modelis) VALUES ("${modelis}");
         CALL motoruCheck(${tilpums}, "${degviela}");
         INSERT INTO auto (marka_id, modelis_id, vin, tipa_nr, krasa_id, motors_id, sedvietas, veids_id, piezimes) VALUES ((SELECT id FROM markas WHERE marka="${marka}"),(SELECT id FROM modeli WHERE modelis="${modelis}") ,"${vin}", "${tipaNr}", (SELECT id FROM krasas WHERE krasa="${krasa}"),(SELECT id from motori WHERE tilpums="${tilpums}" AND degviela_id="${degviela}") , "${sedvietas}", "${veids}", "${piezimes}");
         INSERT INTO pase (apliecibas_nr, reg_nr, auto_id, adrese_id) VALUES ("${apliecibasNr}", "${regNr}", (SELECT id FROM auto WHERE vin="${vin}"), (SELECT id FROM adreses WHERE pilseta_id=${pilseta} AND iela="${iela}"));
         `,
        (err, result) => {
          if (err) {
            res.send(err).status(500);
            return;
          }
          resolve({ all: "good" });
        }
      );
    });
    console.log(ret);
    res.send(ret);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.delete(`/auto`, async (req, res) => {
  con.query(
    `
    DELETE FROM pase WHERE apliecibas_nr="${req.body.apliecibas_nr}" AND reg_nr="${req.body.reg_nr}";
    DELETE FROM auto WHERE tipa_nr="${req.body.tipa_nr}" AND vin="${req.body.vin}";
  `,
    (err, result) => {
      if (err) {
        res.send(err);
        return;
      } else {
        res.send({ successfully: "deleted" });
      }
    }
  );
});
