import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { trailtimeService } from "./trailtime-service.js";
import { maggie, munster, testTraillists, testTrails, leinster } from "../fixtures.js";

suite("Trail API tests", () => {
  let user = null;
  let munsterTrails = null;

  setup(async () => {
    await trailtimeService.deleteAllTraillists();
    await trailtimeService.deleteAllUsers();
    await trailtimeService.deleteAllTrails();
    user = await trailtimeService.createUser(maggie);
    munster.userid = user._id;
    munsterTrails = await trailtimeService.createTraillist(munster);
  });

  teardown(async () => {});

  test("create trail", async () => {
    const returnedTrail = await trailtimeService.createTrail(munsterTrails._id, leinster);
    assertSubset(leinster, returnedTrail);
  });

  test("create Multiple trails", async () => {
    for (let i = 0; i < testTrails.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await trailtimeService.createTrail(munsterTrails._id, testTrails[i]);
    }
    const returnedTrails = await trailtimeService.getAllTrails();
    assert.equal(returnedTrails.length, testTrails.length);
    for (let i = 0; i < returnedTrails.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const trail = await trailtimeService.getTrail(returnedTrails[i]._id);
      assertSubset(trail, returnedTrails[i]);
    }
  });

  test("Delete TrailApi", async () => {
    for (let i = 0; i < testTrails.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await trailtimeService.createTrail(munsterTrails._id, testTrails[i]);
    }
    let returnedTrails = await trailtimeService.getAllTrails();
    assert.equal(returnedTrails.length, testTrails.length);
    for (let i = 0; i < returnedTrails.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const trail = await trailtimeService.deleteTrail(returnedTrails[i]._id);
    }
    returnedTrails = await trailtimeService.getAllTrails();
    assert.equal(returnedTrails.length, 0);
  });

  test("denormalised traillist", async () => {
    for (let i = 0; i < testTrails.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await trailtimeService.createTrail(munsterTrails._id, testTrails[i]);
    }
    const returnedTraillist = await trailtimeService.getTraillist(munsterTrails._id);
    assert.equal(returnedTraillist.trails.length, testTrails.length);
    for (let i = 0; i < testTrails.length; i += 1) {
      assertSubset(testTrails[i], returnedTraillist.trails[i]);
    }
  });
});