import nock from 'nock';
import wtf from 'wtfnode';

const dumpOpenHandles = () => {
  // Should be called when tests execution hangs instead of exiting successfully.
  // It helps detecting open handles (which should not exist) after app or tests shutdown.
  wtf.dump();
};

// https://mochajs.org/#defining-a-root-hook-plugin
export const mochaHooks = {
  beforeAll() {
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
  },
  beforeEach() {
    if (!nock.isDone()) {
      console.error('(nock) Some HTTP mocks were not requested:', nock.activeMocks());
    }

    nock.abortPendingRequests();
    nock.cleanAll();
  },
  afterEach() {
    nock.abortPendingRequests();
    nock.cleanAll();
  },
  afterAll() {
    nock.enableNetConnect();
    nock.restore();

    // dumpOpenHandles()
  },
};
