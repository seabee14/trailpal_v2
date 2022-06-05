import { assert } from "chai";
import { trailtimeService } from "./trailtime-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, munster, testTraillists } from "../fixtures.js";

suite("Traillist API tests", () => {

    let user = null;

    setup(async () => {
      await trailtimeService.deleteAllTraillists();
      await trailtimeService.deleteAllUsers();
      user = await trailtimeService.createUser(maggie);
      munster.userid = user._id;
    });

  teardown(async () => {});

  test("create traillist", async () => {
    const returnedTraillist = await trailtimeService.createTraillist(munster);
    assert.isNotNull(returnedTraillist);
    assertSubset(munster, returnedTraillist);
  });

  test("delete a traillist", async () => {
    const traillist = await trailtimeService.createTraillist(munster);
    const response = await trailtimeService.deleteTraillist(traillist._id);
    assert.equal(response.status, 204);
    try {
      const returnedTraillist = await trailtimeService.getTraillist(traillist.id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Traillist with this id", "Incorrect Response Message");
    }
  });

  test("create multiple traillists", async () => {
    for (let i = 0; i < testTraillists.length; i += 1) {
      testTraillists[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await trailtimeService.createTraillist(testTraillists[i]);
    }
    let returnedLists = await trailtimeService.getAllTraillists();
    assert.equal(returnedLists.length, testTraillists.length);
    await trailtimeService.deleteAllTraillists();
    returnedLists = await trailtimeService.getAllTraillists();
    assert.equal(returnedLists.length, 0);
  });

  test("remove non-existant traillist", async () => {
    try {
      const response = await trailtimeService.deleteTraillist("not an id");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Traillist with this id", "Incorrect Response Message");
    }
  });
});