import assert from 'assert';

class Compare {
  static equality(array1, array2) {
    try {
      assert.deepStrictEqual(array1, array2);
      return true;
    } catch (error) {
      return false;
    }
  }
}
export default Compare;
