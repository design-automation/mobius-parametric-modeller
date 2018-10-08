import * as gs from "gs-json";
import * as test from "./threex";
import * as three from "three";
import {Arr} from "../arr/arr";

import {} from "jasmine";

describe("Tests for Three Utils Dev", () => {
    it("test_multVectorMatrix", () => {
        expect(test_multVectorMatrix()).toBe(true);
    });
    it("test_xformMatrixPointXYZs", () => {
        expect(test_xformMatrixPointXYZs()).toBe(true);
    });
    it("test_xformMatrix", () => {
        expect(test_xformMatrix()).toBe(true);
    });
    it("test_subVectors", () => {
        expect(test_subVectors()).toBe(true);
    });
    it("test_planesAreCoplanar", () => {
        expect(test_planesAreCoplanar()).toBe(true);
    });
    it("test_pointIsOnPlane", () => {
        expect( test_pointIsOnPlane() ).toBe(true);
    });
    it("test_vectorsAreCodir", () => {
        expect( test_vectorsAreCodir()).toBe(true);
    });
    it("test_xformMatrixFromXYZVectors", () => {
        expect( test_xformMatrixFromXYZVectors()).toBe(true);
    });
    it("test_xformMatrixPos", () => {
        expect( test_xformMatrixPos()).toBe(true);
    });

});

 // Matrices ======================================================================================================
export function test_multVectorMatrix() {
    const O: three.Vector3 = new three.Vector3(-2,-1,-3);
    const v11: three.Vector3 = new three.Vector3(1,0,0);
    const v12: three.Vector3 = new three.Vector3(0,1,0);
    const m1: three.Matrix4 = test.xformMatrixNeg(O,v11,v12);
    const vector1: three.Vector3 = new three.Vector3(1,1,1);
    const vector2: three.Vector3 = test.multVectorMatrix(vector1,m1);
    if(!Arr.equal([vector2.x,vector2.y,vector2.z],[3,2,4])) {return false;}

    const O2: three.Vector3 = new three.Vector3(10,-5,-2);
    const v21: three.Vector3 = new three.Vector3(0,1,0);
    const v22: three.Vector3 = new three.Vector3(-1,0,0);
    const m2: three.Matrix4 = test.xformMatrixNeg(O2,v21,v22);
    const vector21: three.Vector3 = new three.Vector3(2,4,4);
    const vector22: three.Vector3 = test.multVectorMatrix(vector21,m2);
    if(!Arr.equal([vector22.x,vector22.y,vector22.z],[9,8,6])) {return false;}
    return true;
}

export function test_xformMatrixPointXYZs() {

    return true;
}

export function test_xformMatrix() {
    const O1: three.Vector3 = new three.Vector3(1,0,0);
    const v11: three.Vector3 = new three.Vector3(1,0,0);
    const v12: three.Vector3 = new three.Vector3(0,1,0);
    const m1: three.Matrix4 = test.xformMatrixNeg(O1,v11,v12);
    // console.log(m1.elements);
    return true;
}

//  Vectors =======================================================================================================

export function test_subVectors() {
    const A: three.Vector3 = new three.Vector3(0,1,4);
    const B: three.Vector3 = new three.Vector3(2,8,6);
    const BA: three.Vector3 = test.subVectors(A,B,false);
    if(!Arr.equal([BA.x,BA.y,BA.z],[-2,-7,-2])) {return false;}
    return true;
}

//  Query ======================================================================================================
export function test_planesAreCoplanar() {
    const m: gs.IModel = new gs.Model();
    const g: gs.IGeom = m.getGeom();
    const O1: gs.IPoint = g.addPoint([0,0,0]);
    const O2: gs.IPoint = g.addPoint([1,0,1]);

    if(!test.planesAreCoplanar(O1,[0,0,1],O1,[0,0,1])) {return false;}
    if(test.planesAreCoplanar(O1,[0,0,1],O2,[0,0,1])) {return false;}
    if(test.planesAreCoplanar(O1,[0,0,1],O1,[0,1,1])) {return false;}

    return true;
}

export function test_pointIsOnPlane() {
    const m: gs.IModel = new gs.Model();
    const g: gs.IGeom = m.getGeom();
    const O: gs.IPoint = g.addPoint([0,0,0]);
    const normal1: gs.XYZ = [0,0,1];
    const normal2: gs.XYZ = [0,1,0];
    const pt1: gs.IPoint = g.addPoint([1,1,0]);
    if(!test.pointIsOnPlane(O, normal1, pt1)) {return false;}
    if(test.pointIsOnPlane(O, normal2, pt1)) {return false;}
    return true;
}
export function test_vectorsAreCodir() {
    const xyz1: gs.XYZ = [1,0,0];
    const xyz2: gs.XYZ = [4,0,0];
    const xyz3: gs.XYZ = [0,1,0];
    const xyz4: gs.XYZ = [0.0000009,0,0];
    const xyz5: gs.XYZ = [0,0,0];

    if(!test.vectorsAreCodir(xyz1,xyz1)) {return false;}
    if(!test.vectorsAreCodir(xyz1,xyz2)) {return false;}
    if(test.vectorsAreCodir(xyz1,xyz3)) {return false;}
    if(!test.vectorsAreCodir(xyz1,xyz4)) {return false;}
    if(test.vectorsAreCodir(xyz1,xyz5)) {return false;}

    return true;
}

export function test_xformMatrixFromXYZVectors() {
    const xyz1: gs.XYZ = [5,6,7];
    const xyz2: gs.XYZ = [1,1,0];
    const xyz3: gs.XYZ = [0,1,0];
    const xyz4: gs.XYZ = [0,0,0];
    const matrix = test.xformMatrixFromXYZVectors(xyz1, xyz2, xyz3, false);
    const point: three.Vector3 = new three.Vector3(...xyz4);
    point.applyMatrix4(matrix);
    if(point.z !== 7) {return false;}
    return true;
}

export function test_xformMatrixPos() {
    const v1: three.Vector3 = new three.Vector3(5,6,7);
    const v2: three.Vector3 = new three.Vector3(1,0,0);
    const v3: three.Vector3 = new three.Vector3(0,1,0);
    const v4: three.Vector3 = new three.Vector3(0,0,0);
    const matrix = test.xformMatrixPos(v1, v2, v3);
    v4.applyMatrix4(matrix);
    if(v4.z !== 7) {return false;}
    return true;
}
