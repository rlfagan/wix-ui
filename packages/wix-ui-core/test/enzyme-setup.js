const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

// signature_pad library type declaration contains export = SignaturePad
// which is invalid in jest (as a default import) - this will be solved
// by migarting jest configuration to yoshi 4

jest.mock('signature_pad', () => function MockSignaturePad() {
    this.clear = jest.fn();
    this.off = jest.fn();
    this.on = jest.fn();
    this.toData = jest.fn();
    this.toDataURL = jest.fn();
    this.fromData = jest.fn();
    this.fromDataURL = jest.fn();
    this.isEmpty = jest.fn();
    this.onEnd = jest.fn();
});
