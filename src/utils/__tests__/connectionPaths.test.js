import { getConnectionPoint, calculateConnectionPath } from '../connectionPaths';
import { getClassSize } from '../classSize';

jest.mock('../classSize', () => ({
  getClassSize: jest.fn(),
}));

const mockSize = { width: 100, height: 50 };
const camera = { zoom: 1, offsetX: 0, offsetY: 0 };

describe('getConnectionPoint', () => {
  beforeEach(() => {
    getClassSize.mockReturnValue(mockSize);
  });

  test('returns right center when target is to the right', () => {
    const from = { position: { x: 0, y: 0 } };
    const to = { position: { x: 200, y: 0 } };
    const point = getConnectionPoint(from, to, camera);
    expect(point).toEqual({ x: 100, y: 25 });
  });

  test('returns bottom center when target is below', () => {
    const from = { position: { x: 0, y: 0 } };
    const to = { position: { x: 0, y: 200 } };
    const point = getConnectionPoint(from, to, camera);
    expect(point).toEqual({ x: 50, y: 50 });
  });
});

describe('calculateConnectionPath', () => {
  beforeEach(() => {
    getClassSize.mockReturnValue(mockSize);
  });

  test('creates bezier path for horizontal connection', () => {
    const from = { position: { x: 0, y: 0 } };
    const to = { position: { x: 200, y: 0 } };
    const path = calculateConnectionPath(from, to, camera);
    expect(path).toBe('M 100 25 C 150 25, 150 25, 200 25');
  });

  test('creates bezier path for vertical connection', () => {
    const from = { position: { x: 0, y: 0 } };
    const to = { position: { x: 0, y: 200 } };
    const path = calculateConnectionPath(from, to, camera);
    expect(path).toBe('M 50 50 C 50 100, 50 150, 50 200');
  });
});
