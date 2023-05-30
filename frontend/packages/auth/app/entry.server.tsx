import type { EntryContext } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "stream";
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';


const ABORT_DELAY = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let didError = false;
    const cache = createCache();
    let { pipe, abort } = renderToPipeableStream(
      <StyleProvider cache={cache}>
        <RemixServer context={remixContext} url={request.url} />
      </StyleProvider>,
      {
        onShellReady: () => {
          const styleText = extractStyle(cache)
          let body = new PassThrough({
            transform: (chunk, _, callback) => {
              // add styles to response
              if (chunk.toString().includes("__STYLES__")) {
                chunk = chunk.toString().replace("__STYLES__", styleText);
              }
              return callback(null, chunk);
            }
          });

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError: (err) => {
          reject(err);
        },
        onError: (error) => {
          didError = true;

          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
