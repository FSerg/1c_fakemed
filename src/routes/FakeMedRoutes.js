import express from 'express';
import bearer from '../middlewares/bearer';
import FakeMed from '../models/FakeMed';
import utils from './FakeMedUtils';
import log from '../Logging';

const router = express.Router();

router.get('/update', bearer, async (req, res) => {
  log.info('GET manual update fakemed!');
  log.info(req.query);

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
    await utils.UpdateFakeMeds(req.query.date_begin, req.query.date_end);
    return res.status(200).send({ result: 'OK' });
  } catch (err) {
    const errorMessage = `Error to update FakeMeds: ${err}`;
    log.error(errorMessage);
    return res.status(400).send({ result: errorMessage });
  }
});

router.get('/', bearer, (req, res) => {
  log.info('GET list of fakemeds!');
  log.info(req.query);

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

  return FakeMed.find(
    { updated_drugstores: { $ne: drugstore } },
    { updated_drugstores: 0 },
    async (err, results) => {
      if (err) {
        const errorMessage = 'Error to query fakemeds!';
        log.error(errorMessage);
        return res.status(400).send({ result: errorMessage });
      }
      await FakeMed.update(
        { updated_drugstores: { $ne: drugstore } },
        { $push: { updated_drugstores: drugstore } },
        { multi: true }
      );
      return res.status(200).send({ result: results });
    }
  );
});

export default router;
