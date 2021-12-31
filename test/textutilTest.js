const chai = require('chai')
var expect = chai.expect;
const textutils = require('../app/utils/textutils');

var bracketString = '(Hello)';
var withoutBracketString = 'Hello';
var newLineString = 'Hello\n';
var withoutNewLineString = 'Hello';

try {

  expect(textutils.removeBrackets(bracketString)).to.equal(withoutBracketString);
  expect(textutils.removeNewLines(newLineString)).to.equal(withoutNewLineString);

} catch(error) {
  console.log(error);
} finally {
  console.log("All Test Cases Executed");
}
