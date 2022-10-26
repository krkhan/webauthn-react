import "./App.css";
import { useState } from "react";
import base64url from "base64url";
import { Buffer } from "buffer";

window.Buffer = window.Buffer || require("buffer").Buffer;

function publicKeyCredentialToJSON(pubKeyCred) {
  if (Array.isArray(pubKeyCred)) {
    return pubKeyCred.map((i) => publicKeyCredentialToJSON(i));
  }
  if (pubKeyCred instanceof ArrayBuffer) {
    return base64url.encode(pubKeyCred);
  }
  if (pubKeyCred instanceof Object) {
    const obj = {};
    for (const key in pubKeyCred) {
      if (pubKeyCred[key]) {
        obj[key] = publicKeyCredentialToJSON(pubKeyCred[key]);
      }
    }
    return obj;
  }
  return pubKeyCred;
}

function App() {
  const [generalOutput, setGeneralOutput] = useState("Response");
  const [extensionsOutput, setExtensionsOutput] = useState("Extensions");
  const [errorsOutput, setErrorsOutput] = useState("(No errors)");

  function register() {
    setGeneralOutput("Registering");

    navigator.credentials
      .create({
        publicKey: {
          challenge: Uint8Array.from(
            window.atob(
              "QSBxdWljayBicm93biBmb3gganVtcHMgb3ZlciB0aGUgbGF6eSBkb2cu"
            ),
            (c) => c.charCodeAt(0)
          ),
          rp: {
            name: "Vandelay Import/Export & Latex",
          },
          user: {
            id: Uint8Array.from(window.atob("a3JraGFu"), (c) =>
              c.charCodeAt(0)
            ),
            name: "Kamran Khan",
            displayName: "An Insufferable Git",
          },
          pubKeyCredParams: [
            {
              type: "public-key",
              alg: -7, // "ES256"
            },
            {
              type: "public-key",
              alg: -257, // "RS256"
            },
          ],
          authenticatorSelection: {
            userVerification: "required",
          },
          extensions: {
            credProps: true,
            uvm: true,
            largeBlob: "preferred",
            prf: {
              first: Uint8Array.from(
                window.atob(
                  "QSBxdWljayBicm93biBmb3gganVtcHMgb3ZlciB0aGUgbGF6eSBkb2cu"
                ),
                (c) => c.charCodeAt(0)
              ),
            },
            devicePubKey: {
              attestation: "none",
            },
          },
        },
      })
      .then((res) => {
        console.log(res);
        setGeneralOutput(
          JSON.stringify(publicKeyCredentialToJSON(res), null, 2)
        );
        const extensions = res.getClientExtensionResults();
        console.log(extensions);
        setExtensionsOutput(JSON.stringify(extensions, null, 2));
      })
      .catch((err) => {
        console.error(err);
        setErrorsOutput(err);
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={register}>Register</button>
        <textarea
          style={{
            margin: "5px",
            width: "300px",
            height: "300px",
          }}
          name="general-output"
          readOnly={true}
          value={generalOutput}
        ></textarea>
        <textarea
          style={{
            margin: "5px",
            width: "300px",
            height: "300px",
          }}
          name="extensions-output"
          readOnly={true}
          value={extensionsOutput}
        ></textarea>
        <textarea
          style={{
            margin: "5px",
            width: "300px",
            height: "300px",
          }}
          name="errors-output"
          readOnly={true}
          value={errorsOutput}
        ></textarea>
      </header>
    </div>
  );
}

export default App;
