/// <reference path="./TestSuit.ts" />
/// <reference path="./GobstonesTests.ts" />


GobstonesTests.forEach((testCase) => {
    console.log("Executing test", testCase.name)
    QUnit.test("A test", testCase.test);
});