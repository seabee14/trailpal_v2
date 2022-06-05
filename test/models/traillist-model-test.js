import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testTraillists, munster } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Traillist Model tests", () => {

  setup(async () => {
    db.init("mongo");
    await db.traillistStore.deleteAllTraillists();
    for (let i = 0; i < testTraillists.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testTraillists[i] = await db.traillistStore.addTraillist(testTraillists[i]);
    }
  });

  test("create a traillist", async () => {
    const traillist = await db.traillistStore.addTraillist(munster);
    assertSubset(munster, traillist);
    assert.isDefined(traillist._id);
  });

  test("delete all traillists", async () => {
    let returnedTraillists = await db.traillistStore.getAllTraillists();
    assert.equal(returnedTraillists.length, 3);
    await db.traillistStore.deleteAllTraillists();
    returnedTraillists = await db.traillistStore.getAllTraillists();
    assert.equal(returnedTraillists.length, 0);
  });

  test("get a Traillist - success", async () => {
    const traillist = await db.traillistStore.addTraillist(munster);
    const returnedTraillist = await db.traillistStore.getTraillistById(traillist._id);
    assertSubset(munster, traillist);
  });

  test("delete One Trailist - success", async () => {
    const id = testTraillists[0]._id;
    await db.traillistStore.deleteTraillistById(id);
    const returnedTraillists = await db.traillistStore.getAllTraillists();
    assert.equal(returnedTraillists.length, testTraillists.length - 1);
    const deletedTraillist = await db.traillistStore.getTraillistById(id);
    assert.isNull(deletedTraillist);
  });

  test("get a traillist - bad params", async () => {
    assert.isNull(await db.traillistStore.getTraillistById(""));
    assert.isNull(await db.traillistStore.getTraillistById());
  });

  test("delete One traillist - fail", async () => {
    await db.traillistStore.deleteTraillistById("bad-id");
    const allTraillists = await db.traillistStore.getAllTraillists();
    assert.equal(testTraillists.length, allTraillists.length);
  });
});