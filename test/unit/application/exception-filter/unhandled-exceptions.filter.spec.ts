import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { expect } from 'chai';
import { freeze, reset } from 'timekeeper';
import { instance, mock, when } from 'ts-mockito';
import { UnhandledExceptionsFilter } from '../../../../src/application/exception-filter/unhandled-exceptions.filter';

describe('UnhandledExceptionsFilter', () => {
  const filter = new UnhandledExceptionsFilter();

  describe('Given appropriate arguments (HttpArgumentsHost)', () => {
    const mockedHost: ArgumentsHost = mock<ArgumentsHost>();
    const requestUrl = 'any/url';
    const currentTime = new Date();
    let receivedResponseJson: any;

    before(async () => {
      const mockedHttpHost: HttpArgumentsHost = mock<HttpArgumentsHost>();

      when(mockedHttpHost.getRequest<any>()).thenReturn({
        url: requestUrl,
      });

      when(mockedHttpHost.getResponse<any>()).thenReturn({
        status: () => {
          return {
            json: (json: any) => (receivedResponseJson = json),
          };
        },
      });

      when(mockedHost.switchToHttp()).thenReturn(instance(mockedHttpHost));

      freeze(currentTime);
    });

    after(() => {
      reset();
    });

    describe('When catching an unknown error', () => {
      const expectedErrorMessage = 'Unknown error';

      before(async () => {
        filter.catch(Error(expectedErrorMessage), instance(mockedHost));
      });

      it('should reply with an internal server error', async () => {
        expect(receivedResponseJson.statusCode).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      });

      it('should reply with current time', async () => {
        expect(receivedResponseJson.timestamp).to.be.equal(currentTime.toISOString());
      });

      it('should reply with request URL', async () => {
        expect(receivedResponseJson.path).to.be.equal(requestUrl);
      });

      it('should reply with error message', async () => {
        expect(receivedResponseJson.message).to.be.equal(expectedErrorMessage);
      });
    });

    describe('When catching an HTTP exception', () => {
      const expectedHttpStatus = HttpStatus.URI_TOO_LONG;

      const messageError = { message: 'Too long' };
      const expectedHttpException = new HttpException(messageError, expectedHttpStatus);

      before(async () => {
        filter.catch(expectedHttpException, instance(mockedHost));
      });

      it('should reply with an internal server error', async () => {
        expect(receivedResponseJson.statusCode).to.be.equal(expectedHttpStatus);
      });

      it('should reply with current time', async () => {
        expect(receivedResponseJson.timestamp).to.be.equal(currentTime.toISOString());
      });

      it('should reply with request URL', async () => {
        expect(receivedResponseJson.path).to.be.equal(requestUrl);
      });

      it('should reply with error message', async () => {
        expect(receivedResponseJson.message).to.be.equal(messageError);
      });
    });
  });
});
