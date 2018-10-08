import * as gs from "gs-json";
import * as gsm from "../index";
import {} from "jasmine";

describe("Tests for Group Module", () => {
    it("test_group_getChildren", () => {
        expect( test_group_getChildren() ).toBe(true);
    });
    it("test_group_addPoints", () => {
        expect( test_group_addPoints() ).toBe(true);
    });
    it("test_group_addPoints_v2", () => {
        expect( test_group_addPoints_v2() ).toBe(true);
    });
});

export function test_group_getChildren(): boolean {
    const m: gs.IModel = gsm.model.New();
    const points1: gs.IPoint[] = gsm.point.FromXYZs(m, [[1,2,3],[2,2,2],[-1,-2,-33],[1.1,2.2,3.3]]);
    const points2: gs.IPoint[] = gsm.point.FromXYZs(m, [[4,5,6],[2,7,5]]);
    const points3: gs.IPoint[] = gsm.point.FromXYZs(m, [[8,8,8],[6,6,6],[4,4,4]]);

    gsm.group.Create(m, "main");

    gsm.group.Create(m, "grp1");
    gsm.group.setParent(m, "grp1", "main");
    gsm.point.addToGroup(points1, "grp1");

    gsm.group.Create(m, "grp2");
    gsm.group.setParent(m, "grp2", "main");
    gsm.point.addToGroup(points2, "grp2");

    gsm.group.Create(m, "grp3");
    gsm.group.setParent(m, "grp3", "main");
    gsm.point.addToGroup(points3, "grp3");

    const children: string[] = gsm.group.getChildren(m, "main");
    if(children.length !== 3) {return false;}
    if(children[0] !== "grp1") {return false;}
    if(children[1] !== "grp2") {return false;}
    if(children[2] !== "grp3") {return false;}
    return true;
}

export function test_group_addPoints(): boolean {
    const m: gs.IModel = gsm.model.New();

    const o: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const c: gs.ICircle = gsm.circle.FromOriginXY(o, 9, null);
    const pl: gs.IPolyline = gsm.pline.FromCircle(c, 24);
    gsm.group.Create(m, "test");
    let counter: number = 0;
    for (let i = 0; i < 2; i++) {
        //add some objects
        const pl2: gs.IPolyline = gsm.object.move(pl, [1,2,3], true) as gs.IPolyline;
        //let pl3: gs.IPolyline = gsm.object.move(pl2, [1,2,3], true) as gs.IPolyline;
        //pl3 = gsm.object.move(pl3, [1,2,3], false) as gs.IPolyline;
        const pts: gs.IPoint[] = gsm.point.GetFromObjs([pl, pl2]);
        const num_pts: number = pts.length;
        counter += num_pts;
        gsm.point.addToGroup(pts, "test");
    }
    const pts_final: gs.IPoint[] = gsm.point.GetFromGroup(m, "test");

    // console.log(counter, pts_final.length);
    return true;
}

export function test_group_addPoints_v2(): boolean {
    const m: gs.IModel = gsm.model.New();
    const o: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    const o1: gs.IPoint = gsm.point.FromXYZ(m, [0,0,0]);
    gsm.group.Create(m, "test");
    gsm.point.addToGroup(o, "test");
    gsm.point.addToGroup(o, "test");
    gsm.point.addToGroup(o1, "test");
    const pts_final: gs.IPoint[] = gsm.point.GetFromGroup(m, "test");
    if(pts_final.length !== 2) {return false;}
    return true;
}
