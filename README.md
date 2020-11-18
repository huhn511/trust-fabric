# Trust Fabric


## Setup
```bash
git clone https://github.com/huhn511/trust-fabric
cd trust-fabric
npm install
npm start
```

Go to `http://localhost:3000`.
You should see the DID Document if the Trust Frabric.

## Register a Sensor

Send a `POST` request to `/register_sensor` with the `DID` in the parameter.

Example curl command:
```bash
curl -d "did=did:iota:main:ESDYMt2zmcsUpNonnHAq3kB2KXWMKg3zBxZaQgwMkw3G" -X POST http://localhost:3000/register_sensor
```

Example respone:

```json
{
    "@context": "https://www.w3.org/2018/credentials/v1",
    "id": "http://trusted.com/credentials/1337",
    "type": [
        "VerifiableCredential",
        "TrustedSource"
    ],
    "credentialSubject": {
        "id": "did:iota:main:ESDYMt2zmcsUpNonnHAq3kB2KXWMKg3zBxZaQgwMkw3G",
        "name": "Trusted Sensor Crendential",
        "degree": {
            "name": "Example Sensor with Trusted Data",
            "type": "TrustedSensor"
        }
    },
    "issuer": "did:iota:main:DcJm8jR3yUacbzQXJuJN5DNvf98xprX2umRrKecJp7Wj",
    "issuanceDate": "2020-11-18T22:53:25Z",
    "proof": {
        "type": "JcsEd25519Signature2020",
        "verificationMethod": "did:iota:main:DcJm8jR3yUacbzQXJuJN5DNvf98xprX2umRrKecJp7Wj#authentication",
        "created": "2020-11-18T22:53:25Z",
        "signatureValue": "AvGuXK9sAR6gkJnXDqLAH3oZzPHbwtbhUKoVRAks977zyfthCqzkkbc4tfzoi5wrHDemfkGw9eQ3C254WCwMzQnHP7zcfK59Hn3rDukkPn4i4bvTtM5nwBjQf8LRxDNNVpP"
    }
}
```