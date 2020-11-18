import * as isect from '@libs/geom/intersect';
import * as dist from '@libs/geom/distance';

export const intersect = isect.intersect;
export const project = isect.project;
export const distance = dist.distance;
export const distanceM = dist.distanceManhattan;
export const distanceMS = dist.distanceManhattanSq;