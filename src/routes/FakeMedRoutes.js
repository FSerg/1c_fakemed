import express from 'express';
import bearer from '../middlewares/bearer';
import FakeMed from '../models/FakeMed';
import utils from './FakeMedUtils';

const router = express.Router();

router.get('/update', bearer, async (req, res) => {
  console.log('GET manual update fakemed!');
  console.log(req.query);

  if (req.query === undefined) {
    return res.status(400).send({
      result: utils.errorMessage(req.query, 'req.query date_begin date_end')
    });
  }

  const error1 = utils.checkField(req.query.date_begin, 'req.query.date_begin');
  if (error1) {
    return res.status(400).send({ result: error1 });
  }

  const error2 = utils.checkField(req.query.date_end, 'req.query.date_end');
  if (error2) {
    return res.status(400).send({ result: error2 });
  }

  try {
    const saveResult = await utils.UpdateFakeMeds(
      req.query.date_begin,
      req.query.date_end
    );
    // return res.status(200).send({ result: saveResult });
    return res.status(200).send({ result: 'OK' });
  } catch (err) {
    const errorMessage = `Error to update FakeMeds: ${err}`;
    console.error(errorMessage);
    return res.status(400).send({ result: errorMessage });
  }
});

router.get('/', bearer, (req, res) => {
  console.log('GET list of fakemeds!');
  console.log(req.query);

  if (req.query === undefined) {
    return res
      .status(400)
      .send({ result: utils.errorMessage(req.query, 'req.query drugstore') });
  }

  const { drugstore } = req.query;
  const error1 = utils.checkField(drugstore, 'req.query.drugstore');
  if (error1) {
    return res.status(400).send({ result: error1 });
  }

  FakeMed.find(
    { updated_drugstores: { $ne: drugstore } },
    { updated_drugstores: 0 },
    async (err, results) => {
      if (err) {
        const errorMessage = 'Error to query fakemeds!';
        console.error(errorMessage);
        return res.status(400).send({ result: errorMessage });
      }
      const updateResults = await FakeMed.update(
        {
          updated_drugstores: { $ne: drugstore }
        },
        { $push: { updated_drugstores: drugstore } },
        { multi: true }
      );
      return res.status(200).send({ result: results });
    }
  );
});

export default router;
