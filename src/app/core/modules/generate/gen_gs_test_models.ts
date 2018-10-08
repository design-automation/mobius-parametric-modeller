import { writeGsToJSONFile } from "../libs/filesys/filesys";
import * as gs from "gs-json";
import * as gsm from "../index";
import * as weeks from "./models_weeks";
import * as circles from "./models_circles";
import * as plines from "./models_plines";
import * as pmeshes from "./models_pmeshes";
import * as object from "./models_object";
import * as points from "./models_points";

/**
 * Execute using NPM, models get saved in the /src/assets/ folder.
 * 1) "npm run build_gs_models" OR
 * 2) "npm run build_models" (which builds both three and gs)
 */

const path: string = "../gs-modelling/src/assets/gs-json/";

if (require.main === module) {
    console.log("GS files: circles...");
    writeGsToJSONFile(circles.genModelTest1(), path + "circles_test1.gs");
    writeGsToJSONFile(circles.genModelTest1b(), path + "circles_test1b.gs");
    writeGsToJSONFile(circles.genModelTest1c(), path + "circles_test1c.gs");
    writeGsToJSONFile(circles.genModelTest1d(), path + "circles_test1d.gs");
    writeGsToJSONFile(circles.genModelTest2(), path + "circles_test2.gs");
    writeGsToJSONFile(circles.genModelTest3(), path + "circles_test3.gs");
    writeGsToJSONFile(circles.genModelTest4(), path + "circles_circles_test4.gs");
    writeGsToJSONFile(circles.genModelTest5(), path + "circles_test5.gs");
    writeGsToJSONFile(circles.genModelTest6(), path + "circles_test6.gs");
    writeGsToJSONFile(circles.genModelTest7(), path + "circles_test7.gs");
    writeGsToJSONFile(circles.genModelTest8(), path + "circles_test8.gs");
    writeGsToJSONFile(circles.genModelTest9(), path + "circles_test9.gs");
}

if (require.main === module) {
    console.log("GS files: plines...");
    writeGsToJSONFile(plines.genModelTest1(), path + "plines_test1.gs");
    writeGsToJSONFile(plines.genModelTest2(), path + "plines_test2.gs");
    writeGsToJSONFile(plines.genModelTest3(), path + "plines_test3.gs");
    writeGsToJSONFile(plines.genModelTest4(), path + "plines_test4.gs");
    writeGsToJSONFile(plines.genModelTest5(), path + "plines_test5.gs");
    writeGsToJSONFile(plines.genModelTest6(), path + "plines_test6.gs");
    writeGsToJSONFile(plines.genModelTest7(), path + "plines_test7.gs");
    writeGsToJSONFile(plines.genModelTest8(), path + "plines_test8.gs");
    writeGsToJSONFile(plines.genModelTest9(), path + "plines_test9.gs");
    writeGsToJSONFile(plines.genModelTest10(),path + "plines_test10.gs");
    writeGsToJSONFile(plines.genModelTest11(),path + "plines_test11.gs");
    writeGsToJSONFile(plines.genModelTest12(),path + "plines_test12.gs");
    writeGsToJSONFile(plines.genModelTest13(),path + "plines_test13.gs");
    writeGsToJSONFile(plines.genModelTest14(),path + "plines_test14.gs");
    writeGsToJSONFile(plines.genModelTest15(),path + "plines_test15.gs");
}

if (require.main === module) {
    console.log("GS files: pmeshes...");
    writeGsToJSONFile(pmeshes.genModelTest1(), path + "pmeshes_test1.gs");
    writeGsToJSONFile(pmeshes.genModelTest2(), path + "pmeshes_test2.gs");
    writeGsToJSONFile(pmeshes.genTriStrip(), path +   "pmeshes_genTriStrip.gs");
}

if (require.main === module) {
    console.log("GS files: objs...");
    writeGsToJSONFile(object.genModelTest1(), path + "obj_test1.gs");
    writeGsToJSONFile(object.genModelTest2(), path + "obj_test2.gs");
    writeGsToJSONFile(object.genModelTest3(), path + "obj_test3.gs");
    writeGsToJSONFile(object.genModelTest4(), path + "obj_test4.gs");
}

if (require.main === module) {
    console.log("GS files: points...");
    writeGsToJSONFile(points.genModelTest1(), path + "point_test1.gs");
}
